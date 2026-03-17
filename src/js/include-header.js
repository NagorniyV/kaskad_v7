async function loadHeader() {
  const headerContainer = document.getElementById("site-header");
  if (!headerContainer) return;

  try {
    const response = await fetch("/src/includes/header.html");

    if (!response.ok) {
      throw new Error(`Failed to load header: ${response.status}`);
    }

    const html = await response.text();
    headerContainer.innerHTML = html;

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