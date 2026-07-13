import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = [], exts = [".html", ".inc"]) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".git") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out, exts);
    else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

const NEW_BASE_SCRIPT = `(function () {
        const host = window.location.hostname;
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        let basePath = "/";

        if (host === "kaskad.in.ua" || host === "www.kaskad.in.ua") {
          basePath = "/";
        } else {
          const repoIdx = pathParts.indexOf("kaskad_v7");
          if (repoIdx !== -1) {
            basePath = "/" + pathParts.slice(0, repoIdx + 1).join("/") + "/";
          } else if (host.endsWith("github.io") && pathParts.length > 0) {
            basePath = "/" + pathParts[0] + "/";
          } else {
            basePath = "/";
          }
        }

        window.__BASE_PATH__ = basePath;
      })();`;

const baseRe =
  /\(function \(\) \{[\s\S]*?window\.__BASE_PATH__ = basePath;[\s\S]*?\}\)\(\);/;

function rewritePaths(content) {
  let html = content;

  html = html.replace(
    /\n?\s*<script>\s*\(function \(\) \{\s*var bp = window\.__BASE_PATH__[\s\S]*?\}\)\(\);\s*<\/script>/g,
    ""
  );

  // ./asset → /asset
  html = html.replace(/(href|src|srcset)=(["'])\.\/([^"']+)\2/g, "$1=$2/$3$2");

  // Bare site-root paths that previously relied on <base href="/">
  html = html.replace(
    /(href|src|srcset)=(["'])(razborka\/[^"']+)\2/g,
    "$1=$2/$3$2"
  );
  html = html.replace(/(href|src|srcset)=(["'])(src\/[^"']+)\2/g, "$1=$2/$3$2");
  html = html.replace(/(href|src)=(["'])(favicon\.png)\2/g, "$1=$2/$3$2");
  html = html.replace(/(href|src|srcset)=(["'])(images\/[^"']+)\2/g, "$1=$2/$3$2");
  html = html.replace(/(href|src)=(["'])(locales\/[^"']+)\2/g, "$1=$2/$3$2");

  // Avoid double slashes: //src → /src
  html = html.replace(/(href|src|srcset)=(["'])\/\//g, "$1=$2/");

  return html;
}

let htmlCount = 0;
for (const file of walk(root, [], [".html"])) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  if (html.includes("window.__BASE_PATH__") && baseRe.test(html)) {
    html = html.replace(baseRe, NEW_BASE_SCRIPT);
  }

  html = rewritePaths(html);

  if (html !== before) {
    fs.writeFileSync(file, html);
    htmlCount++;
  }
}

let incCount = 0;
const includesDir = path.join(root, "src", "includes");
for (const file of walk(includesDir, [], [".inc"])) {
  const html = fs.readFileSync(file, "utf8");
  const next = rewritePaths(html);
  if (next !== html) {
    fs.writeFileSync(file, next);
    incCount++;
  }
}

console.log({ htmlCount, incCount });

// Spot-check a few files
for (const rel of [
  "index.html",
  "razborka/fiat.html",
  "razborka/fiat/panda-169/dvigatel.html",
  "src/includes/header.inc",
  "src/includes/brend.inc",
]) {
  const t = fs.readFileSync(path.join(root, rel), "utf8");
  console.log("\n===", rel, "===");
  console.log("has base element:", /createElement\(["']base["']\)/.test(t));
  console.log(
    "sample hrefs:",
    [...t.matchAll(/href=["'][^"']+["']/g)].slice(0, 6).map((m) => m[0])
  );
  if (rel.includes("dvigatel") || rel === "index.html") {
    console.log(
      "css:",
      [...t.matchAll(/href=["'][^"']*css[^"']*["']/g)].slice(0, 3).map((m) => m[0])
    );
  }
}
