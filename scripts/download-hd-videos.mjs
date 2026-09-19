/**
 * Download Interval HD videos from intervalworld.com into local control.
 *
 * Uses the live Brightcove player page to resolve each video's progressive MP4,
 * then saves files under public/videos/hd/{videoId}.mp4.
 *
 * Usage:
 *   node scripts/download-hd-videos.mjs
 *   node scripts/download-hd-videos.mjs --limit=12
 *   node scripts/download-hd-videos.mjs --concurrency=2
 *
 * Requires: npx playwright (chromium) — installed on first run.
 */
import { spawnSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_FILE = join(ROOT, "data", "interval-hd.ts");
const OUT_DIR = join(ROOT, "public", "videos", "hd");
const MANIFEST = join(OUT_DIR, "manifest.json");
const ACCOUNT = "1441355349001";
const PLAYER_URL = "https://www.intervalworld.com/html/channelPlayer.html";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const CONCURRENCY = Math.max(1, Number(args.concurrency || 2));
const FORCE = args.force === "true";

function ensurePlaywright() {
  try {
    require.resolve("playwright");
    return;
  } catch {
    // ESM — try import path
  }
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    console.log("Installing playwright (one-time)…");
    const r = spawnSync(
      "pnpm",
      ["add", "-D", "playwright", "--ignore-workspace"],
      { cwd: ROOT, stdio: "inherit", shell: true },
    );
    if (r.status !== 0) {
      spawnSync("npx", ["--yes", "playwright", "install", "chromium"], {
        cwd: ROOT,
        stdio: "inherit",
        shell: true,
      });
    }
    spawnSync("npx", ["playwright", "install", "chromium"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    return await import("playwright");
  }
}

function collectVideoIds() {
  const raw = readFileSync(DATA_FILE, "utf8");
  const ids = [...raw.matchAll(/vid=(\d+)/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

async function resolveMp4(page, videoId) {
  await page.goto(`${PLAYER_URL}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => typeof window.videojs === "function", null, {
    timeout: 30000,
  });

  return page.evaluate(
    async ({ videoId, account }) => {
      const videoEl = document.querySelector("video");
      if (videoEl) videoEl.setAttribute("data-video-id", videoId);

      // Ensure Brightcove player is initialized
      await new Promise((r) => setTimeout(r, 800));

      const players = window.videojs.getPlayers();
      let player = players.videoPlayer || Object.values(players)[0];

      if (!player) {
        // Force init if needed
        if (window.bc) {
          window.bc(document.querySelector("video"));
          await new Promise((r) => setTimeout(r, 1000));
          player = window.videojs.getPlayers().videoPlayer || Object.values(window.videojs.getPlayers())[0];
        }
      }

      if (!player?.catalog?.getVideo) {
        throw new Error("Brightcove catalog unavailable");
      }

      const video = await new Promise((resolve, reject) => {
        player.catalog.getVideo(videoId, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const mp4s = (video.sources || [])
        .filter(
          (s) =>
            s.type === "video/mp4" ||
            s.container === "MP4" ||
            (typeof s.src === "string" && s.src.includes(".mp4")),
        )
        .sort((a, b) => (a.height || 0) - (b.height || 0)); // prefer smaller for storage

      // Prefer ~480p if available, else smallest, else largest under 720
      const preferred =
        mp4s.find((s) => (s.height || 0) >= 360 && (s.height || 0) <= 540) ||
        mp4s.find((s) => (s.height || 0) <= 720) ||
        mp4s[0];

      if (!preferred?.src) throw new Error(`No MP4 for ${videoId}`);

      return {
        id: String(video.id || videoId),
        name: video.name || "",
        duration: video.duration || 0,
        poster: video.poster || "",
        src: preferred.src,
        width: preferred.width || null,
        height: preferred.height || null,
        size: preferred.size || null,
        account,
      };
    },
    { videoId, account: ACCOUNT },
  );
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${dest}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const ids = collectVideoIds().slice(0, LIMIT);
  console.log(`Interval HD videos to fetch: ${ids.length}`);

  const { chromium } = await loadPlaywright();
  // Install browser only if missing (quiet check)
  const browserCheck = spawnSync("npx", ["playwright", "install", "--dry-run", "chromium"], {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
  });
  if (/chromium/i.test(browserCheck.stdout || "") && /download/i.test(browserCheck.stdout || "")) {
    spawnSync("npx", ["playwright", "install", "chromium"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });

  const manifest = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, "utf8"))
    : {};

  let done = 0;
  let skipped = 0;
  let failed = 0;

  async function worker(queue) {
    const page = await context.newPage();
    // Seed player with first known video so catalog is ready
    await page.goto(
      `https://www.intervalworld.com/web/my/channel#vid=${ids[0]}&vname=seed`,
      { waitUntil: "networkidle", timeout: 90000 },
    ).catch(() => {});

    while (queue.length) {
      const videoId = queue.shift();
      const dest = join(OUT_DIR, `${videoId}.mp4`);
      if (!FORCE && existsSync(dest) && statSync(dest).size > 50_000) {
        skipped += 1;
        done += 1;
        process.stdout.write(`skip ${videoId} (${done}/${ids.length})\n`);
        continue;
      }

      try {
        // Load via live channel hash so player_frame initializes with this id
        await page.goto(
          `https://www.intervalworld.com/web/my/channel#vid=${videoId}&vname=${videoId}`,
          { waitUntil: "domcontentloaded", timeout: 90000 },
        );
        await page.waitForTimeout(2500);

        const frame = page.frame({ name: "player_frame" }) || page.frames().find((f) => f.url().includes("channelPlayer"));
        if (!frame) throw new Error("player_frame missing");

        await frame.waitForFunction(() => typeof window.videojs === "function", null, {
          timeout: 30000,
        });

        const meta = await frame.evaluate(async (vid) => {
          const players = window.videojs.getPlayers();
          const player = players.videoPlayer || Object.values(players)[0];
          if (!player?.catalog?.getVideo) throw new Error("catalog missing");

          // Load / switch to this video
          const video = await new Promise((resolve, reject) => {
            player.catalog.getVideo(vid, (err, data) => (err ? reject(err) : resolve(data)));
          });

          try {
            player.catalog.load(video);
          } catch {
            /* ignore */
          }

          const mp4s = (video.sources || [])
            .filter(
              (s) =>
                s.type === "video/mp4" ||
                s.container === "MP4" ||
                (typeof s.src === "string" && s.src.includes(".mp4")),
            )
            .sort((a, b) => (a.size || a.height || 0) - (b.size || b.height || 0));

          const preferred =
            mp4s.find((s) => (s.height || 0) >= 360 && (s.height || 0) <= 540) ||
            mp4s.find((s) => (s.height || 0) > 0 && (s.height || 0) <= 720) ||
            mp4s[0];

          if (!preferred?.src) throw new Error("no mp4");

          return {
            id: String(video.id || vid),
            name: video.name || "",
            duration: video.duration || 0,
            poster: video.poster || "",
            src: preferred.src,
            width: preferred.width || null,
            height: preferred.height || null,
            size: preferred.size || null,
          };
        }, videoId);

        await downloadFile(meta.src, dest);
        const bytes = statSync(dest).size;

        // Also cache poster locally when Brightcove provides one
        if (meta.poster) {
          const thumbDir = join(ROOT, "public", "images", "hd", "thumbs");
          mkdirSync(thumbDir, { recursive: true });
          const thumbPath = join(thumbDir, `${videoId}.jpg`);
          if (!existsSync(thumbPath) || statSync(thumbPath).size < 800) {
            try {
              await downloadFile(meta.poster.replace(/^http:\/\//i, "https://"), thumbPath);
            } catch {
              /* non-fatal */
            }
          }
        }

        manifest[videoId] = {
          id: meta.id,
          name: meta.name,
          duration: meta.duration,
          width: meta.width,
          height: meta.height,
          size: meta.size,
          local: `/videos/hd/${videoId}.mp4`,
          thumb: existsSync(join(ROOT, "public", "images", "hd", "thumbs", `${videoId}.jpg`))
            ? `/images/hd/thumbs/${videoId}.jpg`
            : null,
          bytes,
          downloadedAt: new Date().toISOString(),
        };
        writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
        done += 1;
        process.stdout.write(
          `ok ${videoId} ${(bytes / 1e6).toFixed(1)}MB (${done}/${ids.length})\n`,
        );
      } catch (err) {
        failed += 1;
        done += 1;
        process.stdout.write(`fail ${videoId}: ${err.message || err}\n`);
      }
    }

    await page.close();
  }

  const queue = [...ids];
  const workers = Array.from({ length: Math.min(CONCURRENCY, ids.length) }, () =>
    worker(queue),
  );
  await Promise.all(workers);
  await browser.close();

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`Done. ok/skip tracked in manifest. failed=${failed} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
