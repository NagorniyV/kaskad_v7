import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ru = JSON.parse(fs.readFileSync(path.join(root, "locales/ru.json"), "utf8"));
const uk = JSON.parse(fs.readFileSync(path.join(root, "locales/uk.json"), "utf8"));
const audit = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/_i18n-audit.json"), "utf8")
);

function walk(dir, exts, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", "scripts"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out);
    else if (exts.test(e.name)) out.push(p);
  }
  return out;
}

const used = new Set(audit.usedKeys || []);

// keys referenced from JS
const jsFiles = walk(path.join(root, "src/js"), /\.js$/i);
const jsKeyRe =
  /(?:data-translate(?:-html|-placeholder|-aria)?["'\s:=]+|titleKey|subtitleKey|translations\[|["'])([a-zA-Z0-9_-]{3,80})["']/g;
for (const f of jsFiles) {
  const txt = fs.readFileSync(f, "utf8");
  // explicit from include-partials variant copy
  for (const m of txt.matchAll(
    /(?:titleKey|subtitleKey):\s*["']([a-zA-Z0-9_-]+)["']/g
  )) {
    used.add(m[1]);
  }
}

const keepFromJs = [
  "parts-related-title",
  "parts-related-subtitle",
  "parts-cards-title",
  "parts-cards-subtitle",
  "services-title",
  "services-subtitle",
];
keepFromJs.forEach((k) => used.add(k));

const unused = Object.keys(ru).filter((k) => !used.has(k));
const ukSameAsRu = Object.keys(ru).filter(
  (k) => used.has(k) && typeof uk[k] === "string" && uk[k] === ru[k] && /[а-яА-ЯёЁіІїЇєЄґҐ]/.test(ru[k])
);

// Skip likely intentionally identical (names, brands, prices with грн, phones)
function shouldTranslate(key, val) {
  if (!val || typeof val !== "string") return false;
  if (/^\+?\d/.test(val)) return false;
  if (/^от\s+\d|^від\s+\d|\d+\s*грн/i.test(val) && val.length < 40) return false;
  if (/^(daewoo|daihatsu|acura|alfa|audi|bmw|ВАЗ|Ланос)/i.test(val)) return false;
  // person names
  if (/^(Филипов|Дмитренко|Павел|Антон)/.test(val) && val.length < 40) return false;
  // short tech codes
  if (val.length < 3) return false;
  return /[а-яА-ЯёЁ]/.test(val);
}

const needUk = ukSameAsRu.filter((k) => shouldTranslate(k, ru[k]));

fs.writeFileSync(
  path.join(root, "scripts/_i18n-plan.json"),
  JSON.stringify(
    {
      usedCount: used.size,
      unusedCount: unused.length,
      unused,
      ukSameAsRuCount: ukSameAsRu.length,
      needUkCount: needUk.length,
      needUk,
      missingRu: audit.missingRu,
      missingUk: audit.missingUk,
    },
    null,
    2
  )
);

console.log({
  used: used.size,
  unused: unused.length,
  ukSameAsRu: ukSameAsRu.length,
  needUk: needUk.length,
  missing: audit.missingRu,
});
console.log("needUk prefixes:", [...new Set(needUk.map((k) => k.split("-").slice(0, 2).join("-")))].slice(0, 40));
