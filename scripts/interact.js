/* Interaction verification: mobile menu, PictureYourDay, gallery film mode, tour prefill. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const path = require("path");
const OUT = path.join(__dirname, "..", "shots-interact");
const fs = require("fs");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  // 1) Mobile menu open/close
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await page.evaluate(() => sessionStorage.setItem("gl-intro", "1"));
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.click('button[aria-label="Open menu"]');
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(OUT, "menu-open.png") });
  const openOp = await page.evaluate(() => {
    const o = [...document.querySelectorAll("div")].find(
      (x) => x.className.includes && x.className.includes("z-40") && x.className.includes("fixed")
    );
    return getComputedStyle(o).opacity;
  });
  await page.click('button[aria-label="Close menu"]');
  await new Promise((r) => setTimeout(r, 900));
  const closedOp = await page.evaluate(() => {
    const o = [...document.querySelectorAll("div")].find(
      (x) => x.className.includes && x.className.includes("z-40") && x.className.includes("fixed")
    );
    return { op: getComputedStyle(o).opacity, pe: getComputedStyle(o).pointerEvents };
  });
  console.log("menu:", { openOp, closedOp });

  // 2) PictureYourDay: type initials, pick December, check card + link
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3571/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));
  const pydTop = await page.evaluate(() => {
    const el = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("Try the date on"));
    const sec = el.closest("section");
    window.scrollTo({ top: sec.offsetTop + 100, behavior: "instant" });
    return sec.offsetTop;
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.type('input[aria-label="Your first initial"]', "A");
  await page.type('input[aria-label="Their first initial"]', "M");
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Dec");
    btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT, "pyd-dec.png") });
  const tourHref = await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((x) => x.textContent.includes("Make It Real"));
    return a.getAttribute("href");
  });
  console.log("pyd link:", tourHref);

  // 3) Tour prefill
  await page.goto("http://localhost:3571" + tourHref, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900));
  const whenVal = await page.evaluate(() => document.querySelector('input[name="when"]').value);
  const heading = await page.evaluate(() =>
    [...document.querySelectorAll("h2")].map((h) => h.textContent).find((t) => t.includes("GlenLary") || t.includes("Tell us"))
  );
  await page.screenshot({ path: path.join(OUT, "tour-prefill.png") });
  console.log("tour:", { whenVal, heading });

  // 4) Gallery film mode
  await page.goto("http://localhost:3571/gallery", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => {
    window.scrollTo({ top: 900, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Watch as a Film"));
    b.click();
  });
  await new Promise((r) => setTimeout(r, 4500));
  const lbState = await page.evaluate(() => {
    const counter = [...document.querySelectorAll("span")].find((s) => /^\d+ \/ \d+$/.test(s.textContent.trim()));
    return counter ? counter.textContent.trim() : "no lightbox";
  });
  await page.screenshot({ path: path.join(OUT, "film-mode.png") });
  console.log("film:", lbState);

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
