// The Arrival has two engines (CSS scroll-driven, rAF fallback). Shoot the
// same scroll positions through both at phone and desktop sizes so they can
// be compared frame for frame.
//   node scripts/arrival-check.js
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "shots-arrival");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STOPS = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [mode, extra] of [
    ["css", []],
    ["js", ["--disable-blink-features=ScrollTimeline"]],
  ]) {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
      args: ["--no-sandbox", ...extra],
    });
    for (const [tag, vp] of [
      ["desk", { width: 1440, height: 900 }],
      ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
    ]) {
      const page = await browser.newPage();
      await page.setViewport(vp);
      await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
      await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 60000 });
      const engine = await page.evaluate(() => CSS.supports("animation-timeline: scroll()") ? "css" : "js");
      const total = await page.evaluate(() => {
        const s = document.querySelector(".arrival");
        return s.offsetHeight - s.firstElementChild.clientHeight;
      });
      for (const p of STOPS) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * p));
        await sleep(350);
        await page.screenshot({ path: path.join(OUT, `${mode}-${tag}-${String(p).replace(".", "_")}.png`) });
      }
      // the stage-3 buttons must be clickable at the end
      const clickable = await page.evaluate(() => {
        const a = [...document.querySelectorAll(".arr-t3 a")][0];
        const r = a.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!hit && (hit === a || a.contains(hit));
      });
      console.log(`${mode}/${tag}: engine=${engine} total=${total}px buttonClickable=${clickable}`);
      await page.close();
    }
    await browser.close();
  }
  console.log("shots in", OUT);
})();
