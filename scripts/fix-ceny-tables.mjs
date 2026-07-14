import fs from "fs";
const fp = "D:/CursorProjects/Cascad/kaskad_v7/ceny.html";
let h = fs.readFileSync(fp, "utf8");
h = h.replace(/Цена от, грн\.<\/th>Цена от, грн\.<\/th>/g, "Цена от, грн.</th>");
h = h.replace(
  /<th data-translate="price-item-001">Наименование услуг:<\/h2>/g,
  '<th data-translate="price-item-001">Наименование услуг:</th>'
);
h = h.replace(/<(th\b[^>]*)>([^<]*)<\/h2>/g, "<$1>$2</th>");

// Ensure akkum has table opener
if (
  /id="price-akkum"[\s\S]{0,200}<th data-translate="price-item-002">/.test(h) &&
  !/id="price-akkum"[\s\S]{0,200}<table>/.test(h)
) {
  h = h.replace(
    /(<h2 id="price-akkum"[\s\S]*?<\/h2>\s*<p class="price-section-link">[\s\S]*?<\/p>)\s*(<th data-translate="price-item-002">)/,
    `$1
          <table>
            <thead>
              <tr>
                <th data-translate="price-item-001">Наименование услуг:</th>
                $2`
  );
  console.log("akkum table repaired");
}

fs.writeFileSync(fp, h);
console.log("done");
const i = h.indexOf('id="price-akkum"');
console.log(h.slice(i, i + 420));
const j = h.indexOf('id="price-hodovaya"');
console.log("---hodovaya---");
console.log(h.slice(j, j + 380));
