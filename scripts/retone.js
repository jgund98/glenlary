const fs = require("fs");
const p = "app/globals.css";
let t = fs.readFileSync(p, "utf8");

const swaps = [
  // body / selection base
  ["background: #fafaf7;", "background: #fbfaf7;"],
  ["color: #1d231c;", "color: #16201a;"],
  ["background: #24382b;\n  color: #fafaf7;", "background: #10331f;\n  color: #fbfaf7;"],

  // polaroid shadow -> elevation scale, ink-tinted
  [
    "  box-shadow:\n    0 18px 42px rgba(24, 28, 23, 0.28),\n    0 4px 10px rgba(24, 28, 23, 0.18);",
    "  box-shadow:\n    0 18px 42px rgba(22, 32, 26, 0.26),\n    0 4px 10px rgba(22, 32, 26, 0.16);",
  ],

  // on-photo whisper
  ["text-shadow: 0 1px 10px rgba(24, 28, 23, 0.22);", "text-shadow: 0 1px 10px rgba(22, 32, 26, 0.24);"],

  // plaques: pine + light gold rule
  ["  color: #dcb96a;\n  padding-left: 0.34em;", "  color: #e0b963;\n  padding-left: 0.34em;"],
  ["    background: #1c4229;\n    color: #fbfaf6;\n    border-left: 2px solid #dcb96a;", "    background: #10331f;\n    color: #fbfaf7;\n    border-left: 2px solid #e0b963;"],
  ["    box-shadow: 0 4px 18px rgba(24, 28, 23, 0.3);", "    box-shadow: var(--e2);"],
  ["  background: #1c4229;\n  color: #fbfaf6;\n  border-left: 2px solid #dcb96a;", "  background: #10331f;\n  color: #fbfaf7;\n  border-left: 2px solid #e0b963;"],
  ["  box-shadow: 0 4px 18px rgba(24, 28, 23, 0.3);", "  box-shadow: var(--e2);"],

  // scrim uses ink hue
  [
    "    rgba(24, 28, 23, 0.5) 0%,\n    rgba(24, 28, 23, 0.28) 45%,",
    "    rgba(22, 32, 26, 0.52) 0%,\n    rgba(22, 32, 26, 0.3) 45%,",
  ],

  // keylines: dark gold on light surfaces
  ["border: 1px solid rgba(169, 136, 90, 0.55);", "border: 1px solid rgba(150, 107, 34, 0.5);"],
  ["border: 1px solid rgba(169, 136, 90, 0.5);", "border: 1px solid rgba(150, 107, 34, 0.45);"],

  // buttons
  ["  border: 1px solid rgba(220, 185, 106, 0.45);", "  border: 1px solid rgba(224, 185, 99, 0.4);"],
  ["  border-color: rgba(220, 185, 106, 0.85);", "  border-color: rgba(224, 185, 99, 0.8);"],
  [".btn-fill-dark:hover {\n  color: #fafaf7;\n}", ".btn-fill-dark:hover {\n  color: #fbfaf7;\n}"],
  [".btn-fill-dark::before {\n  background: #24382b;\n}", ".btn-fill-dark::before {\n  background: #10331f;\n}"],
  [".btn-fill-light::before {\n  background: #fafaf7;\n}", ".btn-fill-light::before {\n  background: #fbfaf7;\n}"],
  [".btn-fill-light:hover {\n  color: #1d231c;\n}", ".btn-fill-light:hover {\n  color: #16201a;\n}"],

  // form field
  ["  border-bottom: 1px solid rgba(32, 40, 31, 0.3);", "  border-bottom: 1px solid var(--line-strong);"],
  ["  color: #20281f;", "  color: #16201a;"],
  ["  color: rgba(32, 40, 31, 0.38);", "  color: rgba(22, 32, 26, 0.42);"],
  ["  border-bottom-color: #a97e2f;\n  box-shadow: 0 1px 0 0 #a97e2f;", "  border-bottom-color: #966b22;\n  box-shadow: 0 1px 0 0 #966b22;"],

  // invitation card
  [
    "  background: #fbfaf6;\n  border: 1px solid rgba(32, 40, 31, 0.18);\n  box-shadow: 0 24px 60px rgba(32, 40, 31, 0.12);",
    "  background: #ffffff;\n  border: 1px solid var(--line);\n  box-shadow: var(--e3);",
  ],
  ["  border: 1px solid rgba(169, 126, 47, 0.35);", "  border: 1px solid rgba(150, 107, 34, 0.32);"],
];

let hit = 0;
for (const [a, b] of swaps) {
  if (t.includes(a)) {
    t = t.split(a).join(b);
    hit++;
  } else {
    console.log("MISS:", a.slice(0, 55).replace(/\n/g, "\\n"));
  }
}
fs.writeFileSync(p, t);
console.log(`applied ${hit}/${swaps.length}`);
