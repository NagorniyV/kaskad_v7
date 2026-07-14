import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ru = JSON.parse(fs.readFileSync(path.join(root, "locales/ru.json"), "utf8"));
const uk = JSON.parse(fs.readFileSync(path.join(root, "locales/uk.json"), "utf8"));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", "scripts"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|inc)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const used = new Set([
  "parts-related-title",
  "parts-related-subtitle",
  "parts-cards-title",
  "parts-cards-subtitle",
]);
const re =
  /(?:data-translate(?:-html|-placeholder|-aria)?)="([^"]+)"/g;
for (const f of walk(root)) {
  const t = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(t))) used.add(m[1]);
}

const suspects = [];
for (const k of used) {
  const a = ru[k];
  const b = uk[k];
  if (typeof a !== "string" || typeof b !== "string") {
    suspects.push([k, "MISSING", a, b]);
    continue;
  }
  if (
    a === b &&
    /[а-яА-ЯёЁ]/.test(a) &&
    a.length > 18 &&
    !/[іїєґІЇЄҐ]/.test(a) &&
    !/грн|VIN|Check Engine|АС КАСКАД|Павел|Дмитренко|Антон|Филипов|старший менеджер/.test(
      a
    )
  ) {
    suspects.push([k, "SAME_RU", a.slice(0, 80)]);
  }
}

console.log({ used: used.size, suspects: suspects.length });
console.log(suspects.slice(0, 40));
console.log("nav-home", ru["nav-home"], "/", uk["nav-home"]);
console.log("seo-zapchasti-h2", uk["seo-zapchasti-h2"]?.slice(0, 90));
