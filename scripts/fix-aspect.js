const fs = require("fs");
const p = "lib/site.ts";
let t = fs.readFileSync(p, "utf8");

const fix = {
  "fence-portraits": [3, 2],
  "tent-sailcloth": [2, 3],
  "barn-summer-lane": [2, 3],
  "lily-crown": [2, 3],
};

t = t
  .split("\n")
  .map((line) => {
    for (const [name, [w, h]] of Object.entries(fix)) {
      if (line.includes(`/images/${name}.jpg`)) {
        return line.replace(/w: \d+, h: \d+/, `w: ${w}, h: ${h}`);
      }
    }
    return line;
  })
  .join("\n");

fs.writeFileSync(p, t);
for (const name of Object.keys(fix)) {
  const line = t.split("\n").find((l) => l.includes(`/images/${name}.jpg`));
  console.log(name, line ? line.match(/w: \d+, h: \d+/)[0] : "not in gallery");
}
