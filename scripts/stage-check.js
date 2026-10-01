// Phone stage mode: scroll a touch-emulated phone through the Arrival and the
// album, confirm the stage flips and the prints land, and shoot each state.
//   node scripts/stage-check.js
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "shots-stage");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.emulate({
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  });
  // touch emulation already makes (pointer: coarse) and (hover: none) true
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 90000 });
  await sleep(800);

  const info = await page.evaluate(() => {
    const s = document.querySelector(".arrival");
    return { fine: matchMedia("(hover: hover) and (pointer: fine)").matches, mode: s.dataset.mode, stage: s.dataset.stage, total: s.offsetHeight - s.firstElementChild.clientHeight };
  });
  console.log("arrival", info);
  for (const [name, p] of [["s0", 0], ["s0-late", 0.2], ["s1", 0.45], ["s2", 0.8], ["s2-end", 1]]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(info.total * p));
    await sleep(1400);
    const st = await page.evaluate(() => document.querySelector(".arrival").dataset.stage);
    await page.screenshot({ path: path.join(OUT, `arrival-${name}.png`) });
    console.log(`  p=${p} stage=${st}`);
  }
  const clickable = await page.evaluate(() => {
    const a = document.querySelector(".arr-t3 a");
    const r = a.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && (hit === a || a.contains(hit));
  });
  console.log("  tour button clickable at stage 2:", clickable);

  // album
  const album = await page.evaluate(() => {
    const s = document.querySelector('section[aria-label="From the album"]');
    return { top: s.getBoundingClientRect().top + window.scrollY, total: s.offsetHeight - window.innerHeight };
  });
  for (const p of [0.02, 0.35, 0.7, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(album.top + album.total * p));
    await sleep(1600);
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll('section[aria-label="From the album"] .polaroid')].filter((e) => e.style.opacity === "1").length
    );
    await page.screenshot({ path: path.join(OUT, `album-${String(p).replace(".", "_")}.png`) });
    console.log(`album p=${p} prints shown=${shown}`);
  }
  await browser.close();
})();
