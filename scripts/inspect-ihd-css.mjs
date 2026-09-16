const cssUrls = [
  "https://www.intervalworld.com/css/my/my_iw_global.css",
  "https://www.intervalworld.com/scripts/my/channel/index.js",
];

for (const url of cssUrls) {
  const text = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.text());
  console.log("\n====", url, "len", text.length);
  // Extract IHD-related blocks
  const keys = [
    "ihd_play_intro",
    "ihd_intro_play",
    "ihd_thumbnail",
    "ihd_destination_label",
    "mycarousel",
    "vid_info",
    "ihd_nav",
    "ihd_carousel",
    "jcarousel",
    "scroll:",
    "visible:",
  ];
  for (const key of keys) {
    let idx = 0;
    let n = 0;
    while ((idx = text.toLowerCase().indexOf(key.toLowerCase(), idx)) !== -1 && n < 3) {
      console.log(`\n-- ${key} @${idx} --\n` + text.slice(Math.max(0, idx - 80), idx + 320).replace(/\s+/g, " "));
      idx += key.length;
      n++;
    }
  }
}
