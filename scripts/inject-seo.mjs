import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const seoDir = path.join(__dirname, "seo-data");

const START = "<!-- seo-article:start -->";
const END = "<!-- seo-article:end -->";

const PAGE_MAP = {
  dvigatel: {
    file: "remont-dvigatelya.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  hodovoy: {
    file: "remont-hodovoy.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  elektriki: {
    file: "remont-elektriki.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  tormoz: {
    file: "remont-tormoznoi-sistemy.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  transmissii: {
    file: "remont-transmissii.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  to: {
    file: "tehnicheskoe-obsluzhivanie.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  diagnostika: {
    file: "diagnostika-avto.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  kondicionery: {
    file: "avtokondicionery.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  gbo: {
    file: "ustanovka-gbo.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  uslugi: {
    file: "uslugi.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  zapchasti: {
    file: "zapchasti.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  evakuator: {
    file: "evakuator.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  ohlazhdenie: {
    file: "sistema-ohlazhdeniya.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
  },
  index: {
    file: "index.html",
    marker: '<div id="site-callback"></div>',
  },
  razborka: {
    file: "razborka/index.html",
    marker: '          <div id="site-callback-widgets"></div>',
    insertInsideContainer: true,
    replaceExistingMain: true,
  },
};

function loadSeoData() {
  const data = {};
  for (const file of fs.readdirSync(seoDir)) {
    if (!file.endsWith(".json")) continue;
    const chunk = JSON.parse(fs.readFileSync(path.join(seoDir, file), "utf8"));
    Object.assign(data, chunk);
  }
  return data;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(pageId, ru) {
  const lines = [];
  lines.push(START);
  lines.push('        <section class="main-content-section seo-article">');
  lines.push('          <div class="main-content-div">');
  lines.push('            <div class="main-content">');
  lines.push(
    `              <h2 data-translate="seo-${pageId}-h2">${escapeHtml(ru.h2)}</h2>`
  );

  ru.sections.forEach((section, si) => {
    const s = si + 1;
    lines.push(
      `              <h3 data-translate="seo-${pageId}-h3-${s}">${escapeHtml(section.h3)}</h3>`
    );
    section.paragraphs.forEach((p, pi) => {
      const n = pi + 1;
      lines.push(
        `              <p data-translate="seo-${pageId}-p-${s}-${n}">${escapeHtml(p)}</p>`
      );
    });
  });

  lines.push("            </div>");
  lines.push("          </div>");
  lines.push("        </section>");
  lines.push(END);
  return lines.join("\n");
}

function collectLocaleKeys(pageId, content) {
  const ru = {};
  const uk = {};
  ru[`seo-${pageId}-h2`] = content.ru.h2;
  uk[`seo-${pageId}-h2`] = content.uk.h2;

  content.ru.sections.forEach((section, si) => {
    const s = si + 1;
    ru[`seo-${pageId}-h3-${s}`] = section.h3;
    uk[`seo-${pageId}-h3-${s}`] = content.uk.sections[si].h3;
    section.paragraphs.forEach((p, pi) => {
      const n = pi + 1;
      ru[`seo-${pageId}-p-${s}-${n}`] = p;
      uk[`seo-${pageId}-p-${s}-${n}`] = content.uk.sections[si].paragraphs[pi];
    });
  });

  return { ru, uk };
}

function stripExistingBlock(html) {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start !== -1 && end !== -1 && end > start) {
    return html.slice(0, start) + html.slice(end + END.length);
  }
  return html;
}

function injectBeforeMarker(html, marker, block) {
  const idx = html.indexOf(marker);
  if (idx === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }
  return html.slice(0, idx) + block + "\n        " + html.slice(idx);
}

function wordCount(content) {
  const text = content.ru.sections
    .flatMap((s) => s.paragraphs)
    .join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function main() {
  const seo = loadSeoData();
  const localeRu = JSON.parse(
    fs.readFileSync(path.join(root, "locales", "ru.json"), "utf8")
  );
  const localeUk = JSON.parse(
    fs.readFileSync(path.join(root, "locales", "uk.json"), "utf8")
  );

  // Remove old seo-* keys to avoid stale leftovers
  for (const key of Object.keys(localeRu)) {
    if (key.startsWith("seo-")) delete localeRu[key];
  }
  for (const key of Object.keys(localeUk)) {
    if (key.startsWith("seo-")) delete localeUk[key];
  }

  const report = [];

  for (const [pageId, meta] of Object.entries(PAGE_MAP)) {
    const content = seo[pageId];
    if (!content) {
      console.error(`Missing SEO data for ${pageId}`);
      process.exitCode = 1;
      continue;
    }
    if (!content.ru?.sections?.length || !content.uk?.sections?.length) {
      console.error(`Invalid structure for ${pageId}`);
      process.exitCode = 1;
      continue;
    }
    if (content.ru.sections.length !== content.uk.sections.length) {
      console.error(`RU/UK section count mismatch for ${pageId}`);
      process.exitCode = 1;
      continue;
    }

    const keys = collectLocaleKeys(pageId, content);
    Object.assign(localeRu, keys.ru);
    Object.assign(localeUk, keys.uk);

    const filePath = path.join(root, meta.file);
    let html = fs.readFileSync(filePath, "utf8");
    html = stripExistingBlock(html);

    // For razborka: expand by replacing the short main-content-section before benefits
    if (meta.replaceExistingMain) {
      const re =
        /<section class="main-content-section">[\s\S]*?<\/section>\s*(?=<section class="benefits-section">)/;
      if (re.test(html)) {
        html = html.replace(re, "");
      }
    }

    const block = buildHtml(pageId, content.ru);
    html = injectBeforeMarker(html, meta.marker, block);
    fs.writeFileSync(filePath, html, "utf8");

    const wc = wordCount(content);
    report.push({ pageId, file: meta.file, wordsRu: wc, keys: Object.keys(keys.ru).length });
    console.log(`OK ${pageId}: ${wc} RU words, ${Object.keys(keys.ru).length} keys → ${meta.file}`);
  }

  fs.writeFileSync(
    path.join(root, "locales", "ru.json"),
    JSON.stringify(localeRu, null, 4) + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(root, "locales", "uk.json"),
    JSON.stringify(localeUk, null, 4) + "\n",
    "utf8"
  );

  console.log("\nLocales updated.");
  console.log(JSON.stringify(report, null, 2));
}

main();
