// Proves the compositor (CSS scroll-timeline) Arrival is the same experience
// as the original JS ramps: at many scroll positions on an emulated phone,
// read each layer's live opacity/transform and compare to the ramp values.
//   node scripts/arrival-parity.js
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ramp(p, stops, values) {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + t * (values[i] - values[i - 1]);
    }
  }
  return values[values.length - 1];
}
const EXPECT = {
  ".arr-gates": (p) => ({ o: ramp(p, [0, 0.26, 0.36], [1, 1, 0]) }),
  ".arr-gates-img": (p) => ({ s: ramp(p, [0, 0.36], [1, 1.14]) }),
  ".arr-lane": (p) => ({ o: ramp(p, [0.26, 0.36, 0.58, 0.68], [0, 1, 1, 0]) }),
  ".arr-lane-img": (p) => ({ s: ramp(p, [0.26, 0.68], [1.05, 1.18]) }),
  ".arr-manor": (p) => ({ o: ramp(p, [0.58, 0.68], [0, 1]) }),
  ".arr-manor-img": (p) => ({ s: ramp(p, [0.58, 1], [1.1, 1]) }),
  ".arr-t1": (p) => ({ o: ramp(p, [0, 0.2, 0.32], [1, 1, 0]), y: ramp(p, [0, 0.32], [0, -40]) }),
  ".arr-t2": (p) => ({ o: ramp(p, [0.34, 0.44, 0.54, 0.64], [0, 1, 1, 0]) }),
  ".arr-t3": (p) => ({ o: ramp(p, [0.7, 0.82], [0, 1]), y: ramp(p, [0.7, 0.85], [30, 0]) }),
  ".arr-cue": (p) => ({ o: ramp(p, [0, 0.08], [1, 0]) }),
};

(async () => {
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
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("gl-intro", "1"));
  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 90000 });
  await sleep(600);
  const env = await page.evaluate(() => {
    const s = document.querySelector(".arrival");
    return {
      engine: CSS.supports("animation-timeline: scroll()") ? "compositor (CSS)" : "JS",
      coarse: matchMedia("(pointer: coarse)").matches,
      total: s.offsetHeight - s.firstElementChild.clientHeight,
      top: s.getBoundingClientRect().top + window.scrollY,
    };
  });
  console.log("engine:", env.engine, "| touch:", env.coarse, "| runway:", env.total + "px");

  let worst = 0;
  let worstAt = "";
  for (let i = 0; i <= 40; i++) {
    const p = i / 40;
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(env.top + env.total * p));
    await sleep(120);
    const live = await page.evaluate((sels) => {
      const out = {};
      for (const sel of sels) {
        const el = document.querySelector(sel);
        const cs = getComputedStyle(el);
        const m = new DOMMatrixReadOnly(cs.transform === "none" ? undefined : cs.transform);
        out[sel] = { o: +cs.opacity, s: m.a, y: m.f };
      }
      return out;
    }, Object.keys(EXPECT));
    for (const [sel, fn] of Object.entries(EXPECT)) {
      const want = fn(p);
      for (const k of Object.keys(want)) {
        const tol = k === "y" ? 1.5 : k === "o" ? 0.02 : 0.004;
        const d = Math.abs(live[sel][k] - want[k]);
        const norm = d / tol;
        if (norm > worst) { worst = norm; worstAt = `${sel}.${k} at p=${p.toFixed(3)} live=${live[sel][k].toFixed(3)} want=${want[k].toFixed(3)}`; }
      }
    }
  }
  console.log(worst <= 1 ? "PARITY OK" : "PARITY OFF", "| worst:", worstAt, `(x${worst.toFixed(2)} of tolerance)`);
  await browser.close();
})();
