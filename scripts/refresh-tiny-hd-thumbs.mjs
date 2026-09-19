/**
 * Refresh undersized HD thumbs by pulling Brightcove catalog posters.
 * Usage: node scripts/refresh-tiny-hd-thumbs.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "hd", "thumbs");
const PAGE = "https://www.intervalworld.com/web/my/channel";
const MIN = 12000;

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
  const tiny = readdirSync(OUT)
    .filter((f) => f.endsWith(".jpg"))
    .filter((f) => statSync(join(OUT, f)).size < MIN)
    .map((f) => f.replace(/\.jpg$/, ""));

  console.log(`Refreshing ${tiny.length} tiny thumbs`);
  if (!tiny.length) return;

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const id of tiny) {
    try {
      await page.goto(`${PAGE}#vid=${id}&vname=${id}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(2000);
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
      console.log(`ok ${id} ${statSync(join(OUT, `${id}.jpg`)).size}`);
    } catch (err) {
      console.log(`fail ${id}: ${err.message || err}`);
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
