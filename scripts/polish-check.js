/* Polish verification: hero (no frame), plaques on photos, tour card, scroll reset. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "..", "shots-polish");

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // scroll-reset check: scroll deep on home, click through to vendors
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await page.evaluate(() => sessionStorage.setItem("gl-intro", "1"));
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollTo({ top: 6000, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 700));
  await page.evaluate(() => {
    [...document.querySelectorAll("a")].find((a) => a.getAttribute("href") === "/vendors").click();
  });
  await new Promise((r) => setTimeout(r, 2200));
  const y = await page.evaluate(() => window.scrollY);
  console.log("scroll after route change:", y);

  // hero: no frame
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(OUT, "hero.png") });

  // CTA band plaque (vendors CTA)
  await page.goto("http://localhost:3571/vendors", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900));
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight - 900, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: path.join(OUT, "cta-plaque.png") });

  // tour card
  await page.goto("http://localhost:3571/tour?when=October%202027", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollTo({ top: 760, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT, "tour-card.png") });

  // mobile hero
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(OUT, "hero-mob.png") });

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
