const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const OUT = "shots-map";
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe", args: ["--no-sandbox"] });
  const report = [];
  for (const [tag, vp] of [["desk", { width: 1440, height: 900 }], ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const p of ["", "estate", "weddings", "gallery", "love-notes", "tour"]) {
      errors.length = 0;
      await page.goto(`${BASE}/${p}`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo(0, 0); });
      await sleep(600);
      const r = await page.evaluate(() => ({
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src).slice(0, 5),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      report.push(`${tag} /${p}: errors=${errors.length} broken=${r.broken.length} overflow=${r.overflow}${errors.length ? " :: " + errors.slice(0, 2).join(" | ") : ""}${r.broken.length ? " :: " + r.broken.join(",") : ""}`);
    }
    // map
    await page.goto(`${BASE}/gallery`, { waitUntil: "networkidle0", timeout: 60000 });
    const sec = await page.$('section[aria-labelledby="estate-map-title"]');
    await page.evaluate((el) => el.scrollIntoView({ block: "start" }), sec);
    await sleep(4200);
    await sec.screenshot({ path: `${OUT}/${tag}-v3-day.png` });
    const pins = await page.$$(".map-pin");
    if (tag === "desk") {
      await pins[6].click(); await sleep(900);
      await sec.screenshot({ path: `${OUT}/${tag}-v3-moving.png` });
      await sleep(2200);
      await sec.screenshot({ path: `${OUT}/${tag}-v3-barn.png` });
      await pins[3].click(); await sleep(2800);
      await sec.screenshot({ path: `${OUT}/${tag}-v3-manor.png` });
    } else {
      await pins[3].click(); await sleep(1200);
      await page.screenshot({ path: `${OUT}/${tag}-v3-sheet-manor.png` });
      const openDialog = await page.$('[role="dialog"]');
      report.push(`mob sheet open: ${!!openDialog}`);
      await page.click('[role="dialog"] button'); // Close is the first button
      await sleep(600);
      report.push(`mob sheet closed: ${!(await page.$('[role="dialog"]'))}`);
      await pins[4].click(); await sleep(1200);
      await page.screenshot({ path: `${OUT}/${tag}-v3-sheet-tent.png` });
      await page.keyboard.press("Escape"); await sleep(400);
      await sec.screenshot({ path: `${OUT}/${tag}-v3-after.png` });
    }
    // home teaser + residents
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 60000 });
    for (const [name, needle] of [["teaser", "tent-exterior-sky"], ["residents", "pond-spring"]]) {
      const ok = await page.evaluate((n) => { const el = [...document.images].find((x) => (x.currentSrc || x.src).includes(n)); if (!el) return false; el.scrollIntoView({ block: "center" }); return true; }, needle);
      await sleep(1800);
      if (ok) await page.screenshot({ path: `${OUT}/${tag}-v3-${name}.png` });
      else report.push(`${tag} ${name} image not found`);
    }
    await page.close();
  }
  await browser.close();
  console.log(report.join("\n"));
})().catch((e) => { console.error(e); process.exit(1); });
