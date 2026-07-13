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

const BASE_SCRIPT = `(function () {
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
        const base = document.createElement("base");
        base.href = basePath;
        document.head.prepend(base);
      })();`;

const baseRe =
  /\(function \(\) \{[\s\S]*?window\.__BASE_PATH__ = basePath;[\s\S]*?\}\)\(\);/;

function restorePaths(content) {
  let html = content;

  // /src/... → ./src/...
  html = html.replace(/(href|src|srcset)=(["'])\/src\//g, "$1=$2./src/");
  // /favicon → ./favicon
  html = html.replace(/(href|src)=(["'])\/favicon/g, "$1=$2./favicon");
  // /locales → ./locales
  html = html.replace(/(href|src)=(["'])\/locales\//g, "$1=$2./locales/");
  // /images → images/ (or ./images) — previously bare images/ or ./images
  html = html.replace(/(href|src|srcset)=(["'])\/images\//g, "$1=$2./images/");

  // Site pages in includes/nav: /index.html → ./index.html etc.
  // Don't touch https:// canonicals
  html = html.replace(
    /(href)=(["'])\/((?:index|zapchasti|ceny|uslugi|avtokondicionery|remont-[a-z0-9-]+|tehnicheskoe-obsluzhivanie|diagnostika-avto|ustanovka-gbo|sistema-ohlazhdeniya|evakuator)\.html)\2/gi,
    "$1=$2./$3$2"
  );
  html = html.replace(/(href)=(["'])\/(razborka\/)/gi, "$1=$2./$3");

  // /razborka/... in body links/images that were bare razborka/ (relied on base)
  // Keep as razborka/... without leading slash so <base> resolves them
  html = html.replace(/(href|src|srcset)=(["'])\/razborka\//g, "$1=$2razborka/");

  return html;
}

let htmlCount = 0;
for (const file of walk(root, [], [".html"])) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  if (html.includes("window.__BASE_PATH__")) {
    if (baseRe.test(html)) {
      html = html.replace(baseRe, BASE_SCRIPT);
    }
  }

  html = restorePaths(html);

  if (html !== before) {
    fs.writeFileSync(file, html);
    htmlCount++;
  }
}

let incCount = 0;
for (const file of walk(path.join(root, "src", "includes"), [], [".inc"])) {
  const html = fs.readFileSync(file, "utf8");
  let next = restorePaths(html);
  // brend used bare src/img before root rewrite; restore to src/ without ./
  // restorePaths made ./src/ from /src/ — for brend original was src/ without ./
  // Both work with base. Keep ./src/ for consistency with header assets in callbacks.
  if (next !== html) {
    fs.writeFileSync(file, next);
    incCount++;
  }
}

console.log({ htmlCount, incCount });

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
    "css/js:",
    [...t.matchAll(/(?:href|src)=["'][^"']*(?:css|js\/)[^"']*["']/g)]
      .slice(0, 4)
      .map((m) => m[0])
  );
}
