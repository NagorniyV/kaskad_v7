async function loadPartial(containerId, fileName) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const basePath = window.__BASE_PATH__ || "/";

  try {
    const response = await fetch(`${basePath}src/includes/${fileName}`);
    if (!response.ok) {
      throw new Error(`${fileName} not loaded: ${response.status}`);
    }

    const template = document.createElement("template");
    template.innerHTML = (await response.text()).trim();
    container.replaceWith(template.content.cloneNode(true));
    return true;
  } catch (error) {
    console.error(`Include error (${fileName}):`, error);
    return false;
  }
}

function applyRazborkaFields() {
  const leadType =
    document.body?.dataset?.leadType?.trim().toLowerCase() || "";
  const isRazborka = leadType === "razborka";

  document.querySelectorAll("[data-razborka-only]").forEach((el) => {
    if (isRazborka) {
      el.hidden = false;
      el.removeAttribute("hidden");
    } else {
      el.hidden = true;
      if (el.matches("input, textarea, select")) {
        el.removeAttribute("required");
      }
    }
  });

  if (!isRazborka) return;

  document
    .querySelectorAll("#callbackForm, #modalForm")
    .forEach((form) => {
      form.dataset.leadType = "razborka";
    });
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

async function loadPartials() {
  await Promise.all([
    loadPartial("site-header", "header.html"),
    loadPartial("site-callback", "callback.html"),
    loadPartial("site-callback-widgets", "callback-widgets.html"),
    loadPartial("site-footer", "footer.html"),
  ]);

  applyRazborkaFields();
  initHeaderMenu();

  if (typeof window.initLanguageSwitcher === "function") {
    window.initLanguageSwitcher();
  }

  document.dispatchEvent(new CustomEvent("partials:loaded"));
}

document.addEventListener("DOMContentLoaded", loadPartials);
