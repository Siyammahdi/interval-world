import fs from "node:fs";

const files = [
  "https://www.intervalworld.com/css/aos-custom.css",
  "https://www.intervalworld.com/css/aos.css",
];

for (const url of files) {
  const text = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.text());
  const name = url.split("/").pop();
  fs.writeFileSync(new URL("./" + name, import.meta.url), text);
  console.log(name, text.length);
  const keys = ["mobile-hero", "mobile-app", "icon-", "cert-", "other-feature", "beach", "orange"];
  for (const k of keys) {
    let idx = 0;
    let n = 0;
    while ((idx = text.toLowerCase().indexOf(k.toLowerCase(), idx)) !== -1 && n < 3) {
      console.log("\n##", name, k, "@", idx);
      console.log(text.slice(Math.max(0, idx - 60), idx + 450));
      idx += k.length;
      n += 1;
    }
  }
}
