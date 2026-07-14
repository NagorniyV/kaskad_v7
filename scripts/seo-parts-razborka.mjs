/**
 * SEO rebuild: zapchasti + razborka + locale keys + crosslinks helpers
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const LOCALE = {
  "hero-title-parts": "Подбор и заказ новых автозапчастей в Павлограде",
  "hero-title-razborka": "Подбор б/у автозапчастей с разборки в Павлограде",

  "our-benefits-item11": "Проверка совместимости",
  "our-benefits-item12":
    " — сверяем VIN, каталожный номер и характеристики автомобиля.",
  "our-benefits-item31": "Согласование перед заказом",
  "our-benefits-item32":
    " — производитель, стоимость и ориентировочный срок поставки обсуждаем заранее.",
  "our-benefits-item51": "Подбор и установка",
  "our-benefits-item52":
    " — после получения проверяем соответствие детали и при необходимости устанавливаем на СТО.",
  "our-benefits-txt2":
    "*Срок и условия гарантии зависят от производителя и категории запчасти. Уточняйте у менеджера.",

  "parts-field-brand": "Марка автомобиля",
  "parts-field-model": "Модель",
  "parts-field-year": "Год выпуска",
  "parts-field-engine": "Объём и тип двигателя",
  "parts-field-transmission": "Тип коробки передач",
  "parts-field-drive": "Тип привода",
  "parts-field-part": "Название необходимой детали",
  "parts-field-photo": "Фото старой детали или маркировки",
  "parts-field-phone": "Номер телефона",
  "parts-related-title": "Связанные услуги СТО",
  "parts-service-note":
    "После диагностики автосервис может помочь подобрать необходимые <a href=\"./zapchasti.html\">новые</a> или <a href=\"./razborka/\">б/у</a> запчасти, проверить их совместимость и установить в рамках ремонта.",

  // ZAPCHASTI SEO
  "seo-zapchasti-h2": "Новые автозапчасти в Павлограде — подбор по VIN и установка на СТО",
  "seo-zapchasti-h3-1": "Подбор новых запчастей по VIN",
  "seo-zapchasti-p-1-1":
    "Автосервис «Каскад» в Павлограде помогает подобрать и заказать новые автозапчасти под конкретный автомобиль. Основной ориентир — VIN-код: по нему уточняем комплектацию и снижаем риск ошибки при заказе. Если VIN недоступен, работаем по марке, модели, году и параметрам двигателя.",
  "seo-zapchasti-p-1-2":
    "Проверяем совместимость по VIN, каталожному номеру и техническим характеристикам автомобиля. Перед заказом согласовываем производителя, стоимость и ориентировочный срок поставки.",
  "seo-zapchasti-h3-2": "Оригинальные запчасти и качественные аналоги",
  "seo-zapchasti-p-2-1":
    "В зависимости от задачи и бюджета предлагаем оригинал или проверенный аналог. Для ответственных узлов чаще рекомендуем более надёжные варианты, для ряда расходников допустимы качественные аналоги. Выбор производителя всегда согласуем с вами.",
  "seo-zapchasti-p-2-2":
    "Срок и условия гарантии зависят от производителя и категории запчасти. Мы не обещаем «гарантию на всё сразу» — условия уточняются по конкретной позиции.",
  "seo-zapchasti-h3-3": "Запчасти для ремонта основных систем автомобиля",
  "seo-zapchasti-p-3-1":
    "Подбираем детали двигателя и навесного оборудования, элементы ходовой и подвески, тормозные колодки, диски и суппорты, детали трансмиссии и сцепления, стартеры, генераторы и элементы автоэлектрики, радиаторы, термостаты, помпы и патрубки, фильтры, масла, свечи и другие расходники, а также детали систем кондиционирования. Комплектующие ГБО подбираем, если требуется установка или обслуживание газа на станции.",
  "seo-zapchasti-h3-4": "Как заказать нужную автозапчасть",
  "seo-zapchasti-p-4-1":
    "Оставьте заявку на странице или позвоните: укажите марку, модель, год, объём и тип двигателя, VIN и название детали. Менеджер уточнит параметры и предложит варианты.",
  "seo-zapchasti-h3-5": "Подбор деталей после диагностики автомобиля",
  "seo-zapchasti-p-5-1":
    "Если вы не уверены, что менять, начните с диагностики на СТО. После проверки определим необходимую деталь, согласуем смету и только затем закажем позицию.",
  "seo-zapchasti-h3-6": "Доставка запчастей под ремонт",
  "seo-zapchasti-p-6-1":
    "Срок поставки зависит от наличия у поставщика, редкости позиции и логистики. Ориентировочные сроки сообщаем до подтверждения заказа.",
  "seo-zapchasti-h3-7": "Установка заказанных деталей на СТО",
  "seo-zapchasti-p-7-1":
    "После получения проверяем соответствие заказанной позиции и при необходимости устанавливаем её на СТО в рамках ремонта. Это удобно, если деталь нужна сразу к работам по двигателю, ходовой, тормозам или другим системам.",
  "seo-zapchasti-h3-8": "От чего зависят цена и сроки поставки",
  "seo-zapchasti-p-8-1":
    "На стоимость влияют производитель, тип детали, марка автомобиля и текущие условия поставки. Точную цену и срок называем после подбора конкретной позиции.",
  "seo-zapchasti-h3-9": "Почему удобно заказывать запчасти через автосервис",
  "seo-zapchasti-p-9-1":
    "СТО проводит диагностику, определяет необходимую деталь, подбирает её по VIN и характеристикам автомобиля, согласовывает производителя и стоимость, заказывает и устанавливает на станции. Вам не нужно отдельно искать магазин автозапчастей и потом искать, где поставить деталь.",
  "seo-zapchasti-p-9-2-html":
    'Связанные услуги: <a href="./remont-dvigatelya.html">ремонт двигателя</a>, <a href="./remont-hodovoy.html">ходовой</a>, <a href="./remont-tormoznoi-sistemy.html">тормозов</a>, <a href="./remont-transmissii.html">КПП и сцепления</a>, <a href="./remont-elektriki.html">автоэлектрик</a>, <a href="./tehnicheskoe-obsluzhivanie.html">ТО</a>, <a href="./sistema-ohlazhdeniya.html">система охлаждения</a>, <a href="./avtokondicionery.html">автокондиционеры</a>. Для б/у вариантов смотрите <a href="./razborka/">разборку</a>.',

  // RAZBORKA SEO
  "seo-razborka-h2": "Б/у автозапчасти с разборки в Павлограде",
  "seo-razborka-h3-1": "Подбор б/у запчастей с авторазборки",
  "seo-razborka-p-1-1":
    "На этой странице — услуга поиска и подбора б/у автозапчастей с разборки для ремонта в Павлограде. Это не каталог доноров и не витрина с постоянным наличием: помогаем проверить наличие и подобрать подходящий вариант через собственные и партнёрские источники. Возможность заказа, состояние, комплектность и срок поставки уточняются отдельно.",
  "seo-razborka-h3-2": "Какие детали можно подобрать",
  "seo-razborka-p-2-1":
    "По запросу помогаем искать двигатели и навесное оборудование, механические и автоматические коробки, раздаточные коробки, редукторы, приводы и карданы, генераторы и стартеры, рулевые рейки, элементы подвески, кузовные детали, двери, капоты и крышки багажника, фары, фонари и зеркала, блоки управления и элементы электрики, детали салона, радиаторы и элементы системы охлаждения. Наличие конкретной позиции не гарантируется заранее.",
  "seo-razborka-h3-3": "Проверка совместимости по VIN",
  "seo-razborka-p-3-1":
    "Перед заказом проверяем соответствие детали по VIN, каталожному номеру, маркировке и техническим параметрам автомобиля. Это снижает риск покупки внешне похожей, но несовместимой позиции.",
  "seo-razborka-h3-4": "Проверка состояния и комплектности",
  "seo-razborka-p-4-1":
    "Состояние, комплектность и известные дефекты конкретной детали сообщаются клиенту до заказа. Условия проверки, возврата или гарантии зависят от конкретной запчасти и поставщика и согласовываются до покупки.",
  "seo-razborka-h3-5": "Б/у запчасти для редких и снятых с производства автомобилей",
  "seo-razborka-p-5-1":
    "Подбор с разборки может быть рациональным, когда новая оригинальная деталь стоит слишком дорого, деталь снята с производства, подходящий новый аналог отсутствует, нужна оригинальная кузовная или салонная деталь, либо состояние конкретного б/у варианта можно предварительно оценить. Это не универсально «лучший» и не всегда самый дешёвый путь — решение принимаем по ситуации.",
  "seo-razborka-h3-6": "Как отправить запрос на подбор",
  "seo-razborka-p-6-1":
    "Укажите марку, модель, год, объём и тип двигателя, тип КПП и привода, VIN, название детали и при возможности фото старой детали или маркировки. Специалист уточнит запрос и сообщит, какие варианты удалось найти.",
  "seo-razborka-h3-7": "От чего зависят цена и срок поиска",
  "seo-razborka-p-7-1":
    "Цена и срок зависят от редкости детали, состояния найденного варианта, региона поставщика и логистики. Озвучиваем условия до подтверждения заказа.",
  "seo-razborka-h3-8": "Установка б/у детали на СТО",
  "seo-razborka-p-8-1":
    "После согласования стоимости деталь заказывается и при необходимости устанавливается на СТО. Для ответственных агрегатов окончательное решение принимается после оценки доступного варианта и условий его установки.",
  "seo-razborka-h3-9": "Когда б/у запчасть может быть рациональным решением",
  "seo-razborka-p-9-1":
    "Клиент сообщает VIN и данные автомобиля. Специалист уточняет необходимую деталь, проверяет доступные варианты, совместимость, состояние и комплектность. После согласования стоимости деталь заказывается и при необходимости устанавливается на станции.",
  "seo-razborka-p-9-2-html":
    'Новые запчасти подбираем на странице <a href="./zapchasti.html">новых автозапчастей</a>. Ремонт узлов: <a href="./remont-dvigatelya.html">двигатель</a>, <a href="./remont-hodovoy.html">ходовая</a>, <a href="./remont-tormoznoi-sistemy.html">тормоза</a>, <a href="./remont-transmissii.html">КПП и сцепление</a>, <a href="./remont-elektriki.html">автоэлектрик</a>, <a href="./tehnicheskoe-obsluzhivanie.html">ТО</a>, <a href="./sistema-ohlazhdeniya.html">охлаждение</a>, <a href="./avtokondicionery.html">кондиционеры</a>.',
};

const META = {
  "zapchasti.html": {
    title: "Автозапчасти в Павлограде — подбор по VIN и установка",
    description:
      "Подбор и заказ новых автозапчастей в Павлограде по VIN: оригинальные детали и проверенные аналоги для ремонта двигателя, ходовой, тормозов и других систем.",
    h1Key: "hero-title-parts",
    h1: LOCALE["hero-title-parts"],
    seoPrefix: "seo-zapchasti-",
  },
  "razborka/index.html": {
    title: "Б/у автозапчасти в Павлограде — подбор с разборки",
    description:
      "Подбор б/у автозапчастей с разборки в Павлограде по VIN и параметрам автомобиля. Проверка совместимости и состояния, заказ и установка деталей на СТО.",
    h1Key: "hero-title-razborka",
    h1: LOCALE["hero-title-razborka"],
    seoPrefix: "seo-razborka-",
  },
};

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

function seoArticleHtml(prefix) {
  let h2 = LOCALE[`${prefix}h2`];
  if (!h2) return null;
  let out = `        <section class="main-content-section seo-article">
          <div class="main-content-div">
            <div class="main-content">
              <h2 data-translate="${prefix}h2">${h2}</h2>\n`;
  for (let i = 1; i <= 12; i++) {
    const h3k = `${prefix}h3-${i}`;
    if (!LOCALE[h3k]) continue;
    out += `              <h3 data-translate="${h3k}">${LOCALE[h3k]}</h3>\n`;
    for (let j = 1; j <= 4; j++) {
      const pk = `${prefix}p-${i}-${j}`;
      const pkHtml = `${pk}-html`;
      if (LOCALE[pkHtml]) {
        out += `              <p data-translate-html="${pkHtml}">${LOCALE[pkHtml]}</p>\n`;
      } else if (LOCALE[pk]) {
        out += `              <p data-translate="${pk}">${LOCALE[pk]}</p>\n`;
      }
    }
  }
  out += `            </div>
          </div>
        </section>`;
  return out;
}

function updateLocales() {
  for (const file of ["ru.json", "uk.json"]) {
    const p = path.join(root, "locales", file);
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    Object.assign(data, LOCALE);
    fs.writeFileSync(p, JSON.stringify(data, null, 4) + "\n");
  }
}

function patchZapchasti(html) {
  html = html.replace(
    /data-lead-type="razborka"/,
    'data-lead-type="parts"'
  );
  html = replaceMeta(
    html,
    META["zapchasti.html"].title,
    META["zapchasti.html"].description
  );
  html = html.replace(
    /(<h1[^>]*data-translate="hero-title-parts"[^>]*>)([\s\S]*?)(<\/h1>)/i,
    `$1${META["zapchasti.html"].h1}$3`
  );
  // soften benefits fallbacks
  html = html.replace(
    />Официальная гарантия</,
    `>${LOCALE["our-benefits-item11"]}<`
  );
  html = html.replace(
    />на все детали от производителей\*\.</,
    `>${LOCALE["our-benefits-item12"].replace(/^ — /, "").replace(/^\s—\s/, "")}<`
  );
  // simpler: replace whole benefits list texts via data-translate content
  for (const k of [
    "our-benefits-item11",
    "our-benefits-item12",
    "our-benefits-item31",
    "our-benefits-item32",
    "our-benefits-item51",
    "our-benefits-item52",
    "our-benefits-txt2",
  ]) {
    html = html.replace(
      new RegExp(`(data-translate="${k}"[^>]*>)([\\s\\S]*?)(<)`, "i"),
      `$1${LOCALE[k]}$3`
    );
  }
  // related services nav before callback
  if (!html.includes("parts-related-links")) {
    const related = `
        <nav class="parts-related-links" aria-label="Связанные услуги">
          <h2 data-translate="parts-related-title">Связанные услуги СТО</h2>
          <ul>
            <li><a href="./remont-dvigatelya.html">Ремонт двигателя</a></li>
            <li><a href="./remont-hodovoy.html">Ремонт ходовой</a></li>
            <li><a href="./remont-tormoznoi-sistemy.html">Ремонт тормозной системы</a></li>
            <li><a href="./remont-transmissii.html">Ремонт КПП и сцепления</a></li>
            <li><a href="./remont-elektriki.html">Автоэлектрик</a></li>
            <li><a href="./tehnicheskoe-obsluzhivanie.html">Техническое обслуживание</a></li>
            <li><a href="./sistema-ohlazhdeniya.html">Система охлаждения</a></li>
            <li><a href="./avtokondicionery.html">Автокондиционеры</a></li>
            <li><a href="./razborka/">Б/у запчасти с разборки</a></li>
          </ul>
        </nav>
`;
    html = html.replace(
      '<div id="site-callback"></div>',
      `${related}\n                <div id="site-callback"></div>`
    );
  }
  const seo = seoArticleHtml("seo-zapchasti-");
  html = html.replace(
    /<section class="main-content-section seo-article">[\s\S]*?<\/section>/,
    seo
  );
  // schema description
  html = html.replace(
    /"description": "Подбор автозапчастей в Павлограде[\s\S]*?"/,
    `"description": "${META["zapchasti.html"].description}"`
  );
  return html;
}

function patchRazborka(html) {
  html = replaceMeta(
    html,
    META["razborka/index.html"].title,
    META["razborka/index.html"].description
  );
  html = html.replace(
    /(<h1[^>]*data-translate="hero-title-razborka"[^>]*>)([\s\S]*?)(<\/h1>)/i,
    `$1${META["razborka/index.html"].h1}$3`
  );
  // remove brand carousel section entirely (from style+section to before benefits)
  html = html.replace(
    /\s*<style>[\s\S]*?\.service-brand-models[\s\S]*?<\/style>\s*<section class="services-section">[\s\S]*?<\/section>/,
    "\n"
  );
  // related links before benefits
  if (!html.includes("parts-related-links")) {
    const related = `
        <nav class="parts-related-links" aria-label="Связанные услуги">
          <h2 data-translate="parts-related-title">Связанные услуги СТО</h2>
          <ul>
            <li><a href="./remont-dvigatelya.html">Ремонт двигателя</a></li>
            <li><a href="./remont-hodovoy.html">Ремонт ходовой</a></li>
            <li><a href="./remont-tormoznoi-sistemy.html">Ремонт тормозной системы</a></li>
            <li><a href="./remont-transmissii.html">Ремонт КПП и сцепления</a></li>
            <li><a href="./remont-elektriki.html">Автоэлектрик</a></li>
            <li><a href="./tehnicheskoe-obsluzhivanie.html">Техническое обслуживание</a></li>
            <li><a href="./sistema-ohlazhdeniya.html">Система охлаждения</a></li>
            <li><a href="./avtokondicionery.html">Автокондиционеры</a></li>
            <li><a href="./zapchasti.html">Новые автозапчасти</a></li>
          </ul>
        </nav>
`;
    html = html.replace(
      '<div id="site-benefits"></div>',
      `${related}\n        <div id="site-benefits"></div>`
    );
  }
  const seo = seoArticleHtml("seo-razborka-");
  html = html.replace(
    /<section class="main-content-section seo-article">[\s\S]*?<\/section>/,
    seo
  );
  // drop services-carousel script if unused
  html = html.replace(
    /\s*<script src="\.\/src\/js\/services-carousel\.js" defer><\/script>/,
    ""
  );
  // soften hero bullets
  html = html.replace(
    /(data-translate="hero-content-3">)([\s\S]*?)(<\/p>)/,
    `$1Проверка совместимости по VIN.$3`
  );
  html = html.replace(
    /(data-translate="hero-content-2">)([\s\S]*?)(<\/p>)/,
    `$1Условия по детали согласовываем до заказа.$3`
  );
  html = html.replace(
    /(data-translate="hero-content-1">)([\s\S]*?)(<\/p>)/,
    `$1Подбор б/у запчастей под ваш автомобиль.$3`
  );
  return html;
}

function injectServiceNotes() {
  const files = [
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
  const block = `
        <p class="parts-service-note" data-translate-html="parts-service-note">${LOCALE["parts-service-note"]}</p>
`;
  for (const file of files) {
    const fp = path.join(root, file);
    let html = fs.readFileSync(fp, "utf8");
    if (html.includes("parts-service-note")) continue;
    if (!html.includes('class="main-content-section seo-article"')) continue;
    html = html.replace(
      /(<section class="main-content-section seo-article">)/,
      `${block}$1`
    );
    fs.writeFileSync(fp, html);
    console.log("note ->", file);
  }
}

function writeHtaccess() {
  const content = `RewriteEngine On

# Prefer clean URLs: strip index.html
RewriteCond %{THE_REQUEST} \\s/+index\\.html[\\s?] [NC]
RewriteRule ^index\\.html$ / [R=301,L]

RewriteCond %{THE_REQUEST} \\s/+razborka/index\\.html[\\s?] [NC]
RewriteRule ^razborka/index\\.html$ /razborka/ [R=301,L]

# Old English slug → new
RewriteRule ^parts\\.html$ /zapchasti.html [R=301,L]

# Deep razborka URLs removed — 410 Gone (not equivalent to hub)
RewriteCond %{REQUEST_URI} ^/razborka/.+ [NC]
RewriteCond %{REQUEST_URI} !^/razborka/?$ [NC]
RewriteCond %{REQUEST_URI} !^/razborka/index\\.html$ [NC]
RewriteRule ^razborka/.+ - [G,L]

# Evakuator frozen
RewriteRule ^evakuator\\.html$ - [R=404,L]

DirectoryIndex index.html
`;
  fs.writeFileSync(path.join(root, ".htaccess"), content);
}

function writePartsCss() {
  const cssPath = path.join(root, "src/css/pages/zapchasti.css");
  let css = fs.readFileSync(cssPath, "utf8");
  if (!css.includes(".parts-related-links")) {
    css += `
.parts-related-links {
  margin: 2rem 0 1.5rem;
}
.parts-related-links ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
}
.parts-related-links a,
.parts-service-note a {
  color: #24a7c1;
}
.parts-service-note {
  margin: 1.5rem 0;
  line-height: 1.55;
}
.callback-container input[type="file"] {
  color: inherit;
}
.parts-extra-fields[hidden] {
  display: none !important;
}
`;
    fs.writeFileSync(cssPath, css);
  }
  const razCss = path.join(root, "src/css/pages/razborka.css");
  let rcss = fs.readFileSync(razCss, "utf8");
  if (!rcss.includes(".parts-related-links")) {
    rcss += `
.parts-related-links {
  margin: 2rem 0 1.5rem;
}
.parts-related-links ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
}
.parts-related-links a {
  color: #24a7c1;
}
`;
    fs.writeFileSync(razCss, rcss);
  }
  const common = path.join(root, "src/css/pages/common.css");
  let c = fs.readFileSync(common, "utf8");
  if (!c.includes(".parts-service-note")) {
    c += `
.parts-service-note {
  margin: 1.25rem 0 1.75rem;
  line-height: 1.55;
}
.parts-service-note a {
  color: #24a7c1;
}
`;
    fs.writeFileSync(common, c);
  }
}

updateLocales();
{
  const fp = path.join(root, "zapchasti.html");
  fs.writeFileSync(fp, patchZapchasti(fs.readFileSync(fp, "utf8")));
  console.log("zapchasti updated");
}
{
  const fp = path.join(root, "razborka/index.html");
  fs.writeFileSync(fp, patchRazborka(fs.readFileSync(fp, "utf8")));
  console.log("razborka updated");
}
injectServiceNotes();
writeHtaccess();
writePartsCss();
console.log("done");
