const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "shots-map");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  const report = [];
  for (const [tag, vp] of [
    ["desk", { width: 1440, height: 900 }],
    ["mob", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
  ]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("glenlary-intro", "1"));
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));

    // health sweep
    for (const p of ["", "estate", "weddings", "gallery", "love-notes", "tour"]) {
      errors.length = 0;
      await page.goto(`${BASE}/${p}`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        window.scrollTo(0, 0);
      });
      await sleep(800);
      const r = await page.evaluate(() => ({
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src).slice(0, 5),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        vendors: document.body.innerHTML.includes("/vendors"),
      }));
      report.push(`${tag} /${p}: errors=${errors.length} broken=${r.broken.length} overflow=${r.overflow} vendorsLink=${r.vendors}${errors.length ? " :: " + errors.slice(0, 2).join(" | ") : ""}${r.broken.length ? " :: " + r.broken.join(",") : ""}`);
    }

    // gallery map shots
    await page.goto(`${BASE}/gallery`, { waitUntil: "networkidle0", timeout: 60000 });
    const sec = await page.$('section[aria-labelledby="estate-map-title"]');
    await page.evaluate((el) => el.scrollIntoView({ block: "start" }), sec);
    await sleep(3800);
    await sec.screenshot({ path: `${OUT}/${tag}-map-1.png` });
    const pins = await page.$$(".map-pin");
    await pins[6].click(); await sleep(900);
    await sec.screenshot({ path: `${OUT}/${tag}-map-barn.png` });
    await pins[2].click(); await sleep(900);
    await sec.screenshot({ path: `${OUT}/${tag}-map-tent.png` });
    // see-the-photos button -> filter + scroll
    const btn = await page.$('section[aria-labelledby="estate-map-title"] .btn-fill');
    await btn.click(); await sleep(1800);
    await sleep(1200);
    const markerTop = await page.evaluate(() => { const el = document.querySelector('section[aria-labelledby="estate-map-title"]').nextElementSibling; return Math.round(el.getBoundingClientRect().top); });
    report.push(`${tag} explore markerTop=${markerTop}`);
    await page.screenshot({ path: `${OUT}/${tag}-after-explore.png` });
    // grid bottom for the "Everything" filter
    await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim().toLowerCase() === "everything"); b && b.click(); });
    await sleep(600);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1200);
    await page.evaluate(() => window.scrollBy(0, -1400));
    await sleep(900);
    await page.screenshot({ path: `${OUT}/${tag}-grid-end.png` });

    // home: teaser arches + residents
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 60000 });
    for (const [name, needle] of [["teaser", "tent-night-glow"], ["residents", "foal-fence"]]) {
      const ok = await page.evaluate((n) => {
        const el = [...document.images].find((x) => (x.currentSrc || x.src).includes(n));
        if (!el) return false;
        const s = el.closest("section") || el; s.scrollIntoView({ block: "start" }); return true;
      }, needle);
      await sleep(1600);
      if (ok) await page.screenshot({ path: `${OUT}/${tag}-home-${name}.png` });
    }
    await page.close();
  }
  await browser.close();
  console.log(report.join("\n"));
}
main().catch((e) => { console.error(e); process.exit(1); });
