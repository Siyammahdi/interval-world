import fs from "node:fs";

const d = JSON.parse(fs.readFileSync(new URL("../data/live-pages.json", import.meta.url), "utf8"));
for (const p of d.pages) {
  const imgs = p.bodyHtml.match(/src=["'][^"']+/g) || [];
  const side = p.bodyHtml.match(/side_bar|Sidebar|sidebar/gi) || [];
  const title = (p.title || "(empty)").slice(0, 40);
  console.log(
    `${p.path.padEnd(42)} layout=${String(p.layout).padEnd(6)} len=${String(p.bodyHtml.length).padStart(6)} imgs=${imgs.length} sideRefs=${side.length} title=${title}`,
  );
}
console.log("--- ownership sample ---");
console.log(d.pages[0].bodyHtml.slice(0, 1500));
console.log("--- benefits membership sample (has sidebar?) ---");
const mem = d.pages.find((x) => x.path === "/web/my/info/benefits/membership");
console.log(mem?.bodyHtml.slice(0, 2000));
