import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outJson = path.join(root, "data", "live-pages.json");
const ORIGIN = "https://www.intervalworld.com";

function extractBetweenIds(html, openId) {
  const openRe = new RegExp(`<div[^>]*id=["']${openId}["'][^>]*>`, "i");
  const m = html.match(openRe);
  if (!m || m.index == null) return null;
  const start = m.index;
  let i = start + m[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      i = nextClose + 6;
      if (depth === 0) return html.slice(start, i);
    }
  }
  return null;
}

function absolutize(url) {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return ORIGIN + url;
  return ORIGIN + "/" + url;
}

function localAssetPath(absUrl) {
  const u = new URL(absUrl);
  return `/images/live/${u.pathname.replace(/^\/+/, "").replace(/[^\w./-]+/g, "_")}`;
}

async function download(absUrl, local) {
  const disk = path.join(root, "public", local.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) return local;
  try {
    const res = await fetch(absUrl, {
      headers: { "User-Agent": "Mozilla/5.0 IntervalWorldDemoBot/1.0" },
    });
    if (!res.ok) return absUrl;
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(disk, buf);
    console.log("  OK", local, buf.length);
    return local;
  } catch {
    return absUrl;
  }
}

function collect(html) {
  const urls = new Set();
  const re = /\b(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp)(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (!raw || raw.startsWith("data:")) continue;
    if (/googletag|doubleclick|omniture/i.test(raw)) continue;
    urls.add(absolutize(raw.split("?")[0]));
  }
  if (/btn_play|play_video|video_thumbnail_play/.test(html)) {
    urls.add(absolutize("/images/iw/btn_play_150.png"));
    urls.add(absolutize("/images/iw/btn_play_120.png"));
  }
  return [...urls];
}

function rewrite(html, urlMap) {
  let out = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/https?:\/\/www\.intervalworld\.com/g, "");
  for (const [abs, local] of Object.entries(urlMap).sort((a, b) => b[0].length - a[0].length)) {
    out = out.split(abs).join(local);
    try {
      out = out.split(new URL(abs).pathname).join(local);
    } catch {}
  }
  return out.trim();
}

/** Extract hero/video strip + 3col grid from #body */
function extract3colPage(html) {
  // Find innermost meaningful body that contains p101_3col
  const bodies = [...html.matchAll(/<div[^>]*id=["']body["'][^>]*>/gi)];
  for (const m of bodies.reverse()) {
    let i = m.index + m[0].length;
    let depth = 1;
    while (i < html.length && depth > 0) {
      const no = html.indexOf("<div", i);
      const nc = html.indexOf("</div>", i);
      if (nc < 0) break;
      if (no >= 0 && no < nc) {
        depth++;
        i = no + 4;
      } else {
        depth--;
        i = nc + 6;
      }
    }
    const chunk = html.slice(m.index, i);
    if (/p101_3col/.test(chunk)) {
      // Prefer content from player_modal end or left of first p101_3col including any hero above
      const threeStart = chunk.search(/id=["']p101_3col/);
      // Include any hero/video block before 3col inside this body
      const heroBits =
        extractBetweenIds(chunk, "p101_3col_vid") ||
        extractBetweenIds(chunk, "p101_2col_hero") ||
        "";
      // Also grab img banners immediately before 3col
      let before = chunk.slice(0, threeStart);
      // strip omniture/scripts already later
      const three =
        extractBetweenIds(chunk, "p101_3col_container_940") ||
        extractBetweenIds(chunk, "p101_3col_container") ||
        chunk.slice(threeStart);
      // If before contains a large banner image, keep it
      const keepBefore = /preloginHeroImages|940x300|GWPrelogin_hero|welcomebanner|IntervalTravel_Prelogin|play_video|related_videos/i.test(
        before,
      )
        ? before
        : heroBits || "";
      return (keepBefore + "\n" + three).trim();
    }
  }
  return (
    extractBetweenIds(html, "p101_3col_container_940") ||
    extractBetweenIds(html, "p101_3col_container") ||
    ""
  );
}

const TARGETS = [
  { path: "/web/my/info/benefits/exchange", source: "/web/my/info/benefits/exchange", title: "Vacation Exchange" },
  { path: "/web/my/info/benefits/getaways", source: "/web/my/info/benefits/getaways", title: "Getaways" },
  { path: "/web/my/info/planning", source: "/web/my/info/planning", title: "Explore & Plan" },
  { path: "/web/my/info/planning/travel", source: "/web/my/info/planning/travel", title: "Interval Travel" },
];

const data = JSON.parse(fs.readFileSync(outJson, "utf8"));

for (const page of TARGETS) {
  console.log("\nRe-extract 3col", page.path);
  const html = await fetch(ORIGIN + page.source, {
    headers: { "User-Agent": "Mozilla/5.0 IntervalWorldDemoBot/1.0" },
  }).then((r) => r.text());
  let body = extract3colPage(html);
  console.log("  raw len", body.length, "has940", /940x300|Hero|welcomebanner|GWPrelogin_hero|IntervalTravel_Prelogin/i.test(body));

  const urlMap = {};
  for (const abs of collect(body)) {
    urlMap[abs] = await download(abs, localAssetPath(abs));
  }
  // Also grab known hero from full page if missing
  const heroMatch = html.match(
    /(?:preloginHeroImages|GWPrelogin|prelogin)\/[^"'?]+\.(?:jpg|jpeg|png)/gi,
  );
  if (heroMatch) {
    for (const rel of heroMatch.slice(0, 8)) {
      const abs = absolutize("/iimedia/images/" + rel.replace(/^\/?iimedia\/images\//, "").replace(/^/, ""));
      // fix path
      const abs2 = absolutize(rel.startsWith("/") ? rel : "/iimedia/images/" + rel.replace(/^iimedia\/images\//, ""));
      // simpler:
      const full = html.includes(rel)
        ? absolutize(
            (html.match(new RegExp(`([\\\"'/][^\\\"']*${rel.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`)) || [])[1] ||
              "/" + rel,
          )
        : null;
    }
  }
  // Download any left_column / hero paths present in full html near body
  for (const m of html.matchAll(/\/iimedia\/images\/[^"'?]+\.(?:jpg|jpeg|png)/gi)) {
    if (/Hero|hero|940x300|welcomebanner|GWPrelogin_hero|IntervalTravel_Prelogin|Exchange_Casey/i.test(m[0])) {
      const abs = absolutize(m[0]);
      urlMap[abs] = await download(abs, localAssetPath(abs));
      // If body missing this hero, prepend a simple hero img
      if (!body.includes(path.basename(m[0]))) {
        const local = urlMap[abs];
        if (/940x300|Hero940|welcomebanner|GWPrelogin_hero|IntervalTravel_Prelogin|Exchange_Casey/i.test(m[0])) {
          body =
            `<div class="iw-page-hero" style="margin-bottom:20px"><img src="${local}" alt="" width="940" style="width:100%;max-width:940px;height:auto;display:block" /></div>\n` +
            body;
          console.log("  prepended hero", m[0]);
          break;
        }
      }
    }
  }

  const bodyHtml = rewrite(body, urlMap);
  const idx = data.pages.findIndex((p) => p.path === page.path);
  const entry = {
    path: page.path,
    source: page.source,
    status: 200,
    layout: "3col",
    title: page.title,
    documentTitle: (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim(),
    bodyHtml,
  };
  if (idx >= 0) data.pages[idx] = entry;
  else data.pages.push(entry);
  console.log("  final len", bodyHtml.length);
}

data.generatedAt = new Date().toISOString();
fs.writeFileSync(outJson, JSON.stringify(data, null, 2));
console.log("done");
