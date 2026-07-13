//кнопка Піднятись в гору (delegation — кнопка приходит из include)
document.addEventListener("click", function (e) {
  const backToTop = e.target.closest("#back-to-top");
  if (!backToTop) return;

  e.preventDefault();
  document.getElementById("header")?.scrollIntoView({
    behavior: "smooth",
  });
});

// КНОПКИ ПОЯВЛЯЮТСЯ ПОСЛЕ ПРОКРУТКИ
function initSocialScroll() {
  const social = document.querySelector(".social-fixed");
  const toHome = document.querySelector(".to-home");
  if ((!social && !toHome) || (social && social.dataset.scrollInit === "true")) {
    return;
  }
  if (social) social.dataset.scrollInit = "true";

  const updateVisibility = () => {
    if (window.innerWidth <= 1024) {
      social?.classList.toggle("show", window.scrollY > 100);
      toHome?.classList.toggle("show", window.scrollY > 100);
    } else {
      social?.classList.remove("show");
      toHome?.classList.remove("show");
    }
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  updateVisibility();
}

document.addEventListener("DOMContentLoaded", initSocialScroll);
document.addEventListener("partials:loaded", initSocialScroll);

// КОЛБЕК — универсальный JS для всех страниц
function initCallbackUI() {
  if (window.__callbackUIInitialized) return;
  if (!document.getElementById("callbackModal") && !document.getElementById("callbackForm")) {
    return;
  }
  window.__callbackUIInitialized = true;

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

  const PHONE_ERROR = "Введите номер в формате +38 (050) 111 22 33";
  const VIN_ERROR = "VIN-код должен содержать ровно 17 символов (без I, O, Q)";
  const VIN_LENGTH = 17;

  function formatPhone(value) {
    let cleaned = String(value || "").replace(/\D/g, "");

    if (!cleaned) return "";

    if (cleaned.startsWith("380")) {
      // ok
    } else if (cleaned.startsWith("38")) {
      // ok
    } else if (cleaned.startsWith("0")) {
      cleaned = "38" + cleaned;
    } else {
      cleaned = "38" + cleaned;
    }

    cleaned = cleaned.substring(0, 12);
    const local = cleaned.substring(2);

    let formatted = "+38";
    if (local.length > 0) {
      formatted += " (" + local.substring(0, Math.min(3, local.length));
      if (local.length >= 3) formatted += ")";
      if (local.length > 3) formatted += " " + local.substring(3, 6);
      if (local.length > 6) formatted += " " + local.substring(6, 8);
      if (local.length > 8) formatted += " " + local.substring(8, 10);
    }

    return formatted;
  }

  function isValidPhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    // +38 (0XX) XXX XX XX → 12 digits, operator code starts with 0
    return /^380\d{9}$/.test(digits);
  }

  function formatVin(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/[^A-HJ-NPR-Z0-9]/g, "")
      .slice(0, VIN_LENGTH);
  }

  function isValidVin(value) {
    const vin = String(value || "").trim();
    if (!vin) return true; // optional
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  }

  function initPhoneInput(input) {
    if (!input || input.dataset.phoneInitialized === "true") return;

    input.dataset.phoneInitialized = "true";
    input.setAttribute("inputmode", "tel");
    input.setAttribute("autocomplete", "tel");
    input.setAttribute("maxlength", "19");
    input.setAttribute("placeholder", "+38 (050) 111 22 33");

    input.addEventListener("focus", function () {
      if (!this.value.trim()) {
        this.value = "+38 (";
      }
    });

    input.addEventListener("input", function () {
      this.value = formatPhone(this.value);
      if (isValidPhone(this.value) || !this.value || this.value === "+38") {
        this.setCustomValidity("");
      }
    });

    input.addEventListener("blur", function () {
      if (this.value === "+38" || this.value === "+38 (" || this.value === "+38 ()") {
        this.value = "";
        this.setCustomValidity("");
        return;
      }

      if (this.value && !isValidPhone(this.value)) {
        this.setCustomValidity(PHONE_ERROR);
        this.reportValidity();
      } else {
        this.setCustomValidity("");
      }
    });
  }

  function initVinInput(input) {
    if (!input || input.dataset.vinInitialized === "true") return;

    input.dataset.vinInitialized = "true";
    input.setAttribute("maxlength", String(VIN_LENGTH));
    input.removeAttribute("minlength");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("autocomplete", "off");
    input.setAttribute(
      "title",
      "VIN: ровно 17 символов (буквы и цифры, без I, O, Q)"
    );

    input.addEventListener("input", function () {
      const start = this.selectionStart;
      const before = this.value.length;
      this.value = formatVin(this.value);
      const delta = before - this.value.length;
      if (typeof start === "number") {
        const pos = Math.max(0, start - delta);
        this.setSelectionRange(pos, pos);
      }
      if (isValidVin(this.value)) {
        this.setCustomValidity("");
      }
    });

    input.addEventListener("blur", function () {
      if (this.value && !isValidVin(this.value)) {
        this.setCustomValidity(VIN_ERROR);
        this.reportValidity();
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

  function initVinInputs(scope = document) {
    const vinInputs = scope.querySelectorAll(
      'input[name="vin"], #vinInput, #modalVin'
    );
    vinInputs.forEach(initVinInput);
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

    const phoneInput =
      form.querySelector('[name="phone"], #phoneInput, #modalPhone') || null;
    const vinInput =
      form.querySelector('[name="vin"], #vinInput, #modalVin') || null;

    if (phoneInput) {
      phoneInput.value = formatPhone(phoneInput.value);
      formData.phone = phoneInput.value.trim();
    }
    if (vinInput) {
      vinInput.value = formatVin(vinInput.value);
      formData.vin = vinInput.value.trim();
    }

    if (!isValidPhone(formData.phone)) {
      if (phoneInput) {
        phoneInput.setCustomValidity(PHONE_ERROR);
        phoneInput.reportValidity();
      }
      if (useAlert) {
        alert(PHONE_ERROR);
      } else {
        showResponse(form, PHONE_ERROR, "error");
      }
      return;
    }
    if (phoneInput) phoneInput.setCustomValidity("");

    if (!isValidVin(formData.vin)) {
      if (vinInput) {
        vinInput.setCustomValidity(VIN_ERROR);
        vinInput.reportValidity();
      }
      if (useAlert) {
        alert(VIN_ERROR);
      } else {
        showResponse(form, VIN_ERROR, "error");
      }
      return;
    }
    if (vinInput) vinInput.setCustomValidity("");

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
  // ИНИЦИАЛИЗАЦИЯ ТЕЛЕФОНОВ / VIN
  // =========================
  initPhoneInputs(document);
  initVinInputs(document);

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
}

document.addEventListener("DOMContentLoaded", initCallbackUI);
document.addEventListener("partials:loaded", initCallbackUI);

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