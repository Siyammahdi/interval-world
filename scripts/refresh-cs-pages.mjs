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
    if (c >= 0) return html.slice(start + m[0].length, start + m[0].length + c);
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
      if (depth === 0) return html.slice(start + m[0].length, i - 6); // inner only
    }
  }
  return null;
}

function clean(html) {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(/onChange="[^"]*"/gi, "");
  out = out.replace(/onchange="[^"]*"/gi, "");
  // strip OneTrust / cookie preference if present
  const ot = out.search(/Privacy Preference Center/i);
  if (ot > 0) out = out.slice(0, ot);
  // rewrite CS query links
  const linkMap = {
    "/web/cs?a=60&p=about": "/web/cs/about",
    "/web/cs?a=60&p=legal": "/web/cs/legal",
    "/web/cs?a=60&p=customer-service": "/web/cs/customer-service",
    "/web/cs?a=60&p=help-login": "/web/cs/help-login",
    "/web/cs?a=60&p=mobile-app": "/web/cs/mobile-app",
    "/web/cs?a=60&p=offices": "/web/cs/offices",
    "/web/cs?a=60&p=travel-advisories": "/web/cs/travel-advisories",
    "/web/cs?a=80": "/web/cs/email-us",
  };
  for (const [from, to] of Object.entries(linkMap)) {
    out = out.split(from).join(to);
    out = out.split(from.replace(/&/g, "&amp;")).join(to);
  }
  out = out.replace(/https?:\/\/www\.intervalworld\.com/g, "");
  // remove inline height styles that make table huge empty
  out = out.replace(/\sstyle="[^"]*height:\s*[\d.]+px;?[^"]*"/gi, (style) => {
    // keep width styles if any, strip height-only noise carefully
    if (/height:\s*\d/i.test(style) && !/background/i.test(style)) {
      return style
        .replace(/height:\s*[\d.]+px;?\s*/gi, "")
        .replace(/style="\s*"/i, "")
        .replace(/style="\s*;\s*"/i, "");
    }
    return style;
  });
  return out.trim();
}

async function fetchCs(source, title, pathKey, layout = "cs") {
  console.log("Fetching", pathKey, "<=", source);
  const html = await fetch(ORIGIN + source, {
    headers: { "User-Agent": "Mozilla/5.0 IntervalWorldDemoBot/1.0" },
  }).then((r) => r.text());
  let inner =
    extractBetweenIds(html, "column2content", "column2contentbottom") ||
    extractBetweenIds(html, "column2content", null) ||
    "";
  // If extractBetweenIds with closeId returned with wrapper issues, try raw match
  if (!inner || inner.length < 50) {
    const m = html.match(
      /id=["']column2content["'][^>]*>([\s\S]*?)<div id=["']column2contentbottom["']/i,
    );
    inner = m?.[1] || "";
  }
  const bodyHtml = clean(inner);
  console.log("  len", bodyHtml.length);
  return {
    path: pathKey,
    source,
    status: 200,
    layout,
    title,
    documentTitle: (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim(),
    bodyHtml,
  };
}

const data = JSON.parse(fs.readFileSync(outJson, "utf8"));

const updates = [
  await fetchCs("/web/cs?a=60&p=offices", "Our Offices", "/web/cs/offices", "cs-offices"),
  await fetchCs("/web/cs?a=60&p=customer-service", "Customer Support", "/web/cs/customer-service", "cs"),
  await fetchCs("/web/cs?a=60&p=help-login", "FAQs", "/web/cs/help-login", "cs"),
  await fetchCs("/web/cs?a=80", "E-mail Us", "/web/cs/email-us", "cs"),
  await fetchCs("/web/my/account/forgotSignInInfo", "Log In Help", "/web/my/account/forgotSignInInfo", "cs"),
  await fetchCs("/web/cs?a=60&p=about", "About Interval", "/web/cs/about", "cs"),
  await fetchCs("/web/cs?a=60&p=legal", "Legal Information", "/web/cs/legal", "cs"),
  await fetchCs("/web/cs?a=60&p=travel-advisories", "Travel Advisories", "/web/cs/travel-advisories", "cs"),
];

for (const entry of updates) {
  const idx = data.pages.findIndex((p) => p.path === entry.path);
  if (idx >= 0) data.pages[idx] = entry;
  else data.pages.push(entry);
}

data.generatedAt = new Date().toISOString();
fs.writeFileSync(outJson, JSON.stringify(data, null, 2));
console.log("Updated", updates.length, "CS pages");
