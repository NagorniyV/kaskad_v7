function sanitizePartialHtml(html) {
  return html
    .replace(/<!--\s*Code injected by live-server\s*-->\s*<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(?:body|html)>\s*$/i, "")
    .trim();
}

async function loadPartial(containerId, fileName) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const basePath = window.__BASE_PATH__ || "/";

  try {
    const response = await fetch(`${basePath}src/includes/${fileName}`);
    if (!response.ok) {
      throw new Error(`${fileName} not loaded: ${response.status}`);
    }

    const html = sanitizePartialHtml(await response.text());
    const template = document.createElement("template");
    template.innerHTML = html;
    container.replaceWith(template.content.cloneNode(true));
    return true;
  } catch (error) {
    console.error(`Include error (${fileName}):`, error);
    return false;
  }
}

function isPartsPage() {
  const leadType =
    document.body?.dataset?.leadType?.trim().toLowerCase() || "";
  if (leadType === "razborka" || leadType === "parts") return true;

  const path = (window.location.pathname || "").toLowerCase().replace(/\\/g, "/");
  return (
    path.includes("/razborka/") ||
    path.endsWith("/razborka") ||
    path.includes("/razborka.html") ||
    path.includes("zapchasti.html") ||
    path.endsWith("/zapchasti")
  );
}

function initHeaderMenu() {
  const header = document.querySelector(".header");
  if (!header) return;

  const burger = header.querySelector(".burger-menu");
  const nav = header.querySelector(".nav");
  const mobileBreakpoint = 992;

  const isMobile = () => window.innerWidth <= mobileBreakpoint;

  function closeSubmenuBranch(item) {
    if (!item) return;
    item.classList.remove("open");
    item.querySelectorAll(".has-submenu.open").forEach((sub) => {
      sub.classList.remove("open");
    });
  }

  function closeAllSubmenus() {
    header.querySelectorAll(".has-submenu.open").forEach((item) => {
      item.classList.remove("open");
    });
  }

  function closeMenu() {
    burger?.classList.remove("active");
    nav?.classList.remove("active");
    closeAllSubmenus();
  }

  function toggleCurrentSubmenu(currentItem) {
    if (!currentItem) return;

    const parentList = currentItem.parentElement;
    if (parentList) {
      const siblings = parentList.querySelectorAll(":scope > .has-submenu");
      siblings.forEach((item) => {
        if (item !== currentItem) {
          closeSubmenuBranch(item);
        }
      });
    }

    currentItem.classList.toggle("open");
  }

  burger?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    burger.classList.toggle("active");
    nav?.classList.toggle("active");
  });

  header.querySelectorAll(".menu-toggle").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!isMobile()) return;

      e.preventDefault();
      e.stopPropagation();

      const currentItem = button.closest(".has-submenu");
      toggleCurrentSubmenu(currentItem);
    });
  });

  document.addEventListener("click", (e) => {
    if (!isMobile()) return;

    if (!e.target.closest(".header")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      closeMenu();
    }
  });
}

function isRazborkaSectionPage() {
  const path = (window.location.pathname || "").toLowerCase();
  return path.includes("/razborka/") || path.endsWith("/razborka");
}

const BREND_TOPICS = {
  uslugi: "услуги автосервиса",
  dvigatel: "ремонт двигателя",
  hodovoy: "ремонт ходовой части",
  elektrika: "ремонт автоэлектрики",
  tormoz: "ремонт тормозной системы",
  transmissiya: "ремонт трансмиссии",
  to: "техническое обслуживание авто",
  diagnostika: "диагностика автомобиля",
  kondi: "обслуживание автокондиционеров",
  gbo: "установка и сервис ГБО",
  ohlazhdenie: "ремонт системы охлаждения",
  evakuator: "эвакуатор и доставка на СТО",
  zapchasti: "подбор автозапчастей",
  ceny: "цены на услуги СТО",
  razborka: "контрактные запчасти с разборки",
};

const BREND_TOPIC_UK = {
  uslugi: "послуги автосервісу",
  dvigatel: "ремонт двигуна",
  hodovoy: "ремонт ходової частини",
  elektrika: "ремонт автоелектрики",
  tormoz: "ремонт гальмівної системи",
  transmissiya: "ремонт трансмісії",
  to: "технічне обслуговування авто",
  diagnostika: "діагностика автомобіля",
  kondi: "обслуговування автокондиціонерів",
  gbo: "встановлення та сервіс ГБО",
  ohlazhdenie: "ремонт системи охолодження",
  evakuator: "евакуатор і доставка на СТО",
  zapchasti: "підбір автозапчастин",
  ceny: "ціни на послуги СТО",
  razborka: "контрактні запчастини з розбірки",
};

function brandLabel(slug) {
  const map = {
    "alfa-romeo": "Alfa Romeo",
    "land-rover": "Land Rover",
    mercedes: "Mercedes-Benz",
    ssangyong: "SsangYong",
    volkswagen: "Volkswagen",
  };
  if (map[slug]) return map[slug];
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function applyBrendAlts(topicKey) {
  const topicRu = BREND_TOPICS[topicKey] || BREND_TOPICS.uslugi;
  const topicUk = BREND_TOPIC_UK[topicKey] || BREND_TOPIC_UK.uslugi;
  const lang =
    localStorage.getItem("language") === "uk" ||
    document.documentElement.lang === "uk"
      ? "uk"
      : "ru";
  const topic = lang === "uk" ? topicUk : topicRu;
  const suffix = lang === "uk" ? "у Павлограді | СТО Каскад" : "в Павлограде | СТО Каскад";

  document.querySelectorAll(".brend-section img[data-brand]").forEach((img) => {
    const brand = brandLabel(img.dataset.brand);
    img.alt = `${brand} — ${topic} ${suffix}`;
  });
}

async function loadBrendPartial() {
  const container = document.getElementById("site-brend");
  if (!container) return null;
  const topic = container.dataset.brendTopic || "uslugi";
  const loaded = await loadPartial("site-brend", "brend.inc");
  if (loaded) {
    const section = document.querySelector(".brend-section");
    if (section) section.dataset.brendTopic = topic;
    applyBrendAlts(topic);
  }
  return loaded;
}

const SERVICES_VARIANT_COPY = {
  full: {
    titleKey: "services-title",
    subtitleKey: "services-subtitle",
    title: "Услуги и цены",
    subtitle: "Лучшее соотношение цена - качество в нашем городе!",
    kinds: null,
  },
  services: {
    titleKey: "parts-related-title",
    subtitleKey: "parts-related-subtitle",
    title: "Связанные услуги СТО",
    subtitle: "Ремонт и обслуживание — страницы услуг автосервиса",
    kinds: new Set(["service"]),
  },
  parts: {
    titleKey: "parts-cards-title",
    subtitleKey: "parts-cards-subtitle",
    title: "Запчасти для ремонта",
    subtitle: "Подбор новых и б/у деталей под диагностику и ремонт на СТО",
    kinds: new Set(["parts"]),
  },
};

function applyServicesVariant(section, variant) {
  const config = SERVICES_VARIANT_COPY[variant] || SERVICES_VARIANT_COPY.full;
  const title = section.querySelector(".services-title");
  const subtitle = section.querySelector(".services-subtitle");

  if (title) {
    title.setAttribute("data-translate", config.titleKey);
    title.textContent = config.title;
  }
  if (subtitle) {
    subtitle.setAttribute("data-translate", config.subtitleKey);
    subtitle.textContent = config.subtitle;
  }

  if (config.kinds) {
    section.querySelectorAll(".service-card[data-card-kind]").forEach((card) => {
      const kind = card.getAttribute("data-card-kind");
      if (!config.kinds.has(kind)) card.remove();
    });
  }
}

async function loadServicesPartial() {
  const container = document.getElementById("site-services");
  if (!container) return null;
  const variant = (container.dataset.services || "full").toLowerCase();
  const loaded = await loadPartial("site-services", "services-section.inc");
  if (!loaded) return false;
  const section = document.querySelector(".services-section");
  if (section) applyServicesVariant(section, variant);
  return true;
}

async function loadPartials() {
  const footerFile = isRazborkaSectionPage()
    ? "footer-razborka.inc"
    : "footer.inc";
  const partsPage = isPartsPage();
  const callbackFile = partsPage ? "callback-parts.inc" : "callback.inc";
  const widgetsFile = partsPage
    ? "callback-widgets-parts.inc"
    : "callback-widgets.inc";

  await Promise.all([
    loadPartial("site-header", "header.inc"),
    loadPartial("site-callback", callbackFile),
    loadPartial("site-callback-widgets", widgetsFile),
    loadPartial("site-benefits", "benefits.inc"),
    loadBrendPartial(),
    loadServicesPartial(),
    loadPartial("site-footer", footerFile),
  ]);

  initHeaderMenu();

  // Parts forms: sync lead type from body
  const bodyLead =
    document.body?.dataset?.leadType?.trim().toLowerCase() || "";
  document.querySelectorAll("#callbackForm, #modalForm").forEach((form) => {
    if (bodyLead) form.dataset.leadType = bodyLead;
  });

  if (typeof window.initLanguageSwitcher === "function") {
    window.initLanguageSwitcher();
  }

  document.dispatchEvent(new CustomEvent("partials:loaded"));
}

document.addEventListener("DOMContentLoaded", loadPartials);

document.addEventListener("language:changed", () => {
  const topic =
    document.querySelector(".brend-section")?.dataset?.brendTopic || "uslugi";
  applyBrendAlts(topic);
});
