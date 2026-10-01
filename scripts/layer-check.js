// GPU layers on a 3x phone: how many full-screen textures the hero keeps, and
// roughly how much memory they cost. iOS Safari starts dropping tiles (the
// "laggy" feel) when a page holds too much layer memory.
//   node scripts/layer-check.js [scrollY]
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const BASE = "http://localhost:3571";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const y = Number(process.argv[2] || 0);
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
  const client = await page.createCDPSession();
  await client.send("DOM.enable");
  let layers = [];
  client.on("LayerTree.layerTreeDidChange", (e) => { if (e.layers) layers = e.layers; });
  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 90000 });
  await client.send("LayerTree.enable");
  await page.evaluate((v) => window.scrollTo(0, v + 2), y);
  await sleep(300);
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await sleep(1500);
  const dpr = 3;
  const drawn = layers.filter((l) => l.drawsContent && !l.invisible);
  let px = 0;
  const big = [];
  for (const l of drawn) {
    const a = l.width * l.height * dpr * dpr;
    px += a;
    if (l.width * l.height > 390 * 844 * 0.5) {
      let name = "";
      if (l.backendNodeId) {
        try {
          const { node } = await client.send("DOM.describeNode", { backendNodeId: l.backendNodeId });
          const cls = (node.attributes || []).reduce((acc, v, i, arr) => (arr[i - 1] === "class" ? v : acc), "");
          name = `${node.nodeName.toLowerCase()}.${cls.split(" ").slice(0, 4).join(".")}`;
        } catch {}
      }
      big.push(`${l.width}x${l.height} ${name}`);
    }
  }
  console.log(`scrollY=${y} layers=${layers.length} drawing=${drawn.length} ~GPU=${((px * 4) / 1048576).toFixed(0)}MB`);
  console.log("screen-sized or bigger:\n  " + big.join("\n  "));
  await browser.close();
})();
