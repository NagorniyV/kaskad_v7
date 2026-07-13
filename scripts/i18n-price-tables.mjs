/**
 * Add data-translate / data-translate-html to price tables
 * (tables that contain td.price) on ceny + service pages.
 *
 * Usage: node scripts/i18n-price-tables.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "ceny.html",
  "remont-dvigatelya.html",
  "remont-hodovoy.html",
  "remont-transmissii.html",
  "remont-tormoznoi-sistemy.html",
  "remont-elektriki.html",
  "tehnicheskoe-obsluzhivanie.html",
  "diagnostika-avto.html",
  "avtokondicionery.html",
  "ustanovka-gbo.html",
  "sistema-ohlazhdeniya.html",
];

const TO_RU = [
  [/двигательа/gi, "двигателя"],
  [/візуально-акустичнии/gi, "визуально-акустический"],
  [/осмотр, течи та /gi, "осмотр, течи и "],
  [/Видеобороскопия/gi, "Видеоэндоскопия"],
  [/у системе охлаждения/gi, "в системе охлаждения"],
  [/продуктивности/gi, "производительности"],
  [/ходовои/gi, "ходовой"],
  [/Навесное оборудования/gi, "Навесное оборудование"],
  [/наповнення/gi, "наполнения"],
  [/акумулятора/gi, "аккумулятора"],
  [/розвал-сходження/gi, "развал-схождения"],
  [/позашляховики/gi, "внедорожники"],
  [/впускного тракту/gi, "впускного тракта"],
  [/димогенератор/gi, "дымогенератор"],
  [/механічніи КПП/gi, "механической КПП"],
  [/захисту двигательа/gi, "защиты двигателя"],
  [/фильтра салону/gi, "фильтра салона"],
  [/педальнии узел/gi, "педальный узел"],
  [/у бардачка/gi, "в бардачке"],
  [/у бака/gi, "в баке"],
  [/з комп'ютера то/gi, "с компьютера, то"],
  [/роздавальніи/gi, "раздаточной"],
  [/Апаратна промывка/gi, "Аппаратная промывка"],
  [/миестьмо только/gi, "моем только"],
  [/коробки з двойным/gi, "коробки с двойным"],
  [/Змащення 1 хрестовини/gi, "Смазка 1 крестовины"],
  [/Тормозна система/gi, "Тормозная система"],
  [/комплекту сцепления/gi, "комплекта сцепления"],
  [/повнии привід/gi, "полный привод"],
  [/гвинти/gi, "винты"],
  [/шайби/gi, "шайбы"],
  [/випускного колектора/gi, "выпускного коллектора"],
  [/впускного колектора/gi, "впускного коллектора"],
  [/клапанной кришки/gi, "клапанной крышки"],
  [/без снятия колектора/gi, "без снятия коллектора"],
  [/шаровой опори/gi, "шаровой опоры"],
  [/запресована/gi, "запрессованная"],
  [/болти или заклепки/gi, "болты или заклепки"],
  [/без пружини/gi, "без пружины"],
  [/сайлентблока плавающего/gi, "сайлентблока плавающего"],
];

/** Ordered RU→UK replacements (longer first after sort) */
const RU_UK = [
  ["Наименование услуг:", "Найменування послуг:"],
  ["Цена от, грн.", "Ціна від, грн."],
  ["Диагностика автомобиля", "Діагностика автомобіля"],
  ["Замена технических жидкостей и фильтров", "Заміна технічних рідин і фільтрів"],
  ["Тормозная система", "Гальмівна система"],
  ["Ходовая часть / подвеска", "Ходова частина / підвіска"],
  ["Ходовая часть", "Ходова частина"],
  ["Ремонт двигателя", "Ремонт двигуна"],
  ["Система охлаждения", "Система охолодження"],
  ["Установка и обслуживание ГБО", "Встановлення та обслуговування ГБО"],
  ["Установка ГБО", "Встановлення ГБО"],
  ["Обслуживание автокондиционеров", "Обслуговування автокондиціонерів"],
  ["Автокондиционеры", "Автокондиціонери"],
  ["Трансмиссия / сцепление", "Трансмісія / зчеплення"],
  ["Трансмиссия", "Трансмісія"],
  ["Электрика автомобиля", "Електрика автомобіля"],
  ["Электрика", "Електрика"],
  ["включено в диагностику ходовой/двигателя", "включено в діагностику ходової/двигуна"],
  ["включено в диагностику ходовой", "включено в діагностику ходової"],
  ["+150 грн до диагностики ходовой", "+150 грн до діагностики ходової"],
  ["до замены сцепления", "до заміни зчеплення"],
  ["при покупке масла в нас", "при купівлі мастила у нас"],
  ["если свое", "якщо своє"],
  ["со снятием поддона", "зі зняттям піддона"],
  ["чтение ошибок", "зчитування помилок"],
  ["полноценная", "повноцінна"],
  ["Видеоэндоскопия двигателя", "Відеоендоскопія двигуна"],
  ["Диагностика двигателя", "Діагностика двигуна"],
  ["Диагностика системы охлаждения", "Діагностика системи охолодження"],
  ["Диагностика кондиционера", "Діагностика кондиціонера"],
  ["Диагностика системы электропитания", "Діагностика системи електроживлення"],
  ["Диагностика ходовой части", "Діагностика ходової частини"],
  ["Диагностика системы зажигания", "Діагностика системи запалювання"],
  ["Компьютерная диагностика", "Комп'ютерна діагностика"],
  ["Предпродажная диагностика авто", "Передпродажна діагностика авто"],
  ["Проверка аккумулятора", "Перевірка акумулятора"],
  ["Проверка развал-схождения", "Перевірка розвал-сходження"],
  ["Регулировка развал-схождения", "Регулювання розвал-сходження"],
  ["Проверка герметичности впускного тракта", "Перевірка герметичності впускного тракту"],
  ["Проверка ЛКП толщиномером", "Перевірка ЛФП товщиноміром"],
  ["Проверка наполнения цилиндров мотор-тестером", "Перевірка наповнення циліндрів мотор-тестером"],
  ["Рулевое управление", "Рульове керування"],
  ["Навесное оборудование", "Навісне обладнання"],
  ["Подтекание", "Підтікання"],
  ["Уровни и качество подкапотных жидкостей", "Рівні та якість підкапотних рідин"],
  ["Двигатель / Навесное оборудование", "Двигун / Навісне обладнання"],
  ["Замена масла в двигателе и фильтра масляного", "Заміна мастила в двигуні та масляного фільтра"],
  ["Снятие-установка защиты двигателя", "Зняття-встановлення захисту двигуна"],
  ["Замена масла в механической КПП", "Заміна мастила в механічній КПП"],
  ["Замена фильтра воздуха", "Заміна повітряного фільтра"],
  ["Замена фильтра салона", "Заміна салонного фільтра"],
  ["Замена фильтра топливного", "Заміна паливного фільтра"],
  ["Замена фильтра топлива дизельного", "Заміна дизельного паливного фільтра"],
  ["Частичная замена жидкости в АКПП", "Часткова заміна рідини в АКПП"],
  ["без замены фильтра АКПП", "без заміни фільтра АКПП"],
  ["с заменой фильтра АКПП", "із заміною фільтра АКПП"],
  ["Замена масла в раздаточной коробке", "Заміна мастила в роздатковній коробці"],
  ["Замена масла в мосту", "Заміна мастила в мосту"],
  ["Замена жидкости ГУР с промывкой", "Заміна рідини ГПК із промиванням"],
  ["Замена жидкости ГУР", "Заміна рідини ГПК"],
  ["Замена жидкости системы охлаждения", "Заміна рідини системи охолодження"],
  ["Аппаратная промывка системы охлаждения", "Апаратне промивання системи охолодження"],
  ["моем только всю систему целиком!", "миємо лише всю систему цілком!"],
  ["Замена жидкости коробки с двойным сцеплением", "Заміна рідини коробки з подвійним зчепленням"],
  ["Смазка 1 крестовины карданного вала", "Змащення 1 хрестовини карданного вала"],
  ["Замена шланга тормозного", "Заміна гальмівного шланга"],
  ["Замена тормозных колодок дисковых", "Заміна дискових гальмівних колодок"],
  ["Замена тормозных колодок барабанных", "Заміна барабанних гальмівних колодок"],
  ["комплект", "комплект"],
  ["Замена комплекта сцепления", "Заміна комплекту зчеплення"],
  ["без снятия подрамника", "без зняття підрамника"],
  ["со снятием подрамника", "зі зняттям підрамника"],
  ["полный привод", "повний привід"],
  ["Замена маховика", "Заміна маховика"],
  ["Замена заднего сальника коленчатого вала", "Заміна заднього сальника колінчастого вала"],
  ["Замена троса сцепления", "Заміна троса зчеплення"],
  ["Замена шланга сцепления", "Заміна шланга зчеплення"],
  ["Замена цилиндра сцепления", "Заміна циліндра зчеплення"],
  ["Замена рабочей жидкости сцепления", "Заміна робочої рідини зчеплення"],
  ["Измерение компрессии бензинового двигателя", "Вимірювання компресії бензинового двигуна"],
  ["Измерение компрессии дизельного двигателя", "Вимірювання компресії дизельного двигуна"],
  ["Регулировка клапанов", "Регулювання клапанів"],
  ["Замена прокладки выпускного коллектора", "Заміна прокладки випускного колектора"],
  ["Замена прокладки впускного коллектора", "Заміна прокладки впускного колектора"],
  ["Замена прокладки клапанной крышки", "Заміна прокладки клапанної кришки"],
  ["без снятия коллектора", "без зняття колектора"],
  ["Замена стойки стабилизатора", "Заміна стійки стабілізатора"],
  ["Замена втулки стабилизатора", "Заміна втулки стабілізатора"],
  ["Замена переднего нижнего рычага", "Заміна переднього нижнього важеля"],
  ["Замена сайлентблоков рычага переднего нижнего", "Заміна сайлентблоків переднього нижнього важеля"],
  ["Замена сайлентблоков рычага переднего верхнего", "Заміна сайлентблоків переднього верхнього важеля"],
  ["Замена рычага заднего поперечного", "Заміна заднього поперечного важеля"],
  ["Замена сайлентблоков рычага заднего поперечного", "Заміна сайлентблоків заднього поперечного важеля"],
  ["Замена рычага продольного", "Заміна поздовжнього важеля"],
  ["Замена шаровой опоры", "Заміна кульової опори"],
  ["запрессованная", "запресована"],
  ["болты или заклепки", "болти або заклепки"],
  ["Замена подшипника ступицы", "Заміна підшипника маточини"],
  ["Замена амортизатора в пружине", "Заміна амортизатора в пружині"],
  ["Замена амортизатора без пружины", "Заміна амортизатора без пружини"],
  ["вставка", "вставка"],
  ["Замена сайлентблока плавающего", "Заміна плаваючого сайлентблока"],
  ["шарнирного", "шарнірного"],
  ["Замена сайлентблоков задней балки", "Заміна сайлентблоків задньої балки"],
  ["внедорожники", "позашляховики"],
  ["цилиндра", "циліндра"],
  ["цилиндров", "циліндрів"],
  ["цилиндр", "циліндр"],
  [" (1 ось)", " (1 вісь)"],
  [" (2 оси)", " (2 осі)"],
  ["за 2 сайлентблока", "за 2 сайлентблоки"],
  ["за 2 шт", "за 2 шт"],
  ["от ", "від "],
  ["Диагностика ", "Діагностика "],
  ["Замена ", "Заміна "],
  ["Проверка ", "Перевірка "],
  ["Регулировка ", "Регулювання "],
  ["Ремонт ", "Ремонт "],
  ["Снятие ", "Зняття "],
  ["Установка ", "Встановлення "],
  ["Чистка ", "Чищення "],
  ["Промывка ", "Промивання "],
  ["Заправка ", "Заправка "],
  ["двигателя", "двигуна"],
  ["двигатель", "двигун"],
  ["ходовой", "ходової"],
  ["тормозн", "гальмівн"],
  ["фильтра", "фільтра"],
  ["фильтр", "фільтр"],
  ["масла", "мастила"],
  ["жидкости", "рідини"],
  ["жидкость", "рідина"],
  ["охлаждения", "охолодження"],
  ["сцепления", "зчеплення"],
  ["системы", "системи"],
];

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeyPart(text) {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-яіїєґ0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 52);
}

function toRu(text) {
  let t = text;
  for (const [re, rep] of TO_RU) t = t.replace(re, rep);
  return t;
}

function toUk(text) {
  let t = toRu(text);
  const pairs = [...RU_UK].sort((a, b) => b[0].length - a[0].length);
  for (const [ru, uk] of pairs) {
    if (t.includes(ru)) t = t.split(ru).join(uk);
  }
  return t;
}

let keySeq = 1;
function slugify(text, used) {
  // Prefer stable semantic keys; fall back to counter if collision
  let base = "price-" + (normalizeKeyPart(text) || "item");
  // Avoid non-latin in attributes for broader tooling compatibility
  if (/[^a-z0-9-]/i.test(base.replace(/^price-/, ""))) {
    base = `price-item-${String(keySeq++).padStart(3, "0")}`;
  }
  let key = base;
  let n = 2;
  while (used.has(key)) key = `${base}-${n++}`;
  used.add(key);
  return key;
}

function ensureKey(text, htmlValue, translations, usedKeys, asHtml) {
  const ruText = stripTags(toRu(text));
  // Reuse existing key with same RU value
  for (const [k, v] of Object.entries(translations.ru)) {
    if (stripTags(v) === ruText) return k;
  }
  const key = slugify(ruText, usedKeys);
  if (asHtml) {
    translations.ru[key] = toRu(htmlValue);
    translations.uk[key] = toUk(htmlValue);
  } else {
    translations.ru[key] = ruText;
    translations.uk[key] = toUk(ruText);
  }
  return key;
}

function processPriceTable(tableHtml, translations, usedKeys, stats) {
  let t = tableHtml;

  t = t.replace(/<th\b([^>]*)>([\s\S]*?)<\/th>/gi, (full, attrs, inner) => {
    if (/data-translate/i.test(full)) return full;
    const text = stripTags(inner);
    if (!text) return full;
    const key = ensureKey(text, inner, translations, usedKeys, false);
    const ru = translations.ru[key];
    stats.th++;
    const cleanAttrs = attrs.replace(/\sdata-translate(-html)?="[^"]*"/gi, "");
    return `<th${cleanAttrs} data-translate="${key}">${ru}</th>`;
  });

  t = t.replace(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi, (full, attrs, inner) => {
    if (/data-translate/i.test(full)) return full;
    const hasBr = /<br\s*\/?>/i.test(inner);
    const text = stripTags(inner);
    if (!text) return full;
    const key = ensureKey(text, inner.trim(), translations, usedKeys, hasBr);
    const val = translations.ru[key];
    stats.td++;
    const cleanAttrs = attrs.replace(/\sdata-translate(-html)?="[^"]*"/gi, "");
    const attr = hasBr ? "data-translate-html" : "data-translate";
    return `<td${cleanAttrs} ${attr}="${key}">${val}</td>`;
  });

  return t;
}

function processHtml(html, translations, usedKeys, stats) {
  // Only tables that contain at least one td.price
  html = html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    if (!/class\s*=\s*["']price["']/i.test(table) && !/class\s*=\s*["'][^"']*\bprice\b/i.test(table)) {
      return table;
    }
    stats.tables++;
    return processPriceTable(table, translations, usedKeys, stats);
  });

  // h2 immediately before a price table
  html = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>(\s*<table\b[\s\S]*?<\/table>)/gi,
    (full, attrs = "", inner, tablePart) => {
      if (!/class\s*=\s*["'][^"']*\bprice\b/i.test(tablePart)) return full;
      if (/data-translate/i.test(attrs + inner)) return full;
      const text = stripTags(inner);
      if (!text || text.length > 120) return full;
      const key = ensureKey(text, inner, translations, usedKeys, false);
      stats.h2++;
      return `<h2${attrs} data-translate="${key}">${translations.ru[key]}</h2>${tablePart}`;
    }
  );

  return html;
}

function mergeLocale(file, additions) {
  const full = path.join(root, "locales", file);
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  Object.assign(data, additions);
  fs.writeFileSync(full, JSON.stringify(data, null, 4) + "\n", "utf8");
}

function patchLanguageJs() {
  const file = path.join(root, "src/js/language.js");
  let js = fs.readFileSync(file, "utf8");
  if (js.includes("data-translate-html")) return;
  const needle = `      document.querySelectorAll("[data-translate]").forEach((el) => {
        const key = el.getAttribute("data-translate");
        if (translations[key]) el.textContent = translations[key];
      });`;
  const insert = `${needle}

      document.querySelectorAll("[data-translate-html]").forEach((el) => {
        const key = el.getAttribute("data-translate-html");
        if (translations[key]) el.innerHTML = translations[key];
      });`;
  if (!js.includes(needle)) {
    console.warn("language.js pattern not found — patch manually");
    return;
  }
  js = js.replace(needle, insert);
  fs.writeFileSync(file, js, "utf8");
  console.log("patched language.js for data-translate-html");
}

function main() {
  const translations = { ru: {}, uk: {} };
  const usedKeys = new Set();
  const stats = { h2: 0, th: 0, td: 0, tables: 0, files: 0 };

  for (const loc of ["ru", "uk"]) {
    const data = JSON.parse(
      fs.readFileSync(path.join(root, "locales", `${loc}.json`), "utf8")
    );
    Object.keys(data).forEach((k) => usedKeys.add(k));
  }

  for (const rel of FILES) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) {
      console.warn("missing", rel);
      continue;
    }
    const before = fs.readFileSync(file, "utf8");
    const after = processHtml(before, translations, usedKeys, stats);
    if (after !== before) {
      fs.writeFileSync(file, after, "utf8");
      stats.files++;
      console.log("updated", rel);
    } else {
      console.log("unchanged", rel);
    }
  }

  mergeLocale("ru.json", translations.ru);
  mergeLocale("uk.json", translations.uk);
  patchLanguageJs();

  console.log({ ...stats, newKeys: Object.keys(translations.ru).length });
}

main();
