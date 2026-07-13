import fs from "fs";

const ruPath = "locales/ru.json";
const ukPath = "locales/uk.json";
const ru = JSON.parse(fs.readFileSync(ruPath, "utf8"));
const uk = JSON.parse(fs.readFileSync(ukPath, "utf8"));

const fixesUk = {
  "price-item-116": "Зняття-встановлення (заміна) рульової рейки",
  "price-item-118": "Ремонт механічної рульової рейки",
  "price-item-119": "Ремонт гідравлічної рульової рейки",
  "price-item-121": "Ремонт електричної рульової рейки",
  "price-item-153": "+800 грн. до заміни кардана за кожну хрестовину",
  "price-item-167": "Калібрування пневматичної підвіски",
  "price-item-168": "Заправка пневматичної підвіски азотом",
  "price-item-171": "Вимірювання тиску паливного насоса",
  "price-item-241": "Зняття ГБО (якщо автомобіль обладнаний ГБО)",
  "price-item-245": "Монтаж/демонтаж колектора",
  "price-item-251": "Зняття/встановлення форсунок (за 4 шт)",
  "price-item-252":
    "Зняття/встановлення форсунок, безпосередній впорск — під колектором (за 4 шт)",
  "price-item-266":
    "500 грн + витратні матеріали (мастило і фреон), на порожній системі в середньому 1800 грн.",
  "price-item-267":
    "Антибактеріальне чищення кондиціонера (теплообмінника спеціальною піною)",
  "price-item-275": "Заряджання акумулятора",
  "price-item-280": "Ходова частина",
  "price-item-281": "Паливна система",
  "price-item-283": "ГРМ (газорозподільний механізм)",
  "price-item-284": "Двигун",
  "price-item-285": "Система запалювання",
  "price-item-289": "Розвал-сходження",
  "price-item-290": "Обслуговування кондиціонера",
  "price-item-291": "Акумулятори",
};

const fixesRu = {
  "price-item-153": "+800 грн. до замены кардана за каждую крестовину",
  "price-item-241": "Снятие ГБО (если автомобиль оборудован ГБО)",
  "price-item-245": "Монтаж/демонтаж коллектора",
  "price-item-251": "Снятие/установка форсунок (за 4 шт)",
  "price-item-252":
    "Снятие/установка форсунок, непосредственный впрыск — под коллектором (за 4 шт)",
  "price-item-266":
    "500 грн + расходные материалы (масло и фреон), на пустой системе в среднем 1800 грн.",
  "price-item-267":
    "Антибактериальная чистка кондиционера (теплообменника специальной пеной)",
  "price-item-280": "Ходовая часть",
  "price-item-283": "ГРМ (газораспределительный механизм)",
  "price-item-291": "Аккумуляторы",
};

for (const [k, v] of Object.entries(fixesUk)) {
  if (uk[k] !== undefined) uk[k] = v;
}
for (const [k, v] of Object.entries(fixesRu)) {
  if (ru[k] !== undefined) ru[k] = v;
}

function patchHtml(file) {
  let h = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [k, v] of Object.entries(fixesRu)) {
    const re = new RegExp(
      `(data-translate(?:-html)?="${k}"[^>]*>)([\\s\\S]*?)(</t[dh]>)`,
      "i"
    );
    const m = h.match(re);
    if (m && m[2] !== v) {
      h = h.replace(re, `$1${v}$3`);
      n++;
    }
  }
  if (n) fs.writeFileSync(file, h);
  return n;
}

const files = [
  "ceny.html",
  "remont-dvigatelya.html",
  "remont-hodovoy.html",
  "remont-transmissii.html",
  "remont-tormoznoi-sistemy.html",
  "remont-elektriki.html",
  "tehnicheskoe-obsluzhivanie.html",
  "diagnostika-avto.html",
  "avtokondicionery.html",
];

let total = 0;
for (const f of files) total += patchHtml(f);

fs.writeFileSync(ruPath, JSON.stringify(ru, null, 4) + "\n");
fs.writeFileSync(ukPath, JSON.stringify(uk, null, 4) + "\n");

const identicalText = Object.keys(ru).filter((k) => {
  if (!k.startsWith("price-") || ru[k] !== uk[k]) return false;
  const t = ru[k].trim();
  if (/^\d/.test(t) || /^(от |від |\+)\d/.test(t) || /^\d+\s*грн/.test(t))
    return false;
  return /[А-Яа-яІіЇїЄє]{4,}/.test(t);
});

console.log({ htmlPatched: total, remainingIdenticalText: identicalText });
