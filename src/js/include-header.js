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
  const burger = document.querySelector(".burger-menu");
  const nav = document.querySelector(".nav");
  const submenuToggles = document.querySelectorAll(".menu-toggle");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  submenuToggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const parent = button.closest(".has-submenu");
      if (parent) {
        parent.classList.toggle("submenu-open");
      }
    });
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