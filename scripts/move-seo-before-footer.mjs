import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- seo-article:start -->";
const END = "<!-- seo-article:end -->";
const FOOTER = '<div id="site-footer"></div>';

const files = [
  "ustanovka-gbo.html",
  "zapchasti.html",
  "uslugi.html",
  "tehnicheskoe-obsluzhivanie.html",
  "sistema-ohlazhdeniya.html",
  "remont-transmissii.html",
  "remont-tormoznoi-sistemy.html",
  "remont-hodovoy.html",
  "remont-elektriki.html",
  "remont-dvigatelya.html",
  "razborka/index.html",
  "evakuator.html",
  "diagnostika-avto.html",
  "avtokondicionery.html",
];

let ok = 0;
for (const rel of files) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, "utf8");
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    console.error("SEO block missing:", rel);
    continue;
  }
  const block = html.slice(start, end + END.length).trim();
  html = html.slice(0, start) + html.slice(end + END.length);
  // clean leftover blank lines at cut point
  html = html.replace(/\n{3,}/g, "\n\n");

  const footerIdx = html.indexOf(FOOTER);
  if (footerIdx === -1) {
    console.error("Footer missing:", rel);
    continue;
  }
  html =
    html.slice(0, footerIdx) +
    "        " +
    block +
    "\n        " +
    html.slice(footerIdx);
  fs.writeFileSync(file, html, "utf8");
  ok++;
  console.log("moved", rel);
}
console.log("OK", ok);
