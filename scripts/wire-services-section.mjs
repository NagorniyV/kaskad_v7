import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function ensureScript(html, scriptSrc) {
  if (html.includes(scriptSrc)) return html;
  const markers = [
    '<script src="./src/js/language.js" defer></script>',
    '<script src="./src/js/include-partials.js" defer></script>',
  ];
  for (const m of markers) {
    if (html.includes(m)) {
      return html.replace(
        m,
        `${m}\n    <script src="${scriptSrc}" defer></script>`
      );
    }
  }
  return html;
}

function replaceOnce(html, re, replacement) {
  if (!re.test(html)) return { html, ok: false };
  re.lastIndex = 0;
  return { html: html.replace(re, replacement), ok: true };
}

// index
{
  const p = path.join(root, "index.html");
  let html = fs.readFileSync(p, "utf8");
  const re = /<section class="services-section">[\s\S]*?<\/section>/;
  const r = replaceOnce(
    html,
    re,
    '<div id="site-services" data-services="full"></div>'
  );
  console.log(r.ok ? "index: ok" : "index: services-section NOT found");
  if (r.ok) fs.writeFileSync(p, r.html);
}

// ceny
{
  const p = path.join(root, "ceny.html");
  let html = fs.readFileSync(p, "utf8");
  const re = /<section class="work-process">[\s\S]*?<\/section>/;
  const r = replaceOnce(
    html,
    re,
    '<div id="site-services" data-services="full"></div>'
  );
  if (!r.ok) console.log("ceny: work-process NOT found");
  else {
    fs.writeFileSync(p, ensureScript(r.html, "./src/js/services-carousel.js"));
    console.log("ceny: ok");
  }
}

// uslugi
{
  const p = path.join(root, "uslugi.html");
  let html = fs.readFileSync(p, "utf8");
  if (html.includes('id="site-services"')) {
    console.log("uslugi: already has site-services");
  } else {
    const marker = '<nav class="nav-service-catalog">';
    if (!html.includes(marker)) console.log("uslugi: nav not found");
    else {
      html = html.replace(
        marker,
        '<div id="site-services" data-services="full"></div>\n                    ' +
          marker
      );
      fs.writeFileSync(p, ensureScript(html, "./src/js/services-carousel.js"));
      console.log("uslugi: ok");
    }
  }
}

for (const file of ["zapchasti.html", "razborka/index.html"]) {
  const p = path.join(root, file);
  let html = fs.readFileSync(p, "utf8");
  const re = /<nav class="parts-related-links"[\s\S]*?<\/nav>/;
  const r = replaceOnce(
    html,
    re,
    '<div id="site-services" data-services="services"></div>'
  );
  if (!r.ok) console.log(file + ": nav NOT found");
  else {
    fs.writeFileSync(p, ensureScript(r.html, "./src/js/services-carousel.js"));
    console.log(file + ": ok");
  }
}

const serviceFiles = [
  "remont-dvigatelya.html",
  "remont-hodovoy.html",
  "remont-elektriki.html",
  "remont-tormoznoi-sistemy.html",
  "remont-transmissii.html",
  "tehnicheskoe-obsluzhivanie.html",
  "diagnostika-avto.html",
  "avtokondicionery.html",
  "ustanovka-gbo.html",
  "sistema-ohlazhdeniya.html",
];

for (const file of serviceFiles) {
  const p = path.join(root, file);
  let html = fs.readFileSync(p, "utf8");
  const re = /<p class="parts-service-note"[\s\S]*?<\/p>/;
  const r = replaceOnce(
    html,
    re,
    '<div id="site-services" data-services="parts"></div>'
  );
  if (!r.ok) console.log(file + ": note NOT found");
  else {
    fs.writeFileSync(p, ensureScript(r.html, "./src/js/services-carousel.js"));
    console.log(file + ": ok");
  }
}
