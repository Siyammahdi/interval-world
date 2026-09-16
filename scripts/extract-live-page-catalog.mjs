/**
 * Fetch live Interval World pages and build structured catalog JSON.
 * CS pretty-paths 404; use known ?a=60&p= source URLs.
 */
import { writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const BASE = "https://www.intervalworld.com";
const OUT =
  "D:/Projects/TWP Clients/interval-world/scripts/live-page-catalog.json";

const PAGES = [
  { path: "/web/my/info/ownership" },
  { path: "/web/my/info/ownership/overview" },
  { path: "/web/my/info/ownership/about" },
  { path: "/web/cs/offices", fetchPath: "/web/cs?a=60&p=offices" },
  { path: "/web/my/info/planning" },
  { path: "/web/cs/directory", fetchPath: "/web/cs?a=1500" },
  { path: "/web/my/channel" },
  { path: "/web/cs/mobile-app", fetchPath: "/web/cs?a=60&p=mobile-app" },
  { path: "/web/my/info/planning/magazine" },
  { path: "/web/my/info/planning/community" },
  { path: "/web/my/info/planning/travel" },
  { path: "/web/my/info/planning/tracker" },
  { path: "/web/my/info/benefits" },
  { path: "/web/my/info/benefits/exchange" },
  { path: "/web/my/info/benefits/getaways" },
  { path: "/web/my/info/benefits/membership" },
  { path: "/web/my/info/benefits/gold" },
  { path: "/web/my/info/benefits/platinum" },
  { path: "/web/my/info/benefits/offers" },
  { path: "/web/my/info/membership" },
  { path: "/web/my/account/createProfileOrJoin" },
  { path: "/web/my/auth/loginPage" },
  { path: "/web/cs/about", fetchPath: "/web/cs?a=60&p=about" },
  { path: "/web/cs/legal", fetchPath: "/web/cs?a=60&p=legal" },
  { path: "/web/cs/customer-service", fetchPath: "/web/cs?a=60&p=customer-service" },
  { path: "/web/cs/help-login", fetchPath: "/web/cs?a=60&p=help-login" },
  { path: "/web/cs/travel-advisories", fetchPath: "/web/cs?a=60&p=travel-advisories" },
  { path: "/web/cs/eplus", fetchPath: "/web/my/info/benefits/eplus" },
  { path: "/web/cs/deposit", fetchPath: "/web/my/info/benefits/deposit" },
  { path: "/web/my/deals" },
];

const COOKIE_NOISE =
  /privacy preference|manage consent|strictly necessary|performance cookies|functional cookies|targeting cookies|analytics cookies|cookie list/i;

function textOf(el) {
  if (!el) return "";
  const clone = el.cloneNode(true);
  clone.querySelectorAll("script,style,noscript").forEach((n) => n.remove());
  return (clone.textContent || "").replace(/\s+/g, " ").trim();
}

function inNoise(el) {
  let p = el;
  while (p) {
    const id = `${p.id || ""} ${typeof p.className === "string" ? p.className : ""}`;
    if (/onetrust|consent|ot-sdk|cookie-settings/i.test(id)) return true;
    p = p.parentElement;
  }
  return false;
}

function headingsFrom(doc, sel, limit) {
  const selectors = [
    "#p101_2col_left",
    "#p101_2col_right",
    "#p101_1col_content",
    "#p101_1col_container",
    "#p101_3col_left",
    "#p101_3col_middle",
    "#p101_3col_right",
    "#one_column_content",
    "#column2content",
    "#iicontent_tc",
    "#faq_main",
    "#landing",
    "#body",
    ".iw-body",
    "#hp_slider",
    ".iw-bodygroup",
  ];
  const roots = [];
  for (const s of selectors) {
    doc.querySelectorAll(s).forEach((el) => roots.push(el));
  }
  if (!roots.length && doc.body) roots.push(doc.body);

  const seen = new Set();
  const out = [];
  for (const root of roots) {
    root.querySelectorAll(sel).forEach((el) => {
      if (inNoise(el)) return;
      const t = textOf(el);
      if (!t || COOKIE_NOISE.test(t) || seen.has(t)) return;
      seen.add(t);
      out.push(t);
    });
  }
  return typeof limit === "number" ? out.slice(0, limit) : out;
}

function detectLayout(doc, path) {
  if (path.includes("/loginPage") || path.includes("/auth/")) return "login";
  if (path.includes("createProfileOrJoin")) return "form";
  if (path.includes("/channel")) return "channel";
  if (path.includes("/directory") || doc.querySelector(".rd_search"))
    return "directory";

  const left = doc.querySelector("#p101_2col_left");
  const has1col = !!doc.querySelector(
    "#p101_1col_content, #p101_1col_container, #one_column_content, #p101_hero_img"
  );
  const has3col = !!doc.querySelector(
    "#p101_3col_left, #p101_3col_middle, #p101_3col_right, #p101_3col_container"
  );

  if (left) {
    const play = !!left.querySelector(
      ".play_video, .video_thumbnail_play_hover, a.play_video"
    );
    return play ? "2col_video" : "2col_hero";
  }
  if (has3col) return "3col";
  if (has1col) return "1col";
  if (path.includes("/deals") || doc.querySelector("#hp_slider")) return "1col";
  if (doc.querySelector("#column2content, #iicontent_tc, #faq_main, #landing"))
    return "1col";
  if (
    doc.querySelector("h1") &&
    /member login/i.test(textOf(doc.querySelector("h1")))
  )
    return "login";
  return "unknown";
}

function extract(path, html, fetchedFrom, status) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  let documentTitle = textOf(doc.querySelector("title"));
  const og = doc.querySelector('meta[property="og:title"]');
  if (
    (!documentTitle || documentTitle === "Interval International") &&
    og?.getAttribute("content")
  ) {
    documentTitle = og.getAttribute("content").trim();
  }

  const left = doc.querySelector("#p101_2col_left");
  const oneCol = doc.querySelector(
    "#p101_1col_content, #p101_1col_container, #one_column_content"
  );
  const right = doc.querySelector("#p101_2col_right");

  let leftHero = null;
  const heroScope = left || oneCol || doc.querySelector("#p101_2col_hero");
  const heroHtml = heroScope?.innerHTML || "";
  const heroMatch = heroHtml.match(/left_column_banner\/([^)'"\s?]+)/i);
  if (heroMatch) leftHero = heroMatch[1];

  const playScope = left || oneCol || doc;
  const hasPlayButton = !!playScope.querySelector(
    ".play_video, .video_thumbnail_play_hover, a.play_video, [class*='play_video']"
  );

  let layoutType = detectLayout(doc, path);
  if (left) layoutType = hasPlayButton ? "2col_video" : "2col_hero";
  if (path === "/web/my/info/planning" && !left) {
    if (
      doc.querySelector("#p101_3col_left, #p101_3col_middle") ||
      headingsFrom(doc, "h2").length >= 4
    ) {
      layoutType = "3col";
    }
  }
  if (path === "/web/my/info/planning/travel" && !left) layoutType = "1col";
  if (path === "/web/my/info/planning/tracker") layoutType = "1col";
  if (path === "/web/my/info/benefits/exchange" && !left) {
    layoutType = doc.querySelector("#p101_3col_left") ? "3col" : "1col";
  }
  if (path === "/web/my/info/benefits/getaways" && left && !leftHero) {
    // getaways uses #landing inside left with custom hero
    layoutType = "1col";
  }

  const h2Headings = headingsFrom(doc, "h2");
  const h1Headings = headingsFrom(doc, "h1");
  const h3Headings = headingsFrom(doc, "h3", 10);

  const h4SidebarTitles = [];
  if (right) {
    right.querySelectorAll("h4").forEach((h4) => {
      const a = h4.querySelector("a");
      const t = textOf(a || h4);
      if (t && !h4SidebarTitles.includes(t)) h4SidebarTitles.push(t);
    });
  }

  const sidebarImages = [];
  if (right) {
    const re = /side_bar\/([^)'"\s?]+)/gi;
    let m;
    while ((m = re.exec(right.innerHTML))) {
      if (!sidebarImages.includes(m[1])) sidebarImages.push(m[1]);
    }
  }

  const mainCandidates = [
    left,
    oneCol,
    doc.querySelector("#column2content"),
    doc.querySelector("#iicontent_tc"),
    doc.querySelector("#faq_main"),
    doc.querySelector("#landing"),
    doc.querySelector("#p101_3col_middle"),
    doc.querySelector("#body"),
    doc.querySelector(".iw-body"),
  ].filter(Boolean);

  let bodyTextPreview = "";
  for (const c of mainCandidates) {
    const t = textOf(c);
    if (!t) continue;
    if (t.includes("IIOmniture") || /^window\./.test(t)) continue;
    if (t.length > 20) {
      bodyTextPreview = t.slice(0, 500);
      break;
    }
  }

  const allContentImages = [];
  const addImgPath = (src) => {
    if (!src) return;
    try {
      const u = new URL(src, BASE);
      const p = u.pathname;
      if (!(p.includes("/iimedia/") || p.includes("/images/"))) return;
      if (
        /spacer\.gif|socialmedia_line|icon_facebook|icon_instagram|icon_youtube|icon_pinterest/i.test(
          p
        )
      )
        return;
      if (!allContentImages.includes(p)) allContentImages.push(p);
    } catch {
      /* ignore */
    }
  };

  const contentRoots = [
    left,
    right,
    oneCol,
    doc.querySelector("#p101_3col_left"),
    doc.querySelector("#p101_3col_middle"),
    doc.querySelector("#p101_3col_right"),
    doc.querySelector("#column2content"),
    doc.querySelector("#iicontent_tc"),
    doc.querySelector("#faq_main"),
    doc.querySelector("#landing"),
    doc.querySelector("#p101_hero_img"),
    doc.querySelector("#hp_slider"),
    doc.querySelector(".iw-bodygroup"),
  ].filter(Boolean);

  for (const root of contentRoots.length ? contentRoots : [doc.body]) {
    if (!root) continue;
    root.querySelectorAll("img").forEach((img) =>
      addImgPath(img.getAttribute("src") || img.getAttribute("data-src"))
    );
    const ih = root.innerHTML || "";
    const re = /(?:\/iimedia\/|\/images\/)[^)'"\s?]+/gi;
    let m;
    while ((m = re.exec(ih))) addImgPath(m[0]);
  }

  let leftHtmlSnippet = "";
  if (left) leftHtmlSnippet = (left.innerHTML || "").slice(0, 2000);
  else if (oneCol) leftHtmlSnippet = (oneCol.innerHTML || "").slice(0, 2000);
  else if (doc.querySelector("#column2content"))
    leftHtmlSnippet = (doc.querySelector("#column2content").innerHTML || "").slice(
      0,
      2000
    );
  else if (doc.querySelector("#iicontent_tc"))
    leftHtmlSnippet = (doc.querySelector("#iicontent_tc").innerHTML || "").slice(
      0,
      2000
    );
  else if (doc.querySelector("#faq_main"))
    leftHtmlSnippet = (doc.querySelector("#faq_main").innerHTML || "").slice(
      0,
      2000
    );
  else if (doc.querySelector("#landing"))
    leftHtmlSnippet = (doc.querySelector("#landing").innerHTML || "").slice(
      0,
      2000
    );

  return {
    path,
    fetchedFrom,
    documentTitle,
    layoutType,
    leftHero,
    hasPlayButton,
    h2Headings,
    h1Headings,
    h3Headings,
    h4SidebarTitles,
    sidebarImages,
    bodyTextPreview,
    allContentImages: allContentImages.slice(0, 20),
    leftHtmlSnippet,
    _status: status,
  };
}

async function fetchPage(fetchPath) {
  const res = await fetch(BASE + fetchPath, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    redirect: "follow",
  });
  const html = await res.text();
  return { status: res.status, html, finalUrl: res.url };
}

async function main() {
  const results = [];
  for (const page of PAGES) {
    const fetchPath = page.fetchPath || page.path;
    process.stdout.write(`Fetching ${page.path} via ${fetchPath}... `);
    try {
      const { status, html } = await fetchPage(fetchPath);
      console.log(status, `(${html.length} bytes)`);
      if (status >= 400) {
        results.push({
          path: page.path,
          fetchedFrom: fetchPath,
          documentTitle: "",
          layoutType: "unknown",
          leftHero: null,
          hasPlayButton: false,
          h2Headings: [],
          h1Headings: [],
          h3Headings: [],
          h4SidebarTitles: [],
          sidebarImages: [],
          bodyTextPreview: `HTTP ${status}`,
          allContentImages: [],
          leftHtmlSnippet: "",
          _status: status,
        });
        continue;
      }
      results.push(extract(page.path, html, fetchPath, status));
    } catch (err) {
      console.log("ERROR", err.message);
      results.push({
        path: page.path,
        fetchedFrom: fetchPath,
        documentTitle: "",
        layoutType: "unknown",
        leftHero: null,
        hasPlayButton: false,
        h2Headings: [],
        h1Headings: [],
        h3Headings: [],
        h4SidebarTitles: [],
        sidebarImages: [],
        bodyTextPreview: `ERROR: ${err}`,
        allContentImages: [],
        leftHtmlSnippet: "",
        _status: 0,
      });
    }
  }

  // Strip internal debug keys for final catalog fields requested
  const catalog = results.map(
    ({
      path,
      documentTitle,
      layoutType,
      leftHero,
      hasPlayButton,
      h2Headings,
      h1Headings,
      h3Headings,
      h4SidebarTitles,
      sidebarImages,
      bodyTextPreview,
      allContentImages,
      leftHtmlSnippet,
      fetchedFrom,
      _status,
    }) => ({
      path,
      documentTitle,
      layoutType,
      leftHero,
      hasPlayButton,
      h2Headings,
      h1Headings,
      h3Headings,
      h4SidebarTitles,
      sidebarImages,
      bodyTextPreview,
      allContentImages,
      leftHtmlSnippet,
      // keep provenance for clone accuracy
      fetchedFrom,
      httpStatus: _status,
    })
  );

  writeFileSync(OUT, JSON.stringify(catalog, null, 2), "utf8");
  console.log(`\nWrote ${catalog.length} pages to ${OUT}`);
  for (const p of catalog) {
    console.log(
      `${p.path} | ${p.layoutType} | play=${p.hasPlayButton} | hero=${p.leftHero || "-"} | title=${(p.documentTitle || "").slice(0, 50)} | status=${p.httpStatus}`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
