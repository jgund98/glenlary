/* Final home spot-check: sticky pill timing, reel, PYD, full flow. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "..", "shots-final");

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

  // Mobile: pill must be hidden during the arrival, visible after
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await page.evaluate(() => sessionStorage.setItem("gl-intro", "1"));
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  const check = async (label, y) => {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 900));
    const vis = await page.evaluate(() => {
      const a = [...document.querySelectorAll("a")].find((x) =>
        x.className.includes("rounded-full")
      );
      if (!a) return "no pill";
      const cs = getComputedStyle(a);
      return cs.opacity !== "0" && !a.className.includes("pointer-events-none")
        ? "visible"
        : "hidden";
    });
    console.log(label, vis);
  };
  const heroH = await page.evaluate(
    () => document.querySelector("main section").offsetHeight
  );
  await check("pill mid-arrival:", heroH * 0.5);
  await check("pill just-before-end:", heroH - 900);
  await check("pill after-arrival:", heroH + 400);

  // Desktop full-flow key frames
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1400));
  const total = await page.evaluate(() => document.body.scrollHeight);
  const stops = [0.0, 0.34, 0.4, 0.46, 0.56, 0.66, 0.76, 0.86, 0.95];
  for (let i = 0; i < stops.length; i++) {
    const y = Math.min(total - 900, Math.round(total * stops[i]));
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 1300));
    await page.screenshot({ path: path.join(OUT, `home-${String(i).padStart(2, "0")}.png`) });
  }
  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
