import fs from "node:fs";

const loginHtml = fs.readFileSync(new URL("./login-live.html", import.meta.url), "utf8");
const cssHrefs = [...loginHtml.matchAll(/href=["']([^"']+\.css[^"']*)["']/gi)].map((m) => m[1]);
console.log([...new Set(cssHrefs)].join("\n"));

const candidates = [
  "https://www.intervalworld.com/css/my/my_iw_global.css",
  "https://www.intervalworld.com/css/iw/web.css",
  "https://www.intervalworld.com/css/iw/global.css",
  "https://www.intervalworld.com/css/grid.css",
  "https://www.intervalworld.com/css/megamenu.css",
  "https://www.intervalworld.com/css/iw/login.css",
  "https://www.intervalworld.com/css/my/login.css",
  "https://www.intervalworld.com/css/login.css",
];

for (const url of candidates) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.log(url, res.status);
    continue;
  }
  const text = await res.text();
  const keys = ["login-bg", "login_container", "box_rnd_1", "createProfile-box", "rememberMe", "formContainer"];
  const hits = keys.filter((k) => text.includes(k));
  console.log(url, "len", text.length, "hits", hits.join(","));
  if (hits.length) {
    for (const k of hits) {
      const idx = text.indexOf(k);
      console.log("\n##", k);
      console.log(text.slice(Math.max(0, idx - 100), idx + 500));
    }
  }
}
