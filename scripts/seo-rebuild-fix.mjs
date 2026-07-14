import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ru = JSON.parse(fs.readFileSync(path.join(root, "locales/ru.json"), "utf8"));

function replaceMeta(html, title, description) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${description}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`
  );
  return html;
}

function patchList(file, key, text) {
  const fp = path.join(root, file);
  let h = fs.readFileSync(fp, "utf8");
  const re = new RegExp(`(data-translate="${key}"[^>]*>)([\\s\\S]*?)(<)`, "i");
  if (!re.test(h)) {
    console.log("miss", file, key);
    return;
  }
  h = h.replace(re, `$1${text}$3`);
  fs.writeFileSync(fp, h);
  console.log("patched", file, key);
}

// evakuator
{
  let eva = fs.readFileSync(path.join(root, "evakuator.html"), "utf8");
  const title = "Эвакуатор в Павлограде — цены и быстрая подача | Каскад";
  const description =
    "Эвакуатор по Павлограду и району: перевозка легковых авто, внедорожников, микроавтобусов и техники. Быстрая подача, понятные цены и заказ по телефону.";
  eva = replaceMeta(eva, title, description);
  eva = eva.replace(
    /(<h1[^>]*data-translate="hero-title-eva"[^>]*>)([\s\S]*?)(<\/h1>)/i,
    `$1${ru["hero-title-eva"]}$3`
  );
  eva = eva.replace(/,\s*эвакуатор круглосуточно Павлоград/gi, "");
  eva = eva.replace(/эвакуатор круглосуточно Павлоград,?\s*/gi, "");
  eva = eva.replace(/вызов 24\/7,?\s*/gi, "");
  eva = eva.replace(/\s*24\/7/g, "");
  eva = eva.replace(/Вызов круглосуточно\.\s*/gi, "");
  eva = eva.replace(/круглосуточно\.?\s*/gi, "");

  const seo = `        <section class="main-content-section seo-article">
          <div class="main-content-div">
            <div class="main-content">
              <h2 data-translate="seo-evakuator-h2">${ru["seo-evakuator-h2"]}</h2>
              <h3 data-translate="seo-evakuator-h3-1">${ru["seo-evakuator-h3-1"]}</h3>
              <p data-translate="seo-evakuator-p-1-1">${ru["seo-evakuator-p-1-1"]}</p>
              <h3 data-translate="seo-evakuator-h3-2">${ru["seo-evakuator-h3-2"]}</h3>
              <p data-translate="seo-evakuator-p-2-1">${ru["seo-evakuator-p-2-1"]}</p>
              <h3 data-translate="seo-evakuator-h3-3">${ru["seo-evakuator-h3-3"]}</h3>
              <p data-translate="seo-evakuator-p-3-1">${ru["seo-evakuator-p-3-1"]}</p>
              <h3 data-translate="seo-evakuator-h3-4">${ru["seo-evakuator-h3-4"]}</h3>
              <p data-translate="seo-evakuator-p-4-1">${ru["seo-evakuator-p-4-1"]}</p>
              <h3 data-translate="seo-evakuator-h3-5">${ru["seo-evakuator-h3-5"]}</h3>
              <p data-translate="seo-evakuator-p-5-1">${ru["seo-evakuator-p-5-1"]}</p>
              <h3 data-translate="seo-evakuator-h3-6">${ru["seo-evakuator-h3-6"]}</h3>
              <p data-translate="seo-evakuator-p-6-1">${ru["seo-evakuator-p-6-1"]}</p>
            </div>
          </div>
        </section>`;
  eva = eva.replace(
    /<section class="main-content-section seo-article">[\s\S]*?<\/section>/,
    seo
  );
  fs.writeFileSync(path.join(root, "evakuator.html"), eva);
  console.log("evakuator ok", /<!doctype/i.test(eva), eva.match(/<title>([^<]+)/)?.[1]);
}

// ceny
{
  let ceny = fs.readFileSync(path.join(root, "ceny.html"), "utf8");
  ceny = ceny.replace(/<(h2\b[^>]*)>([\s\S]*?)<\/th>/g, "<$1>$2</h2>");
  // dedupe consecutive identical service links
  ceny = ceny.replace(
    /(?:\s*<p class="price-section-link"><a href="[^"]+">Страница услуги<\/a><\/p>)+/g,
    (block) => {
      const m = block.match(
        /<p class="price-section-link"><a href="([^"]+)">Страница услуги<\/a><\/p>/
      );
      return `\n          <p class="price-section-link"><a href="${m[1]}">Страница услуги</a></p>`;
    }
  );
  // ensure section links after h2 ids
  const map = {
    "price-hodovaya": "./remont-hodovoy.html",
    "price-grm": "./remont-dvigatelya.html",
    "price-akkum": "./remont-elektriki.html",
    "price-evacuator": "./evakuator.html",
  };
  for (const [id, href] of Object.entries(map)) {
    const has = new RegExp(
      `<h2 id="${id}"[\\s\\S]{0,120}?price-section-link`
    ).test(ceny);
    if (!has) {
      ceny = ceny.replace(
        new RegExp(`(<h2 id="${id}"[^>]*>[\\s\\S]*?<\\/h2>)`),
        `$1\n          <p class="price-section-link"><a href="${href}">Страница услуги</a></p>`
      );
    }
  }
  // fix evacuator wrong second link leftover
  ceny = ceny.replace(
    /(<h2 id="price-evacuator"[\s\S]*?<\/h2>\s*<p class="price-section-link"><a href="\.\/evakuator\.html">Страница услуги<\/a><\/p>)\s*<p class="price-section-link"><a href="\.\/remont-elektriki\.html">Страница услуги<\/a><\/p>/,
    "$1"
  );
  ceny = ceny.replace(/Чистка форсунок \(інжектора\)/g, "Чистка форсунок (инжектора)");
  ceny = ceny.replace(/Замена сервісних ременів/g, "Замена сервисных ремней");
  fs.writeFileSync(path.join(root, "ceny.html"), ceny);
  console.log("ceny ok");
}

// uslugi UA leftovers
{
  let uslugi = fs.readFileSync(path.join(root, "uslugi.html"), "utf8");
  uslugi = uslugi.replace(/Ходовая частина/g, "Ходовая часть");
  uslugi = uslugi.replace(/Техническое обслуживания/g, "Техническое обслуживание");
  fs.writeFileSync(path.join(root, "uslugi.html"), uslugi);
  console.log("uslugi ok");
}

for (let i = 1; i <= 5; i++) {
  patchList("diagnostika-avto.html", `diagnostics-list${i}`, ru[`diagnostics-list${i}`]);
}
patchList("avtokondicionery.html", "condi-list5", ru["condi-list5"]);
patchList("remont-transmissii.html", "transmissiya-list3", ru["transmissiya-list3"]);

// index schema description cleanup (no parts push in knowsAbout optional)
{
  let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
  index = index.replace(
    /"description": "СТО Каскад в Павлограде с 2005 года: ремонт двигателя и ходовой, диагностика, установка ГБО, ТО и подбор запчастей\."/,
    '"description": "СТО Каскад в Павлограде с 2005 года: диагностика, ремонт двигателя и ходовой, ТО, тормоза, трансмиссия, электрика, кондиционеры и ГБО."'
  );
  fs.writeFileSync(path.join(root, "index.html"), index);
}
