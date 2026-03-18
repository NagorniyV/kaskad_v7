async function loadHeader() {
  const container = document.getElementById("site-header");
  if (!container) return;

  const basePath = window.__BASE_PATH__ || "/";

  try {
    const response = await fetch(`${basePath}src/includes/header.html`);
    if (!response.ok) {
      throw new Error(`Header not loaded: ${response.status}`);
    }

    container.innerHTML = await response.text();
    initHeaderMenu();
  } catch (error) {
    console.error("Header include error:", error);
  }
}

async function loadHeader() {
  const container = document.getElementById("site-header");
  if (!container) return;

  const basePath = window.__BASE_PATH__ || "/";

  try {
    const response = await fetch(`${basePath}src/includes/header.html`);
    if (!response.ok) {
      throw new Error(`Header not loaded: ${response.status}`);
    }

    container.innerHTML = await response.text();
    initHeaderMenu();
  } catch (error) {
    console.error("Header include error:", error);
  }
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

  const clickableRows = header.querySelectorAll(
    ".has-submenu > .nav-link-row, .has-submenu > .submenu-link-row"
  );

  clickableRows.forEach((row) => {
    row.addEventListener("click", (e) => {
      if (!isMobile()) return;

      e.preventDefault();
      e.stopPropagation();

      const currentItem = row.closest(".has-submenu");
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

document.addEventListener("DOMContentLoaded", loadHeader);

// бургер меню 

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger-menu");
  const nav = document.querySelector(".nav");
  const mobileBreakpoint = 992;

  function isMobile() {
    return window.innerWidth <= mobileBreakpoint;
  }

  function closeMenu() {
    burger?.classList.remove("active");
    nav?.classList.remove("active");
    document.querySelectorAll(".has-submenu.open").forEach((item) => {
      item.classList.remove("open");
    });
  }

  burger?.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".menu-toggle");

    if (toggleBtn && isMobile()) {
      e.preventDefault();

      const currentItem = toggleBtn.closest(".has-submenu");
      const siblings = currentItem.parentElement.querySelectorAll(":scope > .has-submenu");

      siblings.forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove("open");
        }
      });

      currentItem.classList.toggle("open");
      return;
    }

    if (!e.target.closest(".header") && isMobile()) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      closeMenu();
    }
  });
});