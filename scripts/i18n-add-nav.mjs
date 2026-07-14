import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ruPath = path.join(root, "locales/ru.json");
const ukPath = path.join(root, "locales/uk.json");
const ru = JSON.parse(fs.readFileSync(ruPath, "utf8"));
const uk = JSON.parse(fs.readFileSync(ukPath, "utf8"));

const add = {
  "nav-home": ["Главная", "Головна"],
  "nav-parts": ["Подбор запчастей", "Підбір запчастин"],
  "nav-parts-new": ["Новые запчасти", "Нові запчастини"],
  "nav-parts-used": ["Запчасти с разборки", "Запчастини з розбирання"],
  "nav-ac": ["Автокондиционеры", "Автокондиціонери"],
  "nav-services": ["Услуги", "Послуги"],
  "nav-engine": ["Двигатель", "Двигун"],
  "nav-chassis": ["Ходовая часть", "Ходова частина"],
  "nav-electric": ["Электрика", "Електрика"],
  "nav-brakes": ["Тормозная система", "Гальмівна система"],
  "nav-transmission": ["Трансмиссия", "Трансмісія"],
  "nav-to": ["Техническое обслуживание", "Технічне обслуговування"],
  "nav-diagnostics": ["Диагностика", "Діагностика"],
  "nav-gbo": ["Установка ГБО", "Встановлення ГБО"],
  "nav-cooling": ["Система охлаждения", "Система охолодження"],
  "nav-prices": ["Цены", "Ціни"],
  "nav-open-submenu": ["Открыть подменю", "Відкрити підменю"],
  "nav-open-menu": ["Открыть меню", "Відкрити меню"],
  "car-placeholder": ["Марка и модель авто", "Марка і модель авто"],
  "modal-car-label": [
    "Марка / модель автомобиля",
    "Марка / модель автомобіля",
  ],
  "logo-aria": ["Автосервис Каскад", "Автосервіс Каскад"],
};

for (const [k, [r, u]] of Object.entries(add)) {
  ru[k] = r;
  uk[k] = u;
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
console.log("added", Object.keys(add).length);
