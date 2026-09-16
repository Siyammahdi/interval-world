import fs from "node:fs";

const html = await fetch("https://www.intervalworld.com/web/cs?a=60&p=offices", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

fs.writeFileSync(new URL("./offices-raw.html", import.meta.url), html);
console.log("saved", html.length);

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

const sidemenu = extractBetweenIds(html, "sidemenu");
const col1 = extractBetweenIds(html, "column1content");
const col2 = extractBetweenIds(html, "column2content");
const body = extractBetweenIds(html, "body");

fs.writeFileSync(new URL("./offices-sidemenu.html", import.meta.url), sidemenu || col1 || "");
fs.writeFileSync(new URL("./offices-col2.html", import.meta.url), col2 || "");
console.log("sidemenu", (sidemenu || "").length, "col1", (col1 || "").length, "col2", (col2 || "").length);

// CSS rules
for (const href of [
  "https://www.intervalworld.com/css/iw/web.css",
  "https://www.intervalworld.com/css/my/my_iw_global.css",
]) {
  const css = await fetch(href).then((r) => r.text());
  const rules = [];
  for (const key of ["sidemenu", "column1", "column2", "offic", "bodygroup", "thistab"]) {
    const re = new RegExp(`[^{}\\n]*${key}[^{}]*\\{[^}]*\\}`, "gi");
    const hits = css.match(re) || [];
    rules.push(...hits);
  }
  console.log("\n==", href, "==");
  console.log(rules.slice(0, 50).join("\n\n"));
}
