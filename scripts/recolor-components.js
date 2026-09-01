const fs = require("fs");
const path = require("path");

const files = [
  ...fs.readdirSync("components").filter((f) => f.endsWith(".tsx")).map((f) => path.join("components", f)),
  "app/page.tsx",
  "app/estate/page.tsx",
  "app/weddings/page.tsx",
  "app/gallery/page.tsx",
  "app/vendors/page.tsx",
  "app/love-notes/page.tsx",
  "app/tour/page.tsx",
  "app/not-found.tsx",
];

// secondary copy -> the one approved muted role; add elevation to raised cards
const swaps = [
  [/text-ink\/85\b/g, "text-ink-soft"],
  [/text-ink\/70\b/g, "text-ink-soft"],
  [/text-ink\/65\b/g, "text-ink-soft"],
  [/text-ink\/60\b/g, "text-ink-soft"],
  [/text-ink\/75\b/g, "text-ink-soft"],
  [/text-ink\/80\b/g, "text-ink-soft"],
  [/text-ink\/55\b/g, "text-ink-soft"],
  [/text-ink\/50\b/g, "text-ink-soft"],
  [/text-ink\/40\b/g, "text-ink-soft"],
  // borders route through the token scale
  [/border-ink\/15\b/g, "border-ink/12"],
  [/border-ink\/20\b/g, "border-ink/15"],
  [/border-ink\/25\b/g, "border-ink/20"],
];

let total = 0;
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  for (const [re, to] of swaps) t = t.replace(re, to);
  if (t !== before) {
    fs.writeFileSync(f, t);
    total++;
  }
}
console.log("files updated:", total);
