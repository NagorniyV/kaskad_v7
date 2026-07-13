import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEW = `(function () {
        const host = window.location.hostname;
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        let basePath = "/";

        // Production on custom domain
        if (host === "kaskad.in.ua" || host === "www.kaskad.in.ua") {
          basePath = "/";
        } else {
          // Live Server / GitHub Pages: site may live under /kaskad_v7/
          const repoIdx = pathParts.indexOf("kaskad_v7");
          if (repoIdx !== -1) {
            basePath = "/" + pathParts.slice(0, repoIdx + 1).join("/") + "/";
          } else if (host.endsWith("github.io") && pathParts.length > 0) {
            basePath = "/" + pathParts[0] + "/";
          } else {
            // Vite or Live Server with kaskad_v7 as root
            basePath = "/";
          }
        }

        window.__BASE_PATH__ = basePath;
        const base = document.createElement("base");
        base.href = basePath;
        document.head.prepend(base);
      })();`;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".git") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

const re =
  /\(function \(\) \{[\s\S]*?window\.__BASE_PATH__ = basePath;[\s\S]*?document\.head\.prepend\(base\);\s*\}\)\(\);/;

let ok = 0;
let miss = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("window.__BASE_PATH__")) continue;
  if (!re.test(html)) {
    console.log("NO MATCH", path.relative(root, file));
    miss++;
    continue;
  }
  html = html.replace(re, NEW);
  fs.writeFileSync(file, html);
  ok++;
}

console.log({ ok, miss });
