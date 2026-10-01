// Mobile scroll smoothness rig. Emulates a mid-range phone (390x844 @3x,
// 4x CPU slowdown), scrolls each page top to bottom in small steps, and
// reports frame-time stats, long tasks, and image bytes transferred.
//   node scripts/perf-check.js [path ...]   (default: / and /weddings)
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const paths = process.argv.slice(2);
  // routes are given without a leading slash (Git Bash rewrites "/" to a path)
  const norm = (p) => (p === "." || p === "/" ? "/" : "/" + p.replace(/^\/+/, ""));
  const targets = (paths.length ? paths : [".", "weddings"]).map(norm);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox", "--enable-gpu-rasterization"],
  });
  for (const p of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
    const client = await page.createCDPSession();
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    let imgBytes = 0;
    let imgCount = 0;
    page.on("response", async (r) => {
      const ct = r.headers()["content-type"] || "";
      if (ct.startsWith("image/")) {
        const len = Number(r.headers()["content-length"] || 0);
        imgBytes += len;
        imgCount++;
      }
    });
    await page.goto(BASE + p, { waitUntil: "networkidle0", timeout: 90000 });
    await sleep(600);

    const stats = await page.evaluate(async () => {
      const frames = []; const slow = [];
      let longTasks = 0;
      let longTaskMs = 0;
      const po = new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          longTasks++;
          longTaskMs += e.duration;
        }
      });
      try { po.observe({ type: "longtask", buffered: false }); } catch {}
      const max = document.documentElement.scrollHeight - innerHeight;
      let last = performance.now();
      let y = 0;
      await new Promise((done) => {
        const step = (now) => {
          frames.push(now - last); if (now - last > 50) { const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2); const sec = el && el.closest("section"); slow.push(Math.round(y) + ":" + (sec ? (sec.getAttribute("aria-label") || sec.className.slice(0, 40)) : "?")); }
          last = now;
          y += 14; // ~a slow thumb flick
          window.scrollTo(0, y);
          if (y < max) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      });
      po.disconnect();
      frames.shift();
      const sorted = [...frames].sort((a, b) => a - b);
      const q = (k) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * k))];
      const over = (ms) => frames.filter((f) => f > ms).length;
      return {
        frames: frames.length,
        avg: +(frames.reduce((a, b) => a + b, 0) / frames.length).toFixed(1),
        p50: +q(0.5).toFixed(1),
        p95: +q(0.95).toFixed(1),
        max: +sorted[sorted.length - 1].toFixed(1),
        over33: over(33),
        over50: over(50),
        longTasks,
        longTaskMs: Math.round(longTaskMs), slow,
      };
    });
    console.log(
      `${p.padEnd(10)} frames=${stats.frames} avg=${stats.avg}ms p50=${stats.p50} p95=${stats.p95} max=${stats.max}` +
        ` >33ms=${stats.over33} >50ms=${stats.over50} longTasks=${stats.longTasks} (${stats.longTaskMs}ms)` +
        ` images=${imgCount} ${(imgBytes / 1048576).toFixed(1)}MB` + (stats.slow.length ? "\n           slow at: " + stats.slow.join(" | ") : "")
    );
    await page.close();
  }
  await browser.close();
})();
