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

// КОЛБЕК — универсальный JS для всех страниц
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // НАСТРОЙКИ
  // =========================
  const botToken = "7401776138:AAEIszjxs4_-9alGK01THnbG9VHvAGUrEwA";
const adminChatIds = ["398501551", "5370980969", "5235424421"];

  // =========================
  // ЭЛЕМЕНТЫ
  // =========================
  const modal = document.getElementById("callbackModal");
  const modalCloseBtn = document.querySelector(".modal-close");

  const callbackForm = document.getElementById("callbackForm");
  const modalForm = document.getElementById("modalForm");

  const fixedCallbackBtn = document.getElementById("fixedCallbackBtn");
  const heroButtons = document.querySelectorAll(".details-hero-btn");

  let autoExpandDisabled = false;
  let autoExpandTimer = null;

  // =========================
  // УТИЛИТЫ
  // =========================
  function getLeadType(form) {
    return (
      form?.dataset?.leadType?.trim().toLowerCase() ||
      document.body?.dataset?.leadType?.trim().toLowerCase() ||
      ""
    );
  }

  function isRazborkaForm(form) {
    return getLeadType(form) === "razborka";
  }

  function getLeadHeading(form) {
    const leadType = getLeadType(form);

    const headings = {
      razborka: "🚗 РОЗБІРКА — нова заявка на зворотний дзвінок",
      service: "🛠 СЕРВІС — нова заявка на зворотний дзвінок",
      hodovka: "🛞 ХОДОВА — нова заявка на зворотний дзвінок",
      diagnostics: "🔍 ДІАГНОСТИКА — нова заявка на зворотний дзвінок",
      gbo: "⛽ ГБО — нова заявка на зворотний дзвінок",
      cooling: "❄️ СИСТЕМА ОХОЛОДЖЕННЯ — нова заявка на зворотний дзвінок",
      evacuator: "🚚 ЕВАКУАТОР — нова заявка на зворотний дзвінок"
    };

    return headings[leadType] || "📩 Нова заявка на зворотний дзвінок";
  }

  function getFormValue(form, selectors = []) {
    for (const selector of selectors) {
      const field = form?.querySelector(selector);
      if (field && typeof field.value === "string") {
        return field.value.trim();
      }
    }
    return "";
  }

  function formatPhone(value) {
    let cleaned = String(value || "").replace(/\D/g, "");

    if (!cleaned) return "";
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
    const digits = String(value || "").replace(/\D/g, "");
    return digits.startsWith("38") && digits.length === 12;
  }

  function initPhoneInput(input) {
    if (!input || input.dataset.phoneInitialized === "true") return;

    input.dataset.phoneInitialized = "true";

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

  function initPhoneInputs(scope = document) {
    const phoneInputs = scope.querySelectorAll(
      'input[type="tel"], input[name="phone"], #phoneInput, #modalPhone'
    );
    phoneInputs.forEach(initPhoneInput);
  }

  function getResponseMessageElement(form) {
    return (
      form?.parentElement?.querySelector(".response-message") ||
      document.getElementById("responseMessage")
    );
  }

  function showResponse(form, message, type = "success") {
    const responseMessage = getResponseMessageElement(form);
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

  function collectFormData(form, source) {
    const leadType = getLeadType(form);

    const name = getFormValue(form, [
      '[name="name"]',
      "#nameInput",
      "#modalName"
    ]);

    const phone = getFormValue(form, [
      '[name="phone"]',
      "#phoneInput",
      "#modalPhone"
    ]);

    const vin = getFormValue(form, [
      '[name="vin"]',
      "#vinInput",
      "#modalVin"
    ]);

    let car = getFormValue(form, [
      '[name="car"]',
      '[name="carModel"]',
      "#carInput",
      "#modalCar"
    ]);

    const part = getFormValue(form, [
      '[name="part"]',
      "#partInput",
      "#modalPart"
    ]);

    const rawMessage = getFormValue(form, [
      '[name="message"]',
      '[name="comment"]',
      "#messageInput",
      "#modalMessage",
      "textarea"
    ]);

    // Фолбэк для старых страниц разборки,
    // где вместо отдельного поля авто использовалось одно текстовое поле
    if (!car && leadType === "razborka" && rawMessage) {
      car = rawMessage;
    }

    const message = rawMessage && rawMessage !== car ? rawMessage : "";

    return {
      form,
      source,
      name,
      phone,
      vin,
      car,
      part,
      message
    };
  }

  function buildMessage({ form, source, name, phone, car, vin, part, message }) {
    const isRazborka = isRazborkaForm(form);
    const lines = [];

    lines.push(getLeadHeading(form));
    lines.push(`Джерело: ${source}`);
    lines.push(`Сторінка: ${window.location.href}`);
    lines.push("");

    if (name) lines.push(`▪ Ім’я: ${name}`);
    if (phone) lines.push(`▪ Телефон: ${phone}`);
    if (car) lines.push(`▪ Авто: ${car}`);
    if (part) lines.push(`▪ Потрібна запчастина: ${part}`);
    if (vin) lines.push(`▪ VIN: ${vin}`);

    if (!isRazborka && message) {
      lines.push(`▪ Повідомлення: ${message}`);
    }

    return lines.join("\n");
  }

  async function handleFormSubmit(form, source, options = {}) {
    const { useAlert = false, onSuccess = null } = options;

    const formData = collectFormData(form, source);

    if (!isValidPhone(formData.phone)) {
      const errorText =
        "Введіть коректний номер телефону у форматі +38 XXX XXX XXXX";

      if (useAlert) {
        alert(errorText);
      } else {
        showResponse(form, errorText, "error");
      }
      return;
    }

    const telegramMessage = buildMessage(formData);

    try {
      await sendToTelegram(telegramMessage);

      if (useAlert) {
        alert("✅ Дякуємо! Ми вам зателефонуємо найближчим часом.");
      } else {
        showResponse(
          form,
          "Дякуємо! Ми вам зателефонуємо найближчим часом.",
          "success"
        );
      }

      form.reset();

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      console.error("Помилка відправки форми:", error);

      if (useAlert) {
        alert("⚠ Сталася помилка. Спробуйте ще раз або зателефонуйте нам.");
      } else {
        showResponse(
          form,
          "Помилка відправки. Спробуйте ще раз або зателефонуйте нам.",
          "error"
        );
      }
    }
  }

  // =========================
  // МОДАЛКА
  // =========================
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

  // =========================
  // ФИКСИРОВАННАЯ КНОПКА
  // =========================
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

  // =========================
  // HERO-КНОПКИ
  // =========================
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

  // =========================
  // ИНИЦИАЛИЗАЦИЯ ТЕЛЕФОНОВ
  // =========================
  initPhoneInputs(document);

  // =========================
  // ОБЫЧНАЯ ФОРМА
  // =========================
  if (callbackForm) {
    callbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      await handleFormSubmit(callbackForm, "Форма на сторінці", {
        useAlert: false
      });
    });
  }

  // =========================
  // МОДАЛЬНАЯ ФОРМА
  // =========================
  if (modalForm) {
    modalForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      await handleFormSubmit(modalForm, "Модальне вікно", {
        useAlert: true,
        onSuccess: () => {
          autoExpandDisabled = true;
          clearTimeout(autoExpandTimer);
          collapseFixedButton();
          closeModal();
        }
      });
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