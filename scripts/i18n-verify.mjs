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

const attrs = [
  "data-translate",
  "data-translate-html",
  "data-translate-placeholder",
  "data-translate-aria",
];
const attrRe = new RegExp(`(?:${attrs.join("|")})="([^"]+)"`, "g");

const byPage = {};
const used = new Set([
  "parts-related-title",
  "parts-related-subtitle",
  "parts-cards-title",
  "parts-cards-subtitle",
]);

for (const f of walk(root)) {
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const html = fs.readFileSync(f, "utf8");
  const keys = new Set();
  let m;
  while ((m = attrRe.exec(html))) {
    keys.add(m[1]);
    used.add(m[1]);
  }
  if (!keys.size) continue;

  const missingRu = [...keys].filter((k) => !(k in ru));
  const missingUk = [...keys].filter((k) => !(k in uk));
  const same =
    [...keys].filter((k) => {
      const a = ru[k];
      const b = uk[k];
      if (typeof a !== "string" || typeof b !== "string") return false;
      if (a !== b) return false;
      if (!/[а-яА-ЯёЁ]/.test(a)) return false;
      // intentional identical: short prices etc.
      if (a.length < 12) return false;
      if (/^\+?\d|грн|от \d|від \d/i.test(a)) return false;
      return true;
    }) || [];

  byPage[rel] = {
    keys: keys.size,
    missingRu,
    missingUk,
    sameAsRu: same,
  };
}

const pagesWithIssues = Object.entries(byPage).filter(
  ([, v]) => v.missingRu.length || v.missingUk.length || v.sameAsRu.length
);

console.log(
  JSON.stringify(
    {
      localeRu: Object.keys(ru).length,
      localeUk: Object.keys(uk).length,
      used: used.size,
      pages: Object.keys(byPage).length,
      pagesWithIssues: pagesWithIssues.length,
      issueSummary: Object.fromEntries(
        pagesWithIssues.map(([p, v]) => [
          p,
          {
            missingRu: v.missingRu.length,
            missingUk: v.missingUk.length,
            sameAsRu: v.sameAsRu.length,
            sameSample: v.sameAsRu.slice(0, 8),
          },
        ])
      ),
    },
    null,
    2
  )
);

fs.writeFileSync(
  path.join(root, "scripts/_i18n-verify.json"),
  JSON.stringify({ byPage, pagesWithIssues: Object.fromEntries(pagesWithIssues) }, null, 2)
);
