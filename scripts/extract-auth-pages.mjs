import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.intervalworld.com";

async function fetchPage(urlPath) {
  const res = await fetch(ORIGIN + urlPath, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
  });
  const html = await res.text();
  console.log(urlPath, res.status, html.length);
  return html;
}

async function download(absUrl, localRel) {
  const disk = path.join(root, "public", localRel.replace(/^\//, ""));
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) {
    console.log("exists", localRel);
    return localRel;
  }
  const res = await fetch(absUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.log("fail", absUrl, res.status);
    return null;
  }
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
  console.log("saved", localRel, fs.statSync(disk).size);
  return localRel;
}

const loginHtml = await fetchPage("/web/my/auth/loginPage");
const createHtml = await fetchPage("/web/my/account/createProfileOrJoin");
fs.writeFileSync(path.join(root, "scripts/login-live.html"), loginHtml);
fs.writeFileSync(path.join(root, "scripts/create-profile-live.html"), createHtml);

// Find login-related CSS and background images
for (const html of [loginHtml, createHtml]) {
  const imgs = [...html.matchAll(/(?:src|href)=["']([^"']*(?:login|beach|auth|profile|join)[^"']*)["']/gi)].map(
    (m) => m[1],
  );
  const bgs = [...html.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]);
  console.log("assets", [...new Set([...imgs, ...bgs])].slice(0, 40).join("\n"));
}

// Extract login form region
const loginChunk = loginHtml.match(/Member Login[\s\S]{0,4000}/i)?.[0];
console.log("\n--- LOGIN CHUNK ---\n", loginChunk?.slice(0, 2500));

const createChunk = createHtml.match(/Welcome to Interval|Web Profile|Become A Member[\s\S]{0,5000}/i)?.[0];
console.log("\n--- CREATE CHUNK ---\n", createChunk?.slice(0, 3000));

// CSS candidates
const cssLinks = [...loginHtml.matchAll(/href=["']([^"']+\.css[^"']*)["']/gi)].map((m) => m[1]);
console.log("\nlogin css", [...new Set(cssLinks)].join("\n"));
