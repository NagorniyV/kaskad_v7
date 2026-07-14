import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ruPath = path.join(root, "locales/ru.json");
const ukPath = path.join(root, "locales/uk.json");
const plan = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/_i18n-plan.json"), "utf8")
);
const patch = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/_i18n-uk-patch.json"), "utf8")
);

const ru = JSON.parse(fs.readFileSync(ruPath, "utf8"));
const uk = JSON.parse(fs.readFileSync(ukPath, "utf8"));

// --- missing RU ---
const missingRu = {
  "item-service-catalog-dvigatel":
    "Наши работы по двигателю внутреннего сгорания:",
  "price-content-11":
    "Представляем вашему вниманию актуальный прайс-лист автосервиса «АС КАСКАД» в Павлограде. Работаем в Павлограде с 2005 года и специализируемся на полном спектре услуг по ремонту и обслуживанию автомобилей всех марок – от легковых до коммерческих. Мы выполняем профессиональную компьютерную диагностику, техническое обслуживание, замену масел и фильтров, ремонт ходовой части и тормозной системы, установку и сервисное обслуживание ГБО, а также ремонт и заправку автомобильных кондиционеров.",
  "price-content-22":
    "Здесь вы найдете основные услуги по диагностике авто, техническому обслуживанию, ремонту двигателя, подвески, тормозной системы и установке газобаллонного оборудования. Если нужной услуги нет в списке – просто позвоните нам по телефонам +38 (066) 837 56 66 или +38 (096) 211 02 10. Менеджеры автосервиса «АС КАСКАД» всегда готовы предоставить профессиональную консультацию, ответить на все ваши вопросы и предложить оптимальное решение для любого автомобиля.",
};

Object.assign(ru, missingRu);

// ensure RU for patch-only extras
const extraRu = {
  "parts-related-title": "Связанные услуги СТО",
  "parts-related-subtitle":
    "Ремонт и обслуживание — страницы услуг автосервиса",
  "parts-cards-title": "Запчасти для ремонта",
  "parts-cards-subtitle":
    "Подбор новых и б/у деталей под диагностику и ремонт на СТО",
};
for (const [k, v] of Object.entries(extraRu)) {
  if (!ru[k]) ru[k] = v;
}

// --- apply UK patch ---
let applied = 0;
for (const [k, v] of Object.entries(patch)) {
  uk[k] = v;
  applied++;
  if (!(k in ru) && missingRu[k]) {
    // already assigned
  } else if (!(k in ru) && extraRu[k]) {
    ru[k] = extraRu[k];
  } else if (!(k in ru) && typeof patch[k] === "string") {
    // keep ru if somehow missing - skip
  }
}
// missingRu into uk if patch has them (it should)
for (const k of Object.keys(missingRu)) {
  if (!uk[k] && patch[k]) uk[k] = patch[k];
}

// --- delete unused (keep seo-ceny and JS/runtime keys) ---
const keep = new Set([
  ...Object.keys(patch),
  ...plan.needUk,
  "parts-related-title",
  "parts-related-subtitle",
  "parts-cards-title",
  "parts-cards-subtitle",
  "parts-field-part",
  "services-title",
  "services-subtitle",
  "details-btn",
  // restore on ceny.html
  "seo-ceny-h2",
  "seo-ceny-h3-1",
  "seo-ceny-p-1-1",
  "seo-ceny-h3-2",
  "seo-ceny-p-2-1",
  "seo-ceny-h3-3",
  "seo-ceny-p-3-1-html",
  "seo-ceny-h3-4",
  "seo-ceny-p-4-1",
  "ceny-price-note",
  "ceny-nav-title",
]);

const usedStatic = new Set(plan.needUk);
// rebuild used from audit usedKeys + keep
const audit = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/_i18n-audit.json"), "utf8")
);
const used = new Set([...(audit.usedKeys || []), ...keep]);

let deleted = 0;
for (const k of Object.keys(ru)) {
  if (!used.has(k) && !keep.has(k)) {
    delete ru[k];
    delete uk[k];
    deleted++;
  }
}

// sync key sets: remove uk-only leftovers
for (const k of Object.keys(uk)) {
  if (!(k in ru)) delete uk[k];
}
for (const k of Object.keys(ru)) {
  if (!(k in uk)) {
    // should not happen for used; leave as stub from RU for safety? better force from patch
    uk[k] = patch[k] || ru[k];
  }
}

function sortObject(obj) {
  return Object.fromEntries(
    Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => [k, obj[k]])
  );
}

fs.writeFileSync(ruPath, JSON.stringify(sortObject(ru), null, 4) + "\n", "utf8");
fs.writeFileSync(ukPath, JSON.stringify(sortObject(uk), null, 4) + "\n", "utf8");

console.log({
  applied,
  deleted,
  ruKeys: Object.keys(ru).length,
  ukKeys: Object.keys(uk).length,
  missingStill: ["item-service-catalog-dvigatel", "price-content-11", "price-content-22"].filter(
    (k) => !ru[k] || !uk[k]
  ),
});
