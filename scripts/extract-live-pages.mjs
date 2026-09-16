/**
 * Extract exact main-content HTML + assets from intervalworld.com
 * Usage: node scripts/extract-live-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outJson = path.join(root, "data", "live-pages.json");
const assetRoot = path.join(root, "public", "images", "live");
const ORIGIN = "https://www.intervalworld.com";

const PAGES = [
  { path: "/web/my/info/ownership", source: "/web/my/info/ownership", title: "Why Vacation Ownership?" },
  { path: "/web/my/info/ownership/overview", source: "/web/my/info/ownership/overview", title: "About Vacation Ownership" },
  { path: "/web/my/info/ownership/about", source: "/web/my/info/ownership/about", title: "Why Interval International?" },
  { path: "/web/cs/offices", source: "/web/cs?a=60&p=offices", title: "Contact Us" },
  { path: "/web/my/info/planning", source: "/web/my/info/planning", title: "Explore & Plan" },
  { path: "/web/cs/directory", source: "/web/cs?a=60&p=directory", title: "Online Resort Directory" },
  { path: "/web/my/info/directory", source: "/web/my/info/directory", title: "Online Resort Directory" },
  { path: "/web/my/channel", source: "/web/my/channel", title: "Interval HD" },
  { path: "/web/cs/mobile-app", source: "/web/cs?a=60&p=mobile-app", title: "Interval International App" },
  { path: "/web/my/info/planning/magazine", source: "/web/my/info/planning/magazine", title: "Member Publications" },
  { path: "/web/my/info/planning/community", source: "/web/my/info/planning/community", title: "Stay Connected" },
  { path: "/web/my/info/planning/travel", source: "/web/my/info/planning/travel", title: "Interval Travel" },
  { path: "/web/my/info/planning/tracker", source: "/web/my/info/planning/tracker", title: "Interval Exchange Tracker" },
  { path: "/web/my/info/benefits", source: "/web/my/info/benefits", title: "Membership Benefits" },
  { path: "/web/my/info/benefits/exchange", source: "/web/my/info/benefits/exchange", title: "Vacation Exchange" },
  { path: "/web/my/info/benefits/getaways", source: "/web/my/info/benefits/getaways", title: "Getaways" },
  { path: "/web/my/info/benefits/membership", source: "/web/my/info/benefits/membership", title: "Interval Membership" },
  { path: "/web/my/info/benefits/gold", source: "/web/my/info/benefits/gold", title: "Interval Gold" },
  { path: "/web/my/info/benefits/platinum", source: "/web/my/info/benefits/platinum", title: "Interval Platinum" },
  { path: "/web/my/info/benefits/offers", source: "/web/my/info/benefits/offers", title: "Special Offers" },
  { path: "/web/my/info/membership", source: "/web/my/info/membership", title: "Join Today" },
  { path: "/web/my/account/createProfileOrJoin", source: "/web/my/account/createProfileOrJoin", title: "Create Profile" },
  { path: "/web/my/auth/loginPage", source: "/web/my/auth/loginPage", title: "Sign In" },
  { path: "/web/cs/about", source: "/web/cs?a=60&p=about", title: "About Interval" },
  { path: "/web/cs/legal", source: "/web/cs?a=60&p=legal", title: "Legal Information" },
  { path: "/web/cs/customer-service", source: "/web/cs?a=60&p=customer-service", title: "Customer Support" },
  { path: "/web/cs/help-login", source: "/web/cs?a=60&p=help-login", title: "FAQs" },
  { path: "/web/cs/travel-advisories", source: "/web/cs?a=60&p=travel-advisories", title: "Travel Advisories" },
  { path: "/web/cs/eplus", source: "/web/cs?a=60&p=eplus", title: "E-Plus" },
  { path: "/web/cs/deposit", source: "/web/cs?a=60&p=deposit", title: "Deposit for Flexibility" },
  { path: "/web/my/deals", source: "/web/my/deals", title: "Special Deals" },
];

function detectLayout(html) {
  if (/id=["']p101_2col_left["']/.test(html)) return "2col";
  if (/id=["']p101_3col/.test(html)) return "3col";
  if (/id=["']p101_1col/.test(html)) return "1col";
  // Auth pages before tracker — bodyHtml can false-positive on shared chrome
  if (/class=["'][^"']*login-bg|Member Login/i.test(html) && /j_password|loginPassword/i.test(html)) {
    return "login";
  }
  if (/Welcome to Intervalworld\.com/i.test(html) && /Become A Member|Create Web Profile/i.test(html)) {
    return "form";
  }
  if (/Exchange Tracker|rel_pin|dest_pin/.test(html)) return "tracker";
  if (/Interval HD|brightcove|video_thumbnail/i.test(html) && /channel/i.test(html)) return "channel";
  if (/mobile-app-ipad|mobile-app-iphone/.test(html)) return "mobile-app";
  if (/column2content|sidemenu/.test(html)) return "cs";
  return "html";
}

function sliceBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + 1);
  if (start >= 0 && end > start) {
    return html.slice(start, end + endMarker.length);
  }
  return null;
}

function extractBetweenIds(html, openId, closeId) {
  const openRe = new RegExp(`<div[^>]*id=["']${openId}["'][^>]*>`, "i");
  const m = html.match(openRe);
  if (!m || m.index == null) return null;
  const start = m.index;
  // Find matching close by scanning from open tag end — use closeId start as boundary when known
  if (closeId) {
    const closeRe = new RegExp(`<div[^>]*id=["']${closeId}["']`, "i");
    const c = html.slice(start + m[0].length).search(closeRe);
    if (c >= 0) return html.slice(start, start + m[0].length + c);
  }
  // Balanced div walk
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

function extractBody(html) {
  // 2-column marketing pages (typo "Colume" is in the live markup)
  const twoCol =
    sliceBetween(html, "<!-- START: Left Colume -->", "<!-- END: Right Colume -->") ||
    sliceBetween(html, "<!-- START: Left Column -->", "<!-- END: Right Column -->");
  if (twoCol) return twoCol;

  // 3-column blocks
  const three =
    extractBetweenIds(html, "p101_3col_container_940", null) ||
    extractBetweenIds(html, "p101_3col_container", null);
  if (three && three.length > 300) return three;

  // Inner #body that holds p101_* (skip outer wrappers)
  const bodyMatch = [...html.matchAll(/<div[^>]*id=["']body["'][^>]*>/gi)];
  for (const m of bodyMatch.reverse()) {
    const chunk = extractBetweenIds(html.slice(m.index), "body", null);
    // extractBetweenIds expects full html with id — so manual:
    const from = m.index;
    let i = from + m[0].length;
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
      }
    }
    const chunk2 = html.slice(from, i);
    if (/p101_|column2content|one_column/.test(chunk2) && chunk2.length > 400) {
      return chunk2;
    }
  }

  // CS pages: column2content
  const c2 = extractBetweenIds(html, "column2content", "column2contentbottom");
  if (c2 && c2.length > 200) return c2;

  // Channel / large custom pages: main content regions
  for (const id of ["maincontent", "content", "iw_content", "page-content"]) {
    const block = extractBetweenIds(html, id, null);
    if (block && block.length > 500 && !/megamenu|omniture/i.test(block.slice(0, 200))) {
      return block;
    }
  }

  // Fallback: between body open and footer
  const b = html.search(/id=["']body["']/i);
  const f = html.search(/id=["']footer["']/i);
  if (b >= 0 && f > b) {
    return html.slice(b, f);
  }
  return "";
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
  const clean = u.pathname.replace(/^\/+/, "").replace(/[^\w./-]+/g, "_");
  return `/images/live/${clean}`;
}

function diskPathFromLocal(local) {
  return path.join(root, "public", local.replace(/^\//, ""));
}

async function download(absUrl, local) {
  const disk = diskPathFromLocal(local);
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) return local;
  try {
    const res = await fetch(absUrl, {
      headers: { "User-Agent": "Mozilla/5.0 IntervalWorldDemoBot/1.0" },
    });
    if (!res.ok) {
      console.warn(`  FAIL ${res.status} ${absUrl}`);
      return absUrl;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(disk, buf);
    console.log(`  OK ${local} (${buf.length})`);
    return local;
  } catch (e) {
    console.warn(`  ERR ${absUrl}: ${e.message}`);
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
    if (/googletag|doubleclick|facebook\.com|instagram\.com|youtube\.com|pinterest\.com|omniture|analytics/i.test(raw))
      continue;
    urls.add(absolutize(raw.split("?")[0]));
  }
  // CSS background play buttons
  if (/btn_play_120|video_thumbnail_play_hover|play_video/.test(html)) {
    urls.add(absolutize("/images/iw/btn_play_120.png"));
  }
  if (/btn_play_100/.test(html)) {
    urls.add(absolutize("/images/iw/btn_play_100.png"));
  }
  if (/btn_play_150/.test(html)) {
    urls.add(absolutize("/images/iw/btn_play_150.png"));
  }
  return [...urls];
}

function rewriteHtml(html, urlMap) {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  // Replace longest absolute URLs first. Do NOT also replace bare pathnames —
  // pathname is a suffix of `/images/live${pathname}` and would double-prefix.
  const entries = Object.entries(urlMap).sort((a, b) => b[0].length - a[0].length);
  for (const [abs, local] of entries) {
    out = out.split(abs).join(local);
    try {
      const u = new URL(abs);
      const protoRel = `//${u.host}${u.pathname}`;
      out = out.split(protoRel).join(local);
      // Only rewrite bare pathname when it is not already under /images/live/
      const pathRe = new RegExp(
        `(?<!/images/live)${u.pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        "g",
      );
      out = out.replace(pathRe, local);
    } catch {
      /* ignore */
    }
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
  };
  for (const [from, to] of Object.entries(linkMap)) {
    out = out.split(from).join(to);
    out = out.split(from.replace(/&/g, "&amp;")).join(to);
  }
  out = out.replace(/https?:\/\/www\.intervalworld\.com/g, "");
  // Safety net for any historically doubled asset prefixes
  out = out.replace(/\/images\/live\/images\/live\//g, "/images/live/");
  return out.trim();
}

async function processPage(page) {
  const url = ORIGIN + page.source;
  console.log(`\nFetching ${page.path} <= ${page.source}`);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/html",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    console.warn(`  HTTP ${res.status}`);
    return {
      path: page.path,
      source: page.source,
      status: res.status,
      layout: "error",
      title: page.title,
      bodyHtml: `<div class="iw-live-fallback"><h2>${page.title}</h2><p>Live page returned ${res.status}.</p></div>`,
    };
  }
  const html = await res.text();
  const layout = detectLayout(html);
  let body = extractBody(html);

  // Also pull sidebar image URLs from full page if body missed them
  const fullAssets = collectAssetUrls(html).filter((u) =>
    /left_column_banner|side_bar|Sidebar|prelogin|GWPrelogin|btn_play|mobile|icons\/|hero\//i.test(u),
  );

  if (!body || body.length < 100) {
    console.warn(`  Weak body (${body.length}), using column2 / fallback`);
    body =
      extractBetweenIds(html, "column2content", "column2contentbottom") ||
      extractBetweenIds(html, "one_column_content", null) ||
      body ||
      `<div class="iw-live-fallback"><h2>${page.title}</h2><p>Content structure not recognized on live site.</p></div>`;
  }

  const assets = new Set([...collectAssetUrls(body), ...fullAssets]);
  const urlMap = {};
  for (const abs of assets) {
    const local = localAssetPath(abs);
    urlMap[abs] = await download(abs, local);
  }

  // Inject sidebar images into body rewrite even if only in full page — ensure relative paths in body resolve
  let bodyHtml = rewriteHtml(body, urlMap);

  // Strip outer chrome wrappers that break float layout
  bodyHtml = bodyHtml
    .replace(/<div id="player_modal">[\s\S]*?<\/div>/i, "")
    .replace(/<div id="bodygroup">/gi, '<div class="iw-bodygroup">')
    .replace(/id="body"/gi, 'class="iw-body"')
    .replace(/id="one_column"/gi, 'class="iw-one-column"')
    .replace(/id="one_column_content"/gi, 'class="iw-one-column-content"');

  console.log(
    `  layout=${layout} len=${bodyHtml.length} assets=${assets.size} title="${page.title}"`,
  );
  return {
    path: page.path,
    source: page.source,
    status: 200,
    layout,
    title: page.title,
    documentTitle: (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim(),
    bodyHtml,
  };
}

async function main() {
  fs.mkdirSync(assetRoot, { recursive: true });
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  const pages = [];
  for (const p of PAGES) {
    pages.push(await processPage(p));
  }
  fs.writeFileSync(
    outJson,
    JSON.stringify({ generatedAt: new Date().toISOString(), pages }, null, 2),
  );
  console.log(`\nWrote ${pages.length} pages -> ${outJson}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
