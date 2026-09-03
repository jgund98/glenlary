const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe", args: ["--no-sandbox"] });
  const out = [];
  for (const [tag, vp] of [["se", { width: 375, height: 667, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
    const errors = []; page.on("pageerror", (e) => errors.push(String(e))); page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("http://localhost:3571/gallery", { waitUntil: "networkidle0", timeout: 60000 });
    const sec = await page.$('section[aria-labelledby="estate-map-title"]');
    await page.evaluate((el) => el.scrollIntoView({ block: "start" }), sec);
    await sleep(3500);
    await page.screenshot({ path: `shots-map/${tag}-s-map.png` });
    const pins = await page.$$(".map-pin");
    const tapPin = async (i) => { await pins[i].evaluate((el) => el.scrollIntoView({ block: "center" })); await sleep(500); const b = await pins[i].boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await sleep(1000); };
    await tapPin(3);
    out.push(`${tag} open after tap: ${!!(await page.$('[role="dialog"]'))}`);
    await page.screenshot({ path: `shots-map/${tag}-s-sheet.png` });
    // scroll the sheet to the bottom to check it fits / scrolls
    await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); d.scrollTop = d.scrollHeight; });
    await sleep(400);
    await page.screenshot({ path: `shots-map/${tag}-s-sheet-bottom.png` });
    // next stop inside the sheet
    await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); d.scrollTop = 0; });
    const next = await page.$('[role="dialog"] button[aria-label="Next stop"]');
    const nb = await next.boundingBox(); await page.touchscreen.tap(nb.x + 5, nb.y + 5); await sleep(900);
    out.push(`${tag} after next: ${await page.$eval('[role="dialog"]', (d) => d.getAttribute("aria-label"))}`);
    // close with the X
    const x = await page.$('[role="dialog"] button[aria-label="Close"]');
    const xb = await x.boundingBox(); await page.touchscreen.tap(xb.x + xb.width / 2, xb.y + xb.height / 2); await sleep(600);
    out.push(`${tag} closed via X: ${!(await page.$('[role="dialog"]'))}`);
    // reopen another, close with Back to the map
    await tapPin(6);
    out.push(`${tag} reopened: ${await page.$eval('[role="dialog"]', (d) => d.getAttribute("aria-label")).catch(() => "no")}`);
    const back = await page.$$('[role="dialog"] button');
    for (const b of back) { const t = await b.evaluate((el) => el.textContent.trim()); if (t === "Back to the map") { const bb = await b.boundingBox(); await page.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); } }
    await sleep(600);
    out.push(`${tag} closed via button: ${!(await page.$('[role="dialog"]'))}`);
    // swipe down to close
    await tapPin(1);
    await page.touchscreen.touchStart(190, 300); await sleep(50);
    for (let y = 320; y <= 460; y += 20) { await page.touchscreen.touchMove(190, y); await sleep(20); }
    await page.touchscreen.touchEnd(); await sleep(600);
    out.push(`${tag} closed via swipe: ${!(await page.$('[role="dialog"]'))}`);
    out.push(`${tag} body overflow restored: ${await page.evaluate(() => document.documentElement.style.overflow === "")}`);
    out.push(`${tag} errors: ${errors.length}`);
    await page.screenshot({ path: `shots-map/${tag}-s-after.png` });
    await page.close();
  }
  await browser.close(); console.log(out.join("\n"));
})().catch((e) => { console.error(e); process.exit(1); });
