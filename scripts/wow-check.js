/* Verify Backdrops index, AlbumDrop polaroids, and the new QuoteBand. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "..", "shots-wow");

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
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await page.evaluate(() => sessionStorage.setItem("gl-intro", "1"));
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1400));

  const at = async (yEval, name, settle = 1400) => {
    await page.evaluate(yEval);
    await new Promise((r) => setTimeout(r, settle));
    await page.screenshot({ path: path.join(OUT, name) });
  };

  // Backdrops index (hover item III)
  await at(() => {
    const el = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("backdrop")) || document.querySelectorAll("section")[1].querySelector("h2");
    window.scrollTo({ top: el.closest("section").offsetTop + 60, behavior: "instant" });
  }, "backdrops-default.png");
  await page.evaluate(() => {
    const link = [...document.querySelectorAll("a")].find((a) => a.textContent.includes("The Great Oak"));
    link.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT, "backdrops-hover.png") });

  // QuoteBand
  await at(() => {
    const el = [...document.querySelectorAll("blockquote")][0];
    window.scrollTo({ top: el.closest("section").offsetTop - 80, behavior: "instant" });
  }, "quote-panel.png");

  // AlbumDrop: early, mid, late
  const albumTop = await page.evaluate(() => {
    const el = [...document.querySelectorAll("section")].find((s) => s.getAttribute("aria-label") === "From the album");
    return el.offsetTop;
  });
  const albumH = await page.evaluate(() => {
    const el = [...document.querySelectorAll("section")].find((s) => s.getAttribute("aria-label") === "From the album");
    return el.offsetHeight;
  });
  const stops = [0.18, 0.5, 0.9];
  for (let i = 0; i < stops.length; i++) {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), albumTop + (albumH - 900) * stops[i]);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(OUT, `album-${i}.png`) });
  }

  // Mobile: album mid + backdrops cards
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1400));
  const mAlbum = await page.evaluate(() => {
    const el = [...document.querySelectorAll("section")].find((s) => s.getAttribute("aria-label") === "From the album");
    return { top: el.offsetTop, h: el.offsetHeight };
  });
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), mAlbum.top + (mAlbum.h - 844) * 0.55);
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT, "album-mob.png") });

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
