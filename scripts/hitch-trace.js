// Trace the first stretch of a phone scroll through the hero and list every
// renderer task over 25ms with its biggest children, to name the hitches.
//   node scripts/hitch-trace.js [fromY] [toY]
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const from = Number(process.argv[2] || 0);
  const to = Number(process.argv[3] || 2200);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.emulate({
    viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Mobile Safari/537.36",
  });
  const client = await page.createCDPSession();
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate((y) => window.scrollTo(0, y), from);
  await sleep(1500);
  const file = path.join(__dirname, "..", "shots-perf", "hitch.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.tracing.start({ path: file, categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "blink", "cc", "gpu"] });
  await page.evaluate(async (a, b) => {
    let y = a;
    await new Promise((done) => {
      const step = () => {
        y += 14;
        window.scrollTo(0, y);
        if (y < b) requestAnimationFrame(step);
        else done();
      };
      requestAnimationFrame(step);
    });
  }, from, to);
  await sleep(300);
  await page.tracing.stop();
  const ev = JSON.parse(fs.readFileSync(file, "utf8")).traceEvents.filter((e) => e.ph === "X" && e.dur);
  const threads = {};
  for (const e of JSON.parse(fs.readFileSync(file, "utf8")).traceEvents) if (e.name === "thread_name") threads[e.pid + ":" + e.tid] = e.args.name;
  const long = ev.filter((e) => e.dur > 25000 && /RunTask|ThreadControllerImpl|Task/.test(e.name));
  for (const t of long.slice(0, 12)) {
    const kids = ev.filter((c) => c.tid === t.tid && c.pid === t.pid && c.ts >= t.ts && c.ts + c.dur <= t.ts + t.dur && c !== t && c.dur > 3000)
      .sort((a, b) => b.dur - a.dur).slice(0, 5).map((c) => `${c.name}:${(c.dur / 1000).toFixed(0)}`);
    console.log(`${(t.dur / 1000).toFixed(0)}ms on ${threads[t.pid + ":" + t.tid] || t.tid} -> ${kids.join(", ")}`);
  }
  await browser.close();
})();
