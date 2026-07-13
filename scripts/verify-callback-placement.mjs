import fs from "fs";

const files = [
  "index.html",
  "ceny.html",
  "remont-dvigatelya.html",
  "uslugi.html",
  "zapchasti.html",
  "evakuator.html",
  "razborka/index.html",
];

for (const f of files) {
  const h = fs.readFileSync(f, "utf8");
  const cb = h.indexOf('id="site-callback"');
  const seo = h.indexOf("seo-article:start");
  const count = (h.match(/id="site-callback"/g) || []).length;
  console.log(f, {
    count,
    cbBeforeSeo: seo < 0 ? "no-seo" : cb >= 0 && cb < seo,
    hasCb: cb >= 0,
  });
}

const cbInc = fs.readFileSync("src/includes/callback.inc", "utf8");
console.log("nameRequired", /nameInput[\s\S]*?required/.test(cbInc));
console.log("phoneRequired", /phoneInput[\s\S]*?required/.test(cbInc));
console.log("partsOnly", cbInc.includes("data-parts-only"));
