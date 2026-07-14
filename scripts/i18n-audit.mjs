import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ru = JSON.parse(fs.readFileSync(path.join(root, "locales/ru.json"), "utf8"));
const uk = JSON.parse(fs.readFileSync(path.join(root, "locales/uk.json"), "utf8"));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      ["node_modules", "dist", "_edge_profile", "_diag_out", ".git"].includes(
        e.name
      )
    )
      continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|inc)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(root);
const used = new Set();
const attrs = [
  "data-translate",
  "data-translate-html",
  "data-translate-placeholder",
  "data-translate-aria",
];
const attrRe = new RegExp(`(?:${attrs.join("|")})="([^"]+)"`, "g");

for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  let m;
  while ((m = attrRe.exec(html))) used.add(m[1]);
}

const ruKeys = new Set(Object.keys(ru));
const ukKeys = new Set(Object.keys(uk));

const missingRu = [...used].filter((k) => !ruKeys.has(k)).sort();
const missingUk = [...used].filter((k) => !ukKeys.has(k)).sort();
const unusedRu = [...ruKeys].filter((k) => !used.has(k)).sort();
const unusedUk = [...ukKeys].filter((k) => !used.has(k)).sort();
const onlyRu = [...ruKeys].filter((k) => !ukKeys.has(k)).sort();
const onlyUk = [...ukKeys].filter((k) => !ruKeys.has(k)).sort();

const ukLooksRu = Object.entries(uk)
  .filter(([k, v]) => {
    if (typeof v !== "string" || !used.has(k)) return false;
    if (!/[а-яА-ЯёЁ]/.test(v)) return false;
    if (/[іїєґІЇЄҐ]/.test(v)) return false;
    return v === ru[k] || /(?:\bдля\b|\bили\b|\bчто\b|\bэто\b|\bкак\b|\bпри\b|\bбез\b|\bвсех\b|ремонт |услуги |запчаст)/i.test(v);
  })
  .map(([k]) => k);

const report = {
  files: files.length,
  used: used.size,
  ru: ruKeys.size,
  uk: ukKeys.size,
  missingRu,
  missingUk,
  unusedRu,
  unusedUk,
  onlyRu,
  onlyUk,
  ukLooksRu,
  usedKeys: [...used].sort(),
};

fs.writeFileSync(
  path.join(root, "scripts/_i18n-audit.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

console.log(
  JSON.stringify(
    {
      files: report.files,
      used: report.used,
      ru: report.ru,
      uk: report.uk,
      missingRu: missingRu.length,
      missingUk: missingUk.length,
      unusedRu: unusedRu.length,
      unusedUk: unusedUk.length,
      onlyRu: onlyRu.length,
      onlyUk: onlyUk.length,
      ukLooksRu: ukLooksRu.length,
    },
    null,
    2
  )
);
console.log("missingRu sample:", missingRu.slice(0, 40));
console.log("ukLooksRu sample:", ukLooksRu.slice(0, 40));
console.log("unusedRu sample:", unusedRu.slice(0, 40));
