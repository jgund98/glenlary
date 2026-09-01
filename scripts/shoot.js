/* Headless screenshot rig: every page, desktop + mobile, scroll stops. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "shots");
const BASE = "http://localhost:3571";
const PAGES = ["", "estate", "weddings", "gallery", "vendors", "love-notes", "tour"];

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });

  for (const [tag, viewport] of [
    ["desk", { width: 1440, height: 900 }],
    ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
  ]) {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    for (const slug of PAGES) {
      const name = slug === "" ? "home" : slug;
      await page.goto(`${BASE}/${slug}`, { waitUntil: "networkidle2", timeout: 90000 });
      await new Promise((r) => setTimeout(r, 1600));

      const { total, vh } = await page.evaluate(() => ({
        total: document.body.scrollHeight,
        vh: window.innerHeight,
      }));

      const step = vh * 0.92;
      let idx = 0;
      for (let y = 0; y < total - vh * 0.5; y += step) {
        const yy = Math.min(y, total - vh);
        await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), yy);
        await new Promise((r) => setTimeout(r, 1100));
        await page.screenshot({
          path: path.join(OUT, `${tag}-${name}-${String(idx).padStart(2, "0")}.png`),
        });
        idx++;
        if (idx > 40) break;
      }
      console.log(`${tag}/${name}: ${idx} shots`);
    }
    await page.close();
  }

  await browser.close();
  console.log("done ->", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
