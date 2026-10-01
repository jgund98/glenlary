// Where does the phone's time go? Traces a mobile-emulated scroll of each
// page and sums the renderer's paint / raster / decode / script work, which
// the frame-time rig (perf-check.js) cannot see on a desktop GPU.
//   node scripts/perf-trace.js . weddings
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = path.join(__dirname, "..", "shots-perf");

const BUCKETS = {
  paint: ["Paint", "PaintImage"],
  raster: ["RasterTask", "RasterizerTaskImpl", "Rasterize"],
  decode: ["ImageDecodeTask", "Decode Image", "Decode LazyPixelRef", "ImageUploadTask"],
  layout: ["Layout", "UpdateLayoutTree", "PrePaint", "UpdateLayer", "UpdateLayerTree"],
  script: ["FunctionCall", "EvaluateScript", "TimerFire", "EventDispatch"],
  composite: ["CompositeLayers", "Commit", "ActivateLayerTree", "DrawFrame", "Layerize"],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const paths = process.argv.slice(2);
  const norm = (p) => (p === "." || p === "/" ? "/" : "/" + p.replace(/^\/+/, ""));
  const targets = (paths.length ? paths : [".", "weddings"]).map(norm);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  for (const p of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
    await page.goto(BASE + p, { waitUntil: "networkidle0", timeout: 90000 });
    await sleep(800);
    const file = path.join(OUT, `trace${p === "/" ? "-home" : p.replace(/\//g, "-")}.json`);
    await page.tracing.start({
      path: file,
      categories: ["disabled-by-default-devtools.timeline", "devtools.timeline", "disabled-by-default-devtools.timeline.frame"],
    });
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      let y = 0;
      await new Promise((done) => {
        const step = () => {
          y += 14;
          window.scrollTo(0, y);
          if (y < max) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      });
    });
    await sleep(300);
    await page.tracing.stop();
    const events = JSON.parse(fs.readFileSync(file, "utf8")).traceEvents;
    const sums = {};
    const byName = {};
    for (const e of events) {
      if (e.ph !== "X" || !e.dur) continue;
      byName[e.name] = (byName[e.name] || 0) + e.dur;
      for (const [k, names] of Object.entries(BUCKETS)) {
        if (names.includes(e.name)) sums[k] = (sums[k] || 0) + e.dur;
      }
    }
    const fmt = (k) => `${k}=${Math.round((sums[k] || 0) / 1000)}ms`;
    console.log(`${p.padEnd(10)} ${Object.keys(BUCKETS).map(fmt).join(" ")}`);
    const top = Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([n, d]) => `${n}:${Math.round(d / 1000)}`).join("  ");
    console.log(`           top: ${top}`);
    await page.close();
  }
  await browser.close();
})();
