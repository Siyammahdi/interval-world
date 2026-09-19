/**
 * Ensure every Interval HD video has a local Brightcove poster thumb.
 * Skips IDs that already have public/images/hd/thumbs/{id}.jpg (>= 8KB).
 *
 * Usage: node scripts/ensure-all-hd-thumbs.mjs
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data", "interval-hd.ts");
const OUT = join(ROOT, "public", "images", "hd", "thumbs");
const PAGE = "https://www.intervalworld.com/web/my/channel";
const MIN = 8000;

mkdirSync(OUT, { recursive: true });

function curlDownload(url, dest) {
  const r = spawnSync(
    "curl.exe",
    ["-fsSL", "-A", "Mozilla/5.0", "-e", "https://www.intervalworld.com/", "-o", dest, url],
    { encoding: "utf8" },
  );
  if (r.status !== 0 || !existsSync(dest) || statSync(dest).size < 800) {
    throw new Error(r.stderr || "download failed");
  }
}

async function main() {
  const raw0 = readFileSync(DATA, "utf8");
  const ids = [...new Set([...raw0.matchAll(/"id": "(\d+)"/g)].map((m) => m[1]))];
  const need = ids.filter((id) => {
    const f = join(OUT, `${id}.jpg`);
    return !(existsSync(f) && statSync(f).size >= MIN);
  });

  console.log(`Need posters for ${need.length} / ${ids.length}`);
  if (!need.length) {
    spawnSync("node", [join(ROOT, "scripts", "apply-hd-thumbs.mjs")], {
      stdio: "inherit",
    });
    return;
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < need.length; i++) {
    const id = need[i];
    try {
      await page.goto(`${PAGE}#vid=${id}&vname=${id}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(1800);
      const frame =
        page.frame({ name: "player_frame" }) ||
        page.frames().find((f) => f.url().includes("channelPlayer"));
      if (!frame) throw new Error("no frame");
      await frame.waitForFunction(() => typeof window.videojs === "function", null, {
        timeout: 20000,
      });
      const poster = await frame.evaluate(async (vid) => {
        const players = window.videojs.getPlayers();
        const player = players.videoPlayer || Object.values(players)[0];
        const video = await new Promise((resolve, reject) => {
          player.catalog.getVideo(vid, (err, data) => (err ? reject(err) : resolve(data)));
        });
        return (video.poster || "").replace(/^http:\/\//i, "https://");
      }, id);
      if (!poster) throw new Error("no poster");
      curlDownload(poster, join(OUT, `${id}.jpg`));
      ok += 1;
      process.stdout.write(`ok ${id} (${i + 1}/${need.length})\n`);
    } catch (err) {
      fail += 1;
      process.stdout.write(`fail ${id}: ${err.message || err}\n`);
    }
  }

  await browser.close();

  // Patch data file to prefer local thumbs
  let raw = readFileSync(DATA, "utf8");
  for (const id of ids) {
    const f = join(OUT, `${id}.jpg`);
    if (!existsSync(f) || statSync(f).size < 800) continue;
    raw = raw.replace(
      new RegExp(`("id": "${id}"[\\s\\S]*?"image": ")([^"]+)(")`),
      `$1/images/hd/thumbs/${id}.jpg$3`,
    );
  }
  writeFileSync(DATA, raw);
  console.log(`Done. posters ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
