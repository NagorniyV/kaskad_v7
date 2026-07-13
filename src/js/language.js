function loadTranslations(lang) {
  const basePath = window.__BASE_PATH__ || "./";
  fetch(`${basePath}locales/${lang}.json`)
    .then((response) => response.json())
    .then((translations) => {
      document.querySelectorAll("[data-translate]").forEach((el) => {
        const key = el.getAttribute("data-translate");
        if (translations[key]) el.textContent = translations[key];
      });

      document.querySelectorAll("[data-translate-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-translate-placeholder");
        if (translations[key]) el.placeholder = translations[key];
      });
    })
    .catch((error) => console.error("Ошибка загрузки переводов:", error));
}

function initLanguageSwitcher() {
  if (!localStorage.getItem("language")) {
    localStorage.setItem("language", "ru");
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
