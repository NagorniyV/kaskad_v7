function loadTranslations(lang) {
  const basePath = window.__BASE_PATH__ || "/";
  document.documentElement.lang = lang === "uk" ? "uk" : "ru";
  fetch(`${basePath}locales/${lang}.json`)
    .then((response) => response.json())
    .then((translations) => {
      document.querySelectorAll("[data-translate]").forEach((el) => {
        const key = el.getAttribute("data-translate");
        if (translations[key]) el.textContent = translations[key];
      });

      document.querySelectorAll("[data-translate-html]").forEach((el) => {
        const key = el.getAttribute("data-translate-html");
        if (translations[key]) el.innerHTML = translations[key];
      });

      document.querySelectorAll("[data-translate-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-translate-placeholder");
        if (translations[key]) el.placeholder = translations[key];
      });

      document.querySelectorAll("[data-translate-aria]").forEach((el) => {
        const key = el.getAttribute("data-translate-aria");
        if (translations[key]) el.setAttribute("aria-label", translations[key]);
      });

      document.querySelectorAll("[data-translate-document]").forEach((el) => {
        const key = el.getAttribute("data-translate-document");
        if (translations[key]) {
          document.title = translations[key];
          el.textContent = translations[key];
        }
      });

      document.querySelectorAll("[data-translate-content]").forEach((el) => {
        const key = el.getAttribute("data-translate-content");
        if (translations[key]) el.setAttribute("content", translations[key]);
      });

      document.dispatchEvent(
        new CustomEvent("language:changed", { detail: { lang } })
      );
    })
    .catch((error) => console.error("Ошибка загрузки переводов:", error));
}

function initLanguageSwitcher() {
  if (!localStorage.getItem("language")) {
    localStorage.setItem("language", "uk");
  }

  const currentLang = localStorage.getItem("language");
  const langButtons = document.querySelectorAll(".lang-btn");

  langButtons.forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  langButtons.forEach((btn) => {
    btn.onclick = function () {
      const selectedLang = this.dataset.lang;
      langButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      localStorage.setItem("language", selectedLang);
      loadTranslations(selectedLang);
    };
  });

  loadTranslations(currentLang);
}

window.initLanguageSwitcher = initLanguageSwitcher;

document.addEventListener("DOMContentLoaded", initLanguageSwitcher);
