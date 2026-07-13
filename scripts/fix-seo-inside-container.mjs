import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- seo-article:start -->";
const END = "<!-- seo-article:end -->";

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

const insertBeforeRe =
  /(\r?\n)( {6}<\/div>\r?\n {10}<div id="site-callback-widgets"><\/div>)/;

let ok = 0;
for (const rel of files) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, "utf8");
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    console.error("SEO missing:", rel);
    continue;
  }

  const block = html.slice(start, end + END.length).trim();
  html = html.slice(0, start) + html.slice(end + END.length);
  html = html.replace(/\n{3,}/g, "\n\n");

  if (!insertBeforeRe.test(html)) {
    console.error("Insert point missing:", rel);
    continue;
  }

  html = html.replace(
    insertBeforeRe,
    `$1        ${block}$1$2`
  );

  fs.writeFileSync(file, html, "utf8");
  ok++;
  console.log("fixed", rel);
}

console.log("OK", ok);
