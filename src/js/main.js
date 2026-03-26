//кнопка Піднятись в гору

document.getElementById('back-to-top').addEventListener('click', function(e) {
  e.preventDefault(); // Отменяем стандартное поведение ссылки
  
  // Находим элемент header
  const headerElement = document.getElementById('header');
  
  // Плавный скролл до header
  if (headerElement) {
    headerElement.scrollIntoView({
      behavior: 'smooth'
    });
  }
});

// КНОПКИ ПОЯВЛЯЮТСЯ ПОСЛЕ ПРОКРУТКИ

document.addEventListener("DOMContentLoaded", function() {
  const social = document.querySelector(".social-fixed");
  const toHome = document.querySelector(".to-home");

  window.addEventListener("scroll", function() {
    if (window.innerWidth <= 1024) {
      if (window.scrollY > 100) { // при прокрутке более 100px
        social.classList.add("show");
        toHome.classList.add("show");
      } else {
        social.classList.remove("show");
        toHome.classList.remove("show");
      }
    }
  });
});

//КОЛБЕК
document.addEventListener("DOMContentLoaded", () => {
  const botToken = "7401776138:AAEIszjxs4_-9alGK01THnbG9VHvAGUrEwA";
  const adminChatIds = ["398501551", "5370980969", "5235424421"];

  const modal = document.getElementById("callbackModal");
  const modalCloseBtn = document.querySelector(".modal-close");

  const callbackForm = document.getElementById("callbackForm");
  const modalForm = document.getElementById("modalForm");
  const responseMessage = document.getElementById("responseMessage");

  const fixedCallbackBtn = document.getElementById("fixedCallbackBtn");
  const heroButtons = document.querySelectorAll(".details-hero-btn");

  let autoExpandDisabled = false;
  let autoExpandTimer = null;

  // ===== УТИЛИТЫ =====
  const getValue = (id) => document.getElementById(id)?.value.trim() || "";

  function isRazborkaForm(form) {
    return (
      form?.dataset.leadType === "razborka" ||
      document.body?.dataset.leadType === "razborka"
    );
  }

  function formatPhone(value) {
    let cleaned = value.replace(/\D/g, "");

    if (!cleaned.startsWith("38")) {
      cleaned = "38" + cleaned;
    }

    cleaned = cleaned.substring(0, 12);

    let formatted = "+38";
    if (cleaned.length > 2) formatted += " " + cleaned.substring(2, 5);
    if (cleaned.length > 5) formatted += " " + cleaned.substring(5, 8);
    if (cleaned.length > 8) formatted += " " + cleaned.substring(8, 12);

    return formatted;
  }

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.startsWith("38") && digits.length === 12;
  }

  function initPhoneInput(input) {
    if (!input) return;

    input.addEventListener("focus", function () {
      if (!this.value.startsWith("+38")) {
        this.value = "+38";
      }
    });

    input.addEventListener("input", function () {
      this.value = formatPhone(this.value);
    });

    input.addEventListener("blur", function () {
      if (this.value && !isValidPhone(this.value)) {
        this.setCustomValidity(
          "Введіть коректний номер телефону у форматі +38 XXX XXX XXXX"
        );
      } else {
        this.setCustomValidity("");
      }
    });
  }

  function showResponse(message, type = "success") {
    if (!responseMessage) return;

    responseMessage.textContent = message;
    responseMessage.className = `response-message ${type}`;
    responseMessage.style.display = "block";

    if (type === "success") {
      setTimeout(() => {
        responseMessage.style.display = "none";
      }, 7000);
    }
  }

  async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    for (const chatId of adminChatIds) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram HTTP error: ${response.status}`);
      }
    }
  }

  function buildMessage({ form, source, name, phone, car, vin, part, message }) {
    const isRazborka = isRazborkaForm(form);
    const lines = [];

    lines.push(
      isRazborka
        ? "🚗 РОЗБІРКА — нова заявка на зворотний дзвінок"
        : "📩 Нова заявка на зворотний дзвінок"
    );

    lines.push(`Джерело: ${source}`);
    lines.push(`Сторінка: ${window.location.href}`);
    lines.push("");

    if (name) lines.push(`▪ Ім’я: ${name}`);
    lines.push(`▪ Телефон: ${phone}`);

    if (isRazborka) {
      lines.push(`▪ Авто: ${car || "не вказано"}`);
      lines.push(`▪ Потрібна запчастина: ${part || "не вказано"}`);
      lines.push(`▪ VIN: ${vin || "не вказано"}`);
    } else {
      lines.push(`▪ Повідомлення: ${message || car || "не вказано"}`);
    }

    return lines.join("\n");
  }

  // ===== МОДАЛКА =====
  function openModal() {
    if (!modal) return;
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  // ===== ФИКСИРОВАННАЯ КНОПКА =====
  function expandFixedButton() {
    if (!fixedCallbackBtn || autoExpandDisabled) return;
    fixedCallbackBtn.classList.add("is-expanded");
  }

  function collapseFixedButton() {
    if (!fixedCallbackBtn) return;
    fixedCallbackBtn.classList.remove("is-expanded");
  }

  if (fixedCallbackBtn) {
    autoExpandTimer = setTimeout(() => {
      expandFixedButton();
    }, 5000);

    fixedCallbackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      collapseFixedButton();
      openModal();
    });
  }

  // ===== ВСЕ HERO-КНОПКИ =====
  heroButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modalCloseBtn?.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ===== ИНИЦИАЛИЗАЦИЯ ТЕЛЕФОНОВ =====
  initPhoneInput(document.getElementById("phoneInput"));
  initPhoneInput(document.getElementById("modalPhone"));

  // ===== ОБЫЧНАЯ ФОРМА =====
  if (callbackForm) {
    callbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = getValue("nameInput");
      const phone = getValue("phoneInput");
      const car = getValue("carInput");
      const part = getValue("partInput");
      const legacyMessage = getValue("messageInput");

      if (!isValidPhone(phone)) {
        showResponse(
          "Введіть коректний номер телефону у форматі +38 XXX XXX XXXX",
          "error"
        );
        return;
      }

      const telegramMessage = buildMessage({
        form: callbackForm,
        source: "Форма на сторінці",
        name,
        phone,
        car,
        part,
        vin: "",
        message: legacyMessage
      });

      try {
        await sendToTelegram(telegramMessage);
        showResponse(
          "Дякуємо! Ми вам зателефонуємо найближчим часом.",
          "success"
        );
        callbackForm.reset();
      } catch (error) {
        console.error("Помилка відправки форми:", error);
        showResponse(
          "Помилка відправки. Спробуйте ще раз або зателефонуйте нам.",
          "error"
        );
      }
    });
  }

  // ===== МОДАЛЬНАЯ ФОРМА =====
  if (modalForm) {
    modalForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = getValue("modalName");
      const phone = getValue("modalPhone");
      const vin = getValue("modalVin");
      const car = getValue("modalCar");
      const part = getValue("modalPart");

      if (!isValidPhone(phone)) {
        alert("Введіть коректний номер телефону у форматі +38 XXX XXX XXXX");
        return;
      }

      const telegramMessage = buildMessage({
        form: modalForm,
        source: "Модальне вікно",
        name,
        phone,
        car,
        part,
        vin,
        message: ""
      });

      try {
        await sendToTelegram(telegramMessage);

        autoExpandDisabled = true;
        clearTimeout(autoExpandTimer);
        collapseFixedButton();

        alert("✅ Дякуємо! Ми вам зателефонуємо найближчим часом.");
        modalForm.reset();
        closeModal();
      } catch (error) {
        console.error("Помилка відправки модальної форми:", error);
        alert("⚠ Сталася помилка. Спробуйте ще раз або зателефонуйте нам.");
      }
    });
  }
});

//Запчасти страница с машиной, ее фото

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-kaskad-rzbk-slider]");
  if (!slider) return;

  const slides = slider.querySelectorAll(".kaskad-rzbk-vehicle-slide");
  const prevBtn = slider.querySelector(".kaskad-rzbk-vehicle-slider-btn--prev");
  const nextBtn = slider.querySelector(".kaskad-rzbk-vehicle-slider-btn--next");
  const dotsWrap = slider.querySelector(".kaskad-rzbk-vehicle-slider-dots");

  let currentIndex = 0;
  let startX = 0;
  let endX = 0;

  function renderDots() {
    dotsWrap.innerHTML = "";

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "kaskad-rzbk-vehicle-slider-dot";
      if (index === currentIndex) {
        dot.classList.add("kaskad-rzbk-vehicle-slider-dot--active");
      }

      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });

      dotsWrap.appendChild(dot);
    });
  }

  function updateSlider() {
    slides.forEach((slide, index) => {
      slide.classList.toggle(
        "kaskad-rzbk-vehicle-slide--active",
        index === currentIndex
      );
    });

    const dots = dotsWrap.querySelectorAll(".kaskad-rzbk-vehicle-slider-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "kaskad-rzbk-vehicle-slider-dot--active",
        index === currentIndex
      );
    });
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  prevBtn?.addEventListener("click", showPrev);
  nextBtn?.addEventListener("click", showNext);

  slider.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  });

  renderDots();
  updateSlider();
});