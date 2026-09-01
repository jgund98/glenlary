/* Pull the Ellie & Josh Pixieset gallery: unlock, scroll, download xxlarge set. */
const { createRequire } = require("module");
const req = createRequire("C:/Users/Lucky/gus-renny/package.json");
const puppeteer = req("puppeteer");
const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT = "C:/Users/Lucky/glenlary-assets/pixieset";
const URL = "https://melaniemauerphotography.pixieset.com/ellieandjosh-1/";
const PASSWORD = "bestday!!";

function fetchFile(url, dest) {
  return new Promise((resolve) => {
    const f = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          f.close();
          fs.rmSync(dest, { force: true });
          return resolve(false);
        }
        res.pipe(f);
        f.on("finish", () => f.close(() => resolve(true)));
      })
      .on("error", () => {
        f.close();
        fs.rmSync(dest, { force: true });
        resolve(false);
      });
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });

  // password gate (may be remembered via cookie on retry)
  await new Promise((r) => setTimeout(r, 2500));
  const gate = await page.$('input[type="password"]');
  if (gate) {
    await gate.type(PASSWORD, { delay: 40 });
    const btn = await page.$('button[type="submit"]');
    if (btn) await btn.click();
    else await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.log(
    "after gate:",
    await page.evaluate(() => ({
      title: document.title,
      imgs: document.querySelectorAll("img").length,
      hasGate: !!document.querySelector('input[type="password"]'),
      bodyLen: document.body.innerText.length,
    }))
  );
  await page.screenshot({ path: path.join(OUT, "_debug.png") });

  // scroll until the page stops growing
  let last = 0;
  for (let i = 0; i < 120; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 500));
    const h = await page.evaluate(() => document.body.scrollHeight);
    if (h === last && i > 6) break;
    last = h;
  }

  const ids = await page.evaluate(() => {
    const set = new Set();
    document.querySelectorAll("img").forEach((im) => {
      const srcs = [im.currentSrc || im.src, im.getAttribute("srcset") || ""].join(",");
      for (const m of srcs.matchAll(/images\.pixieset\.com\/(\d+)\/([a-f0-9]+)-/g)) {
        set.add(m[1] + "/" + m[2]);
      }
    });
    return [...set];
  });
  console.log("ids:", ids.length);
  fs.writeFileSync(path.join(OUT, "_ids.txt"), ids.join("\n"));
  await browser.close();

  // download xxlarge (fall back to xlarge) with limited concurrency
  let ok = 0, fail = 0, idx = 0;
  const seq = ids.map((id, i) => ({ id, n: i }));
  async function worker() {
    while (idx < seq.length) {
      const { id, n } = seq[idx++];
      const name = String(n).padStart(3, "0") + "-" + id.split("/")[1].slice(0, 8) + ".jpg";
      const dest = path.join(OUT, name);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 30000) { ok++; continue; }
      const big = `https://images.pixieset.com/${id}-xxlarge.jpg`;
      const med = `https://images.pixieset.com/${id}-xlarge.jpg`;
      const got = (await fetchFile(big, dest)) || (await fetchFile(med, dest));
      got ? ok++ : fail++;
      if ((ok + fail) % 100 === 0) console.log("progress", ok + fail, "/", seq.length);
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log("downloaded ok:", ok, "fail:", fail);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
