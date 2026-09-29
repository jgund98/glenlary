// Round-6 client revisions: shoot every touched spot at desktop + phone.
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "shots-rev");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shootEl(page, sel, file, opts = {}) {
  const el = await page.$(sel);
  if (!el) return console.log("missing", sel);
  await page.evaluate((e, block) => e.scrollIntoView({ block }), el, opts.block || "start");
  await sleep(opts.wait || 1600);
  if (opts.viewport) await page.screenshot({ path: file });
  else await el.screenshot({ path: file });
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  for (const [tag, vp] of [
    ["desk", { width: 1440, height: 900 }],
    ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
  ]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
    const o = (n) => path.join(OUT, `${tag}-${n}.png`);

    // home: hero stage 1, stage 2 line, intro headline, closing band
    await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 60000 });
    await sleep(1500);
    await page.screenshot({ path: o("home-hero") });
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.1));
    await sleep(1500);
    await page.screenshot({ path: o("home-stage2") });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    await shootEl(page, "main section:nth-of-type(2)", o("home-intro"), { viewport: true });
    const bands = await page.$$("section.bg-ink");
    const last = bands[bands.length - 1];
    await page.evaluate((e) => e.scrollIntoView({ block: "center" }), last);
    await sleep(1800);
    await page.screenshot({ path: o("home-cta") });

    // estate
    await page.goto(BASE + "/estate", { waitUntil: "networkidle0", timeout: 60000 });
    await sleep(1200);
    await page.screenshot({ path: o("estate-hero") });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    await shootEl(page, "#manor", o("estate-manor"));
    await shootEl(page, "#barn", o("estate-barn"));
    await shootEl(page, "#cabin", o("estate-cabin"));
    const intro = await page.$("main section, section");
    const secs = await page.$$("section");
    await page.evaluate((e) => e.scrollIntoView({ block: "start" }), secs[1]);
    await sleep(1500);
    await secs[1].screenshot({ path: o("estate-history") });

    // weddings corporate card
    await page.goto(BASE + "/weddings", { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    const h = await page.$$eval("h3", (hs) => hs.findIndex((x) => /Corporate/.test(x.textContent)));
    if (h >= 0) {
      const el = (await page.$$("h3"))[h];
      await page.evaluate((e) => e.scrollIntoView({ block: "center" }), el);
      await sleep(1500);
      await page.screenshot({ path: o("weddings-corporate") });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1200);
    await page.screenshot({ path: o("weddings-hero") });

    // tour
    await page.goto(BASE + "/tour", { waitUntil: "networkidle0", timeout: 60000 });
    await sleep(1500);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    const card = await page.$(".card-invite");
    await page.evaluate((e) => e.scrollIntoView({ block: "start" }), card);
    await sleep(1200);
    await page.screenshot({ path: o("tour-card") });
    const dir = await page.$$eval("p", (ps) => ps.findIndex((p) => /Events Director/.test(p.textContent)));
    if (dir >= 0) {
      const el = (await page.$$("p"))[dir];
      await page.evaluate((e) => e.scrollIntoView({ block: "center" }), el);
      await sleep(1000);
      await page.screenshot({ path: o("tour-contact") });
    }

    // gallery map
    await page.goto(BASE + "/gallery", { waitUntil: "networkidle0", timeout: 60000 });
    const sec = await page.$('section[aria-labelledby="estate-map-title"]');
    await page.evaluate((e) => e.scrollIntoView({ block: "start" }), sec);
    await sleep(3800);
    await sec.screenshot({ path: o("map") });
    const svg = await page.$('section[aria-labelledby="estate-map-title"] svg');
    await svg.screenshot({ path: o("map-svg") });
    await page.close();
  }
  await browser.close();
  console.log("shots in", OUT);
})();
