/**
 * Ensure #site-header and #site-footer are inside <body>.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

let fixed = 0;
const report = [];

for (const file of walk(root)) {
  let html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const before = html;

  const hasHeader = html.includes('id="site-header"');
  const hasFooter = html.includes('id="site-footer"');

  // Strip all placeholders first
  html = html.replace(/\s*<div id="site-header"><\/div>\s*/g, "\n");
  html = html.replace(/\s*<div id="site-footer"><\/div>\s*/g, "\n");

  if (!html.includes("<body") || !html.includes("</body>")) {
    report.push(`NO BODY: ${rel}`);
    continue;
  }

  // Insert header right after <body...>
  if (hasHeader) {
    html = html.replace(
      /<body([^>]*)>/i,
      '<body$1>\n  <div id="site-header"></div>'
    );
  }

  // Insert footer right before </body>
  if (hasFooter) {
    html = html.replace(
      /\s*<\/body>/i,
      '\n  <div id="site-footer"></div>\n</body>'
    );
  }

  html = html.replace(/\n{3,}/g, "\n\n");

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    fixed++;
  }

  // verify
  const h = html;
  const bodyOpen = h.search(/<body\b/i);
  const bodyClose = h.lastIndexOf("</body>");
  const hi = h.indexOf('id="site-header"');
  const fi = h.indexOf('id="site-footer"');
  if (hasHeader && (hi < bodyOpen || hi > bodyClose)) report.push(`HEADER OUT: ${rel}`);
  if (hasFooter && (fi < bodyOpen || fi > bodyClose)) report.push(`FOOTER OUT: ${rel}`);
}

console.log({ fixed, issues: report.length });
report.slice(0, 40).forEach((r) => console.log(r));
