import fs from "fs";

const h = fs.readFileSync("ceny.html", "utf8");
const bad = (h.match(/<thead[^>]*data-translate/g) || []).length;
const good = (h.match(/<thead>\s*<tr>\s*<th[^>]*data-translate/g) || []).length;
const tds = (h.match(/data-translate="price-/g) || []).length;
const htmlT = (h.match(/data-translate-html="price-/g) || []).length;
console.log({ badThead: bad, goodThead: good, translateAttrs: tds, htmlAttrs: htmlT });

const uk = JSON.parse(fs.readFileSync("locales/uk.json", "utf8"));
const ru = JSON.parse(fs.readFileSync("locales/ru.json", "utf8"));
const priceKeys = Object.keys(ru).filter((k) => k.startsWith("price-"));
let missing = 0;
let same = 0;
for (const k of priceKeys) {
  if (!uk[k]) missing++;
  else if (uk[k] === ru[k]) same++;
}
console.log({
  priceKeys: priceKeys.length,
  missingUk: missing,
  identicalUkRu: same,
  sampleRu: ru[priceKeys[0]],
  sampleUk: uk[priceKeys[0]],
});

// service page sample
const svc = fs.readFileSync("remont-dvigatelya.html", "utf8");
console.log({
  dvigatelPriceAttrs: (svc.match(/data-translate="price-/g) || []).length,
  dvigatelBrokenThead: (svc.match(/<thead[^>]*data-translate/g) || []).length,
});
