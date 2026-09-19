/**
 * Localize Interval HD thumbnails using curl.exe (more reliable on Windows),
 * then patch data/interval-hd.ts.
 *
 * For any still-missing thumbs, pulls Brightcove poster via Playwright catalog.
 *
 * Usage: node scripts/localize-hd-thumbnails.mjs
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
const ACCOUNT_PAGE = "https://www.intervalworld.com/web/my/channel";

mkdirSync(OUT, { recursive: true });

function curlDownload(url, dest) {
  const httpsUrl = url.replace(/^http:\/\//i, "https://");
  const r = spawnSync(
    "curl.exe",
    [
      "-fsSL",
      "-A",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "-e",
      "https://www.intervalworld.com/",
      "-o",
      dest,
      httpsUrl,
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0) throw new Error(r.stderr || `curl exit ${r.status}`);
  if (!existsSync(dest) || statSync(dest).size < 800) throw new Error("tiny/empty");
}

function collectVideos(raw) {
  /** @type {{ id: string, image: string }[]} */
  const out = [];
  const re =
    /"id": "(\d+)"[\s\S]*?"image": "([^"]+)"/g;
  let m;
  while ((m = re.exec(raw))) {
    out.push({ id: m[1], image: m[2] });
  }
  return out;
}

function needsThumb(image, id) {
  const local = join(OUT, `${id}.jpg`);
  if (existsSync(local) && statSync(local).size > 800) return false;
  if (image.startsWith("/images/hd/thumbs/")) return true;
  if (/^https?:\/\//i.test(image)) return true;
  if (image.includes("/images/figma/hd/hero")) return true;
  const fp = join(ROOT, "public", image.replace(/^\//, ""));
  if (!existsSync(fp) || statSync(fp).size < 1500) return true;
  return false;
}

async function fetchPostersViaPlaywright(ids) {
  if (!ids.length) return {};
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.log("playwright missing; skip catalog posters");
    return {};
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  /** @type {Record<string, string>} */
  const posters = {};

  await page.goto(`${ACCOUNT_PAGE}#vid=${ids[0]}&vname=seed`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(3000);

  for (const id of ids) {
    try {
      await page.goto(`${ACCOUNT_PAGE}#vid=${id}&vname=${id}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(2000);
      const frame =
        page.frame({ name: "player_frame" }) ||
        page.frames().find((f) => f.url().includes("channelPlayer"));
      if (!frame) continue;
      await frame.waitForFunction(() => typeof window.videojs === "function", null, {
        timeout: 20000,
      });
      const poster = await frame.evaluate(async (vid) => {
        const players = window.videojs.getPlayers();
        const player = players.videoPlayer || Object.values(players)[0];
        if (!player?.catalog?.getVideo) return "";
        const video = await new Promise((resolve, reject) => {
          player.catalog.getVideo(vid, (err, data) => (err ? reject(err) : resolve(data)));
        });
        return video.poster || "";
      }, id);
      if (poster) posters[id] = poster.replace(/^http:\/\//i, "https://");
      process.stdout.write(`poster ${id}\n`);
    } catch (err) {
      process.stdout.write(`poster-fail ${id}: ${err.message || err}\n`);
    }
  }

  await browser.close();
  return posters;
}

async function main() {
  let raw = readFileSync(DATA, "utf8");
  const videos = collectVideos(raw);
  const todo = videos.filter((v) => needsThumb(v.image, v.id));
  console.log(`Videos needing thumbs: ${todo.length}`);

  // First pass: curl any remote URL still in data
  const stillNeed = [];
  for (const v of todo) {
    const dest = join(OUT, `${v.id}.jpg`);
    if (existsSync(dest) && statSync(dest).size > 800) {
      raw = raw.replace(
        new RegExp(`("id": "${v.id}"[\\s\\S]*?"image": ")([^"]+)(")`),
        `$1/images/hd/thumbs/${v.id}.jpg$3`,
      );
      continue;
    }
    if (/^https?:\/\//i.test(v.image) && !v.image.includes("figma")) {
      try {
        curlDownload(v.image, dest);
        raw = raw.replace(
          new RegExp(`("id": "${v.id}"[\\s\\S]*?"image": ")([^"]+)(")`),
          `$1/images/hd/thumbs/${v.id}.jpg$3`,
        );
        process.stdout.write(`curl-ok ${v.id}\n`);
        continue;
      } catch (err) {
        process.stdout.write(`curl-fail ${v.id}: ${err.message}\n`);
      }
    }
    stillNeed.push(v.id);
  }

  // Second pass: Brightcove catalog posters
  const posters = await fetchPostersViaPlaywright([...new Set(stillNeed)]);
  for (const id of stillNeed) {
    const dest = join(OUT, `${id}.jpg`);
    const url = posters[id];
    if (!url) continue;
    try {
      curlDownload(url, dest);
      raw = raw.replace(
        new RegExp(`("id": "${id}"[\\s\\S]*?"image": ")([^"]+)(")`),
        `$1/images/hd/thumbs/${id}.jpg$3`,
      );
      process.stdout.write(`catalog-ok ${id}\n`);
    } catch (err) {
      process.stdout.write(`catalog-fail ${id}: ${err.message}\n`);
    }
  }

  writeFileSync(DATA, raw);

  const left = collectVideos(raw).filter((v) => needsThumb(v.image, v.id));
  console.log(`Remaining without good thumbs: ${left.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
