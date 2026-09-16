/**
 * Re-extract a few problem pages with corrected source URLs.
 * Merges into data/live-pages.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outJson = path.join(root, "data", "live-pages.json");
const ORIGIN = "https://www.intervalworld.com";

// Import helpers by re-running core logic inline (keep self-contained)

function sliceBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + 1);
  if (start >= 0 && end > start) return html.slice(start, end + endMarker.length);
  return null;
}

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

function extractBody(html, pathHint) {
  const twoCol =
    sliceBetween(html, "<!-- START: Left Colume -->", "<!-- END: Right Colume -->") ||
    sliceBetween(html, "<!-- START: Left Column -->", "<!-- END: Right Column -->");
  if (twoCol) return { body: twoCol, layout: "2col" };

  const three =
    extractBetweenIds(html, "p101_3col_container_940", null) ||
    extractBetweenIds(html, "p101_3col_container", null);
  if (three && three.length > 300) return { body: three, layout: "3col" };

  if (pathHint.includes("channel")) {
    // Interval HD — grab the main video listing region
    const channel =
      extractBetweenIds(html, "channel_content", null) ||
      extractBetweenIds(html, "video_content", null) ||
      extractBetweenIds(html, "main", null) ||
      sliceBetween(html, '<div id="wrapper">', '<div id="footer">');
    if (channel) return { body: channel, layout: "channel" };
  }

  const c2 = extractBetweenIds(html, "column2content", "column2contentbottom");
  if (c2 && c2.length > 200) return { body: c2, layout: "cs" };

  const one = extractBetweenIds(html, "one_column_content", null);
  if (one && one.length > 200) return { body: one, layout: "1col" };

  // innermost #body
  let best = "";
  const re = /<div[^>]*id=["']body["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const chunk = extractBetweenIds(html.slice(m.index), "body", null);
    // manual from m.index:
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
    const c = html.slice(m.index, i);
    if (c.length > best.length && c.length < 100000) best = c;
  }
  if (best) return { body: best, layout: "html" };
  return { body: "", layout: "empty" };
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

function collectAssetUrls(html) {
  const urls = new Set();
  const re = /\b(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp)(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (!raw || raw.startsWith("data:")) continue;
    if (/googletag|doubleclick|omniture|analytics/i.test(raw)) continue;
    urls.add(absolutize(raw.split("?")[0]));
  }
  if (/btn_play_120|play_video|video_thumbnail_play/.test(html)) {
    urls.add(absolutize("/images/iw/btn_play_120.png"));
  }
  return [...urls];
}

function rewriteHtml(html, urlMap) {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  for (const [abs, local] of Object.entries(urlMap).sort((a, b) => b[0].length - a[0].length)) {
    out = out.split(abs).join(local);
    try {
      out = out.split(new URL(abs).pathname).join(local);
    } catch {}
  }
  const linkMap = {
    "/web/cs?a=60&p=about": "/web/cs/about",
    "/web/cs?a=60&p=legal": "/web/cs/legal",
    "/web/cs?a=60&p=customer-service": "/web/cs/customer-service",
    "/web/cs?a=60&p=help-login": "/web/cs/help-login",
    "/web/cs?a=60&p=mobile-app": "/web/cs/mobile-app",
    "/web/cs?a=60&p=offices": "/web/cs/offices",
    "/web/cs?a=60&p=travel-advisories": "/web/cs/travel-advisories",
    "/web/cs?a=60&p=eplus": "/web/cs/eplus",
    "/web/cs?a=60&p=deposit": "/web/cs/deposit",
    "/web/cs?a=60&p=directory": "/web/cs/directory",
    "/web/cs?a=1500": "/web/cs/directory",
    "/web/my/info/benefits/eplus": "/web/cs/eplus",
    "/web/my/info/benefits/deposit": "/web/cs/deposit",
  };
  for (const [from, to] of Object.entries(linkMap)) {
    out = out.split(from).join(to);
    out = out.split(from.replace(/&/g, "&amp;")).join(to);
  }
  out = out.replace(/https?:\/\/www\.intervalworld\.com/g, "");
  return out.trim();
}

const FIXES = [
  { path: "/web/cs/directory", source: "/web/cs?a=1500", title: "Online Resort Directory", layout: "directory" },
  { path: "/web/cs/eplus", source: "/web/my/info/benefits/eplus", title: "E-Plus" },
  { path: "/web/cs/deposit", source: "/web/my/info/benefits/deposit", title: "Deposit for Flexibility" },
  { path: "/web/my/channel", source: "/web/my/channel", title: "Interval HD" },
  { path: "/web/cs/offices", source: "/web/cs?a=60&p=offices", title: "Contact Us" },
  { path: "/web/cs/about", source: "/web/cs?a=60&p=about", title: "About Interval" },
  { path: "/web/cs/legal", source: "/web/cs?a=60&p=legal", title: "Legal Information" },
  { path: "/web/cs/customer-service", source: "/web/cs?a=60&p=customer-service", title: "Customer Support" },
  { path: "/web/cs/help-login", source: "/web/cs?a=60&p=help-login", title: "FAQs" },
  { path: "/web/cs/travel-advisories", source: "/web/cs?a=60&p=travel-advisories", title: "Travel Advisories" },
  { path: "/web/cs/mobile-app", source: "/web/cs?a=60&p=mobile-app", title: "Interval International App" },
];

const data = JSON.parse(fs.readFileSync(outJson, "utf8"));

for (const page of FIXES) {
  console.log("\nFixing", page.path, "<=", page.source);
  const res = await fetch(ORIGIN + page.source, {
    headers: { "User-Agent": "Mozilla/5.0 IntervalWorldDemoBot/1.0" },
  });
  const html = await res.text();
  let { body, layout } = extractBody(html, page.path);
  if (page.layout) layout = page.layout;
  if (!body || body.length < 100) {
    body = extractBetweenIds(html, "column2content", "column2contentbottom") || body;
    layout = layout || "cs";
  }
  // Prefer column2 for CS pages to avoid megamenu bloat
  if (page.path.startsWith("/web/cs/") && page.path !== "/web/cs/directory") {
    const c2 = extractBetweenIds(html, "column2content", "column2contentbottom");
    if (c2 && c2.length > 200 && c2.length < body.length) {
      body = c2;
      layout = "cs";
    }
  }

  const assets = collectAssetUrls(body);
  const fullSide = collectAssetUrls(html).filter((u) =>
    /left_column|side_bar|Sidebar|prelogin|btn_play|mobile|icons\//i.test(u),
  );
  const urlMap = {};
  for (const abs of new Set([...assets, ...fullSide])) {
    urlMap[abs] = await download(abs, localAssetPath(abs));
  }
  let bodyHtml = rewriteHtml(body || `<h2>${page.title}</h2>`, urlMap);
  console.log("  layout=", layout, "len=", bodyHtml.length);

  const idx = data.pages.findIndex((p) => p.path === page.path);
  const entry = {
    path: page.path,
    source: page.source,
    status: res.status,
    layout,
    title: page.title,
    documentTitle: (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim(),
    bodyHtml,
  };
  if (idx >= 0) data.pages[idx] = entry;
  else data.pages.push(entry);
}

// Remove duplicate /web/my/info/directory if present
data.pages = data.pages.filter((p) => p.path !== "/web/my/info/directory");
data.generatedAt = new Date().toISOString();
fs.writeFileSync(outJson, JSON.stringify(data, null, 2));
console.log("\nUpdated", outJson);
