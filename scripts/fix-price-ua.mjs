import fs from "fs";

const p = "D:/CursorProjects/Cascad/kaskad_v7/locales/ru.json";
const d = JSON.parse(fs.readFileSync(p, "utf8"));
const fixes = {
  "price-item-188":
    "Замена комплекта ГРМ бензинового двигателя (16-20 клапанов) со снятием передней части",
  "price-item-190": "Замена комплекта ГРМ (оппозитный двигатель)",
  "price-item-192": "Замена комплекта ГРМ бензинового двигателя (6-8 цилиндров)",
  "price-item-193":
    "Замена комплекта ГРМ бензинового двигателя (6-8 цилиндров) со снятием передней части",
  "price-item-195": "Замена комплекта ГРМ дизельного двигателя",
  "price-item-197":
    "Замена комплекта ГРМ дизельного двигателя со снятием клапанной крышки",
  "price-item-199":
    "Замена комплекта ГРМ дизельного двигателя (16 клапанов) со снятием передней части",
  "price-item-200": "Замена комплекта ГРМ дизельного двигателя (6-8 цилиндров)",
  "price-item-264": "Диагностика кондиционера (визуальный осмотр с УФ-лампой)",
  "price-item-268": "от 1200 грн. (работа и пена)",
  "price-item-269":
    "Диагностика системы кондиционирования (герметичность под давлением, азотом)",
  "price-item-270":
    "Диагностика системы кондиционирования заправочной станцией (давление и производительность)",
  "price-item-272": "Замена аккумулятора (под капотом)",
};
Object.assign(d, fixes);
fs.writeFileSync(p, JSON.stringify(d, null, 4) + "\n");

const htmlPath = "D:/CursorProjects/Cascad/kaskad_v7/ceny.html";
let h = fs.readFileSync(htmlPath, "utf8");
for (const [k, v] of Object.entries(fixes)) {
  h = h.replace(
    new RegExp(`(data-translate="${k}">)([^<]*)(</)`, "g"),
    `$1${v}$3`
  );
}
h = h.replace(/Замена комплекту ГРМ/g, "Замена комплекта ГРМ");
fs.writeFileSync(htmlPath, h);
console.log("price UA mix cleaned");
