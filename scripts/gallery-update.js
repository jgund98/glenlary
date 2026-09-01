const fs = require("fs");
const p = "lib/site.ts";
let t = fs.readFileSync(p, "utf8");

t = t.replace(/ {2}\{ src: "\/images\/horse-feeding\.jpg"[^\n]*\n/, "");
t = t.replace(/ {2}\{ src: "\/images\/drive-autumn-couple\.jpg"[^\n]*\n/, "");

const grounds = [
  `  { src: "/images/gates-allee.jpg", alt: "The white gates and the long allee to the manor", cat: "grounds", w: 3, h: 2 },`,
  `  { src: "/images/barn-summer-lane.jpg", alt: "The drive curving past the black barn", cat: "grounds", w: 3, h: 2 },`,
  `  { src: "/images/fence-portraits.jpg", alt: "Portraits along the four-board fence", cat: "grounds", w: 2, h: 3 },`,
  `  { src: "/images/ceremony-vista.jpg", alt: "Vows above the long view of the farm", cat: "ceremony", w: 3, h: 2 },`,
  `  { src: "/images/manor-processional.jpg", alt: "The processional before the manor", cat: "ceremony", w: 3, h: 2 },`,
  `  { src: "/images/manor-balcony.jpg", alt: "Newlyweds on the manor's upper gallery", cat: "manor", w: 3, h: 2 },`,
  `  { src: "/images/porch-kiss.jpg", alt: "A kiss beside the porch", cat: "manor", w: 3, h: 2 },`,
  `  { src: "/images/groom-manor-door.jpg", alt: "The groom waiting at the manor door", cat: "manor", w: 3, h: 2 },`,
  `  { src: "/images/bridesmaids-navy.jpg", alt: "Bridesmaids in navy at the green shutters", cat: "manor", w: 3, h: 2 },`,
  `  { src: "/images/tent-sailcloth.jpg", alt: "The sailcloth tent set for dinner", cat: "tent", w: 3, h: 2 },`,
  `  { src: "/images/pool-entrance.jpg", alt: "A grand entrance beside the pool", cat: "tent", w: 3, h: 2 },`,
  `  { src: "/images/first-dance.jpg", alt: "The first dance under the tent", cat: "tent", w: 3, h: 2 },`,
].join("\n");
t = t.replace("  // Details", grounds + "\n  // Details");

const details = [
  `  { src: "/images/lily-crown.jpg", alt: "A lily-of-the-valley flower crown", cat: "details", w: 3, h: 2 },`,
  `  { src: "/images/ring-pillow.jpg", alt: "A monogrammed ring pillow", cat: "details", w: 3, h: 2 },`,
].join("\n");
t = t.replace(`  { src: "/images/rings-horse.jpg"`, details + `\n  { src: "/images/rings-horse.jpg"`);

fs.writeFileSync(p, t);
console.log(
  "clean:",
  !t.includes("horse-feeding") && !t.includes("drive-autumn-couple"),
  "| added:",
  t.includes("gates-allee") && t.includes("ring-pillow")
);
