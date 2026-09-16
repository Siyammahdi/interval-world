import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outJson = path.join(root, "data", "live-pages.json");
const ORIGIN = "https://www.intervalworld.com";

function extractBetweenIds(html, openId, closeId) {
  const openRe = new RegExp(`<div[^>]*id=["']${openId}["'][^>]*>`, "i");
  const m = html.match(openRe);
  if (!m || m.index == null) return null;
  const start = m.index;
  if (closeId) {
    const closeRe = new RegExp(`<div[^>]*id=["']${closeId}["']`, "i");
    const c = html.slice(start + m[0].length).search(closeRe);
    if (c >= 0) return html.slice(start, start + m[0].length + c);
  }
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
  if (!url) return url;
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

const data = JSON.parse(fs.readFileSync(outJson, "utf8"));

// —— Channel / Interval HD ——
{
  console.log("Extracting Interval HD…");
  const html = await fetch(ORIGIN + "/web/my/channel").then((r) => r.text());
  let body =
    extractBetweenIds(html, "channel-wrapper", null) ||
    extractBetweenIds(html, "channel-content", null) ||
    extractBetweenIds(html, "ihd_home_wrap", null);
  // Strip player chrome that depends on Brightcove JS — keep structure + thumbs
  if (body) {
    const urlMap = {};
    for (const abs of collect(body).slice(0, 80)) {
      urlMap[abs] = await download(abs, localAssetPath(abs));
    }
    const bodyHtml = rewrite(body, urlMap);
    const idx = data.pages.findIndex((p) => p.path === "/web/my/channel");
    const entry = {
      path: "/web/my/channel",
      source: "/web/my/channel",
      status: 200,
      layout: "channel",
      title: "Interval HD",
      documentTitle: "Interval International | Interval HD",
      bodyHtml,
    };
    if (idx >= 0) data.pages[idx] = entry;
    else data.pages.push(entry);
    console.log("  channel len", bodyHtml.length);
  } else {
    console.log("  FAILED channel extract");
  }
}

// —— Clean CS pages: prefer editable column2 only, strip OneTrust ——
for (const pathKey of [
  "/web/cs/offices",
  "/web/cs/help-login",
  "/web/cs/about",
  "/web/cs/legal",
  "/web/cs/customer-service",
  "/web/cs/travel-advisories",
  "/web/cs/mobile-app",
]) {
  const page = data.pages.find((p) => p.path === pathKey);
  if (!page) continue;
  let html = page.bodyHtml;
  // Remove OneTrust / cookie preference blocks if embedded
  html = html
    .replace(/<div[^>]*id=["']onetrust[\s\S]*?<\/div>/gi, "")
    .replace(/Privacy Preference Center[\s\S]*?Cookie List[\s\S]*?(?=<h1|<div id=|$)/gi, "")
    .replace(/Manage Consent Preferences[\s\S]{0,50000}?(?=<h1|$)/gi, "");
  // If still huge and contains Our Offices / About, trim to from first h1
  const h1 = html.search(/<h1[\s>]/i);
  if (h1 > 200 && html.length > 20000) {
    html = html.slice(h1);
  }
  page.bodyHtml = html.trim();
  console.log("cleaned", pathKey, page.bodyHtml.length);
}

data.generatedAt = new Date().toISOString();
fs.writeFileSync(outJson, JSON.stringify(data, null, 2));
console.log("done");
