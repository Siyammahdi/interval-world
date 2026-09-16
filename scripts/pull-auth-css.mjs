import fs from "node:fs";

const globalCss = await fetch("https://www.intervalworld.com/css/my/my_iw_global.css", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());
const webCss = await fetch("https://www.intervalworld.com/css/iw/web.css", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

fs.writeFileSync(new URL("./auth-my_iw_global.css", import.meta.url), globalCss);
fs.writeFileSync(new URL("./auth-web.css", import.meta.url), webCss);

for (const [name, text] of [
  ["global", globalCss],
  ["web", webCss],
]) {
  console.log("\n====", name);
  for (const key of [
    "login_box",
    "member_login",
    "Member Login",
    "loginID",
    "rememberMe",
    "createProfile-box",
    "login_page",
    "auth",
    "beach",
    "enrollment",
    "create_profile",
    "welcome_box",
    "profile_box",
  ]) {
    let idx = 0;
    let n = 0;
    while ((idx = text.toLowerCase().indexOf(key.toLowerCase(), idx)) !== -1 && n < 2) {
      console.log("\n--", key, "@", idx);
      console.log(text.slice(Math.max(0, idx - 80), idx + 400));
      idx += key.length;
      n += 1;
    }
  }
}
