import fs from "fs";
import path from "path";

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

const root = process.cwd();
const skip = new Set([
  "parts.html",
  "price.html",
  "service-catalog.html",
  "technical-service.html",
  "car-diagnostics.html",
  "air-conditioning.html",
  "foto-gallery.html",
  "toplivnaya-sistema.html",
]);
const files = walk(root).filter((f) => !skip.has(path.basename(f)));

const missingCb = [];
const needMove = [];

for (const f of files) {
  const h = fs.readFileSync(f, "utf8");
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const cb = h.includes('id="site-callback"');
  const seo = h.includes("seo-article:start");
  const lead = (h.match(/data-lead-type="([^"]+)"/) || [])[1] || "";
  const isCeny = rel === "ceny.html" || rel.endsWith("/ceny.html");

  if (isCeny) {
    console.log(`SKIP ceny: cb=${cb ? 1 : 0}`);
    continue;
  }

  if (!cb) missingCb.push(rel);

  if (cb && seo) {
    const cbIdx = h.indexOf('id="site-callback"');
    const seoIdx = h.indexOf("seo-article:start");
    if (cbIdx > seoIdx) needMove.push(rel);
  }

  if (!cb || (cb && seo && h.indexOf('id="site-callback"') > h.indexOf("seo-article:start"))) {
    console.log(`${rel} | cb=${cb ? 1 : 0} | seo=${seo ? 1 : 0} | lead=${lead}`);
  }
}

console.log("\nmissingCb", missingCb.length, missingCb.slice(0, 30));
console.log("needMove", needMove.length, needMove);
