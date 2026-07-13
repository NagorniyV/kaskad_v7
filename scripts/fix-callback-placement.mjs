/**
 * Place #site-callback before SEO on all pages except ceny.
 * Usage: node scripts/fix-callback-placement.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLACEHOLDER = '<div id="site-callback"></div>';
const START = "<!-- seo-article:start -->";

const SKIP_NAMES = new Set([
  "ceny.html",
  "parts.html",
  "price.html",
  "service-catalog.html",
  "technical-service.html",
  "car-diagnostics.html",
  "air-conditioning.html",
  "foto-gallery.html",
  "toplivnaya-sistema.html",
]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (["node_modules", "dist", ".git", "src", "scripts", "locales"].includes(name))
      continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".html") && !name.startsWith("google")) out.push(p);
  }
  return out;
}

let updated = 0;
let skipped = 0;

for (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const base = path.basename(file);
  if (SKIP_NAMES.has(base)) {
    skipped++;
    continue;
  }

  let html = fs.readFileSync(file, "utf8");
  const before = html;

  // remove all existing placeholders
  html = html.replace(/\s*<div id="site-callback"><\/div>\s*/g, "\n");

  if (html.includes(START)) {
    html = html.replace(
      START,
      `        ${PLACEHOLDER}\n        ${START}`
    );
  } else if (html.includes('id="site-callback-widgets"')) {
    html = html.replace(
      /(\s*)<div id="site-callback-widgets"><\/div>/,
      `\n        ${PLACEHOLDER}\n$1<div id="site-callback-widgets"></div>`
    );
  } else if (html.includes("</main>")) {
    html = html.replace(
      "</main>",
      `        ${PLACEHOLDER}\n    </main>`
    );
  } else {
    console.warn("no insert point:", rel);
    continue;
  }

  // collapse excess blank lines around placeholder
  html = html.replace(/\n{3,}/g, "\n\n");

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    updated++;
    console.log("updated", rel);
  }
}

console.log({ updated, skipped });
