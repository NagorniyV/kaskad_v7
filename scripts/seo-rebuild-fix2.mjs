import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ru = JSON.parse(fs.readFileSync(path.join(root, "locales/ru.json"), "utf8"));

// Fix broken diagnostics list spans
{
  const fp = path.join(root, "diagnostika-avto.html");
  let h = fs.readFileSync(fp, "utf8");
  for (let i = 1; i <= 5; i++) {
    const key = `diagnostics-list${i}`;
    const text = ru[key];
    h = h.replace(
      new RegExp(
        `<span data-translate="${key}"[^>]*>[\\s\\S]*?<\\/span\\s*>`,
        "i"
      ),
      `<span data-translate="${key}">${text}</span>`
    );
  }
  fs.writeFileSync(fp, h);
  console.log("diagnostics lists fixed");
}

// Fix condi-list5 span if broken
{
  const fp = path.join(root, "avtokondicionery.html");
  let h = fs.readFileSync(fp, "utf8");
  h = h.replace(
    /<span data-translate="condi-list5"[^>]*>[\s\S]*?<\/span\s*>/i,
    `<span data-translate="condi-list5">${ru["condi-list5"]}</span>`
  );
  fs.writeFileSync(fp, h);
}

// Repair ceny tables that lost thead openers (legacy broken </th> on h2)
{
  const fp = path.join(root, "ceny.html");
  let h = fs.readFileSync(fp, "utf8");
  const opener = `          <table>
            <thead>
              <tr>
                <th data-translate="price-item-001">Наименование услуг:</th>
                <th data-translate="price-item-002">Цена от, грн.</th>`;

  const brokenIds = ["price-hodovaya", "price-grm", "price-akkum"];
  for (const id of brokenIds) {
    // If after price-section-link we jump straight to orphan th price-item-002
    const re = new RegExp(
      `(<h2 id="${id}"[\\s\\S]*?<\\/h2>\\s*<p class="price-section-link">[\\s\\S]*?<\\/p>)\\s*<th data-translate="price-item-002">`,
      "i"
    );
    if (re.test(h)) {
      h = h.replace(
        re,
        `$1\n${opener.replace(
          '<th data-translate="price-item-002">',
          '<th data-translate="price-item-002">'
        )}`
      );
      // The replace above duplicated wrong - fix properly:
    }
  }

  // Cleaner approach: for each id, if missing <table> before first th of section
  for (const id of brokenIds) {
    const blockRe = new RegExp(
      `(<h2 id="${id}"[\\s\\S]*?<\\/h2>\\s*(?:<p class="price-section-link">[\\s\\S]*?<\\/p>\\s*)?)(<th data-translate="price-item-002">Ціна от, грн\\.<\\/th>|<th data-translate="price-item-002">Цена от, грн\\.<\\/th>)`,
      "i"
    );
    if (blockRe.test(h)) {
      h = h.replace(
        blockRe,
        `$1\n          <table>\n            <thead>\n              <tr>\n                <th data-translate="price-item-001">Наименование услуг:</th>\n                $2`
      );
      console.log("repaired table start", id);
    } else {
      // try without Ukrainian
      const blockRe2 = new RegExp(
        `(<h2 id="${id}"[\\s\\S]*?<\\/h2>\\s*(?:<p class="price-section-link">[\\s\\S]*?<\\/p>\\s*)?)(<th data-translate="price-item-002">)`,
        "i"
      );
      if (blockRe2.test(h)) {
        h = h.replace(
          blockRe2,
          `$1\n          <table>\n            <thead>\n              <tr>\n                <th data-translate="price-item-001">Наименование услуг:</th>\n                $2`
        );
        console.log("repaired table start", id);
      } else {
        console.log("no repair needed/matched", id);
      }
    }
  }

  fs.writeFileSync(fp, h);
}

// Soften transmissiya keywords (no "ремонт АКПП" as main claim)
{
  const fp = path.join(root, "remont-transmissii.html");
  let h = fs.readFileSync(fp, "utf8");
  h = h.replace(
    /content="ремонт КПП Павлоград, ремонт сцепления Павлоград, ремонт АКПП Павлоград, замена ШРУСа Павлоград, ремонт трансмиссии Павлоград"/,
    'content="ремонт КПП Павлоград, ремонт сцепления Павлоград, замена ШРУСа Павлоград, ремонт трансмиссии Павлоград, замена маховика Павлоград"'
  );
  h = h.replace(
    /"description": "Ремонт трансмиссии в Павлограде: МКПП и АКПП, замена сцепления, ШРУСов, приводов, раздаточных коробок\. Диагностика шумов и вибраций — СТО Каскад\."/,
    '"description": "Ремонт трансмиссии в Павлограде: МКПП, замена сцепления, ШРУСов, приводов, раздаточных коробок. Диагностика шумов и вибраций — СТО Каскад."'
  );
  fs.writeFileSync(fp, h);
  console.log("transmissiya meta softened");
}
