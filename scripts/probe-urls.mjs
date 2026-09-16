import fs from "node:fs";

const html = await fetch("https://www.intervalworld.com/").then((r) => r.text());
const interesting = [...html.matchAll(/href="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((h) =>
    /directory|channel|eplus|deposit|deals|mobile|offices|tracker|resort/i.test(h),
  );
console.log([...new Set(interesting)].sort().join("\n"));

for (const p of [
  "/web/cs?a=60&p=eplus",
  "/web/cs?a=95&url=https://www.intervalworld.com/web/cs%3fa=60%26s=benefits-eplus",
  "/web/my/info/benefits/eplus",
  "/web/my/info/benefits/intervalOptions",
  "/web/cs?a=60&p=deposit",
  "/web/my/info/benefits/deposit",
  "/web/cs?a=1500",
  "/web/my/channel",
]) {
  const res = await fetch("https://www.intervalworld.com" + p, { redirect: "manual" });
  const loc = res.headers.get("location");
  const text = res.status === 200 ? await res.text() : "";
  console.log(
    p,
    res.status,
    loc || "",
    "len=" + text.length,
    "hasBody=" + /id=["']body["']/.test(text),
    "title=" + (text.match(/<title>([^<]+)/)?.[1] || "").trim().slice(0, 50),
  );
}
