/* Shoot the Residents strip at desktop and mobile. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "..", "shots-residents");

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
  for (const [name, vp] of [
    ["desk", { width: 1440, height: 900 }],
    ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true }],
  ]) {
    await page.setViewport(vp);
    await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
    await page.evaluate(() => sessionStorage.setItem("gl-intro", "1"));
    await page.reload({ waitUntil: "networkidle2" });
    const y = await page.evaluate(() => {
      const h = [...document.querySelectorAll("h2")].find((x) =>
        x.textContent.includes("four legs")
      );
      const s = h.closest("section");
      return s.getBoundingClientRect().top + window.scrollY;
    });
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 2500));
    const el = await page.evaluateHandle(() =>
      [...document.querySelectorAll("h2")]
        .find((x) => x.textContent.includes("four legs"))
        .closest("section")
    );
    await el.screenshot({ path: path.join(OUT, `${name}.png`) });
  }
  await browser.close();
})();
