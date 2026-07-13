import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (["node_modules", "dist", ".git", "src"].includes(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

// also include nested under razborka
function walkAll(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (["node_modules", "dist", ".git"].includes(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkAll(p, out);
    else if (name.endsWith(".html") && !p.includes(`${path.sep}src${path.sep}`)) {
      out.push(p);
    }
  }
  return out;
}

let fixed = 0;
let skipped = 0;

for (const file of walkAll(root)) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes('id="site-footer"')) {
    skipped++;
    continue;
  }

  // remove all footer placeholders
  html = html.replace(/\s*<div id="site-footer"><\/div>\s*/g, "\n");

  if (!html.includes("</body>")) {
    console.error("no body:", path.relative(root, file));
    continue;
  }

  // place footer inside body, after main content
  html = html.replace(
    /\s*<\/body>/i,
    '\n  <div id="site-footer"></div>\n</body>'
  );

  // also move header inside body if it sits between head and body
  if (/<\/head>\s*<div id="site-header"><\/div>\s*<body/i.test(html)) {
    html = html.replace(
      /<\/head>\s*<div id="site-header"><\/div>\s*<body([^>]*)>/i,
      "</head>\n<body$1>\n  <div id=\"site-header\"></div>"
    );
  }

  fs.writeFileSync(file, html, "utf8");
  fixed++;
}

console.log({ fixed, skipped });
