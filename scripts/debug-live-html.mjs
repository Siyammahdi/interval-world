async function check(path) {
  const html = await fetch("https://www.intervalworld.com" + path).then((r) => r.text());
  const hasBody = /id=["']body["']/.test(html);
  const has2 = /p101_2col_left/.test(html);
  const has3 = /p101_3col/.test(html);
  const hasCol2 = /column2content/.test(html);
  const idxBody = html.indexOf('id="body"');
  const idxBody2 = html.indexOf("id='body'");
  const idxFooter = html.search(/id=["']footer["']/);
  const sideCount = (html.match(/side_bar\//g) || []).length;
  console.log(path, {
    hasBody,
    has2,
    has3,
    hasCol2,
    idxBody,
    idxBody2,
    idxFooter,
    sideCount,
    len: html.length,
  });

  // Find how body closes
  if (idxBody > 0) {
    const after = html.slice(idxBody, idxBody + 800);
    console.log("  body open:", after.replace(/\s+/g, " ").slice(0, 250));
    // count nested divs issue
    const endComment = html.indexOf("END: Right", idxBody);
    const endBody = html.indexOf("</div>", html.indexOf("END: Right Colume", idxBody));
    console.log("  END Right at", endComment, "next </div>", endBody);
  }

  // For CS pages find content wrapper
  const wrappers = ["column2content", "cscontent", "contentarea", "main-content", "pagecontent"];
  for (const w of wrappers) {
    if (html.includes(w)) console.log("  has wrapper", w);
  }
}

const paths = [
  "/web/my/info/ownership",
  "/web/my/info/benefits/membership",
  "/web/cs?a=60&p=directory",
  "/web/cs?a=60&p=eplus",
  "/web/cs?a=60&p=deposit",
  "/web/my/channel",
  "/web/cs?a=60&p=about",
];

for (const p of paths) await check(p);
