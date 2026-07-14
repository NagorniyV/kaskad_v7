function getVisibleServiceCards(carousel) {
  return [...carousel.querySelectorAll(".service-card")].filter((card) => {
    if (card.hasAttribute("hidden") || card.hidden) return false;
    if (card.classList.contains("is-service-frozen")) return false;
    return true;
  });
}

function cardsPerViewForWidth(width) {
  if (width <= 480) return 1;
  if (width <= 768) return 2;
  if (width <= 1024) return 3;
  return 5;
}

function initServicesCarousels(root = document) {
  const carousels = root.querySelectorAll(".services-carousel");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    if (carousel.dataset.carouselInit === "true") return;

    const container = carousel.querySelector(".services-container");
    const parent = carousel.closest(".services-section") || carousel.parentElement;
    const prevBtn =
      parent?.querySelector(".services-prev") ||
      parent?.querySelector("#prevBtn");
    const nextBtn =
      parent?.querySelector(".services-next") ||
      parent?.querySelector("#nextBtn");
    if (!container) return;

    const cards = getVisibleServiceCards(carousel);
    if (!cards.length) return;

    carousel.dataset.carouselInit = "true";
    let currentIndex = 0;
    const GAP = 20; // left+right margin per card (10 + 10)

    function layoutCards() {
      const viewport = carousel.offsetWidth;
      if (viewport <= 0) return 0;

      const perView = cardsPerViewForWidth(viewport);
      const cardWidth = Math.max(
        Math.floor((viewport - perView * GAP) / perView),
        1
      );

      cards.forEach((card) => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.width = `${cardWidth}px`;
        card.style.maxWidth = `${cardWidth}px`;
        card.style.marginLeft = `${GAP / 2}px`;
        card.style.marginRight = `${GAP / 2}px`;
      });

      return cardWidth + GAP;
    }

    function getStep() {
      const style = window.getComputedStyle(cards[0]);
      return (
        cards[0].offsetWidth +
        parseInt(style.marginLeft || "0", 10) +
        parseInt(style.marginRight || "0", 10)
      );
    }

    function getCardsPerView() {
      const step = getStep();
      if (step <= 0) return 1;
      return Math.max(Math.floor(carousel.offsetWidth / step), 1);
    }

    function updateCarousel() {
      layoutCards();
      const step = getStep();
      if (step <= 0) return;

      const maxIndex = Math.max(cards.length - getCardsPerView(), 0);
      currentIndex = Math.min(currentIndex, maxIndex);
      container.style.transform = `translateX(-${currentIndex * step}px)`;

      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex >= maxIndex;
        nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
      }
    }

    prevBtn?.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateCarousel();
      }
    });

    nextBtn?.addEventListener("click", () => {
      const maxIndex = Math.max(cards.length - getCardsPerView(), 0);
      if (currentIndex < maxIndex) {
        currentIndex += 1;
        updateCarousel();
      }
    });

    let resizeTimer;
    let lastViewport = 0;

    function scheduleUpdate(resetIndex = false) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const viewport = carousel.offsetWidth;
        if (!resetIndex && viewport === lastViewport) return;
        lastViewport = viewport;
        if (resetIndex) currentIndex = 0;
        updateCarousel();
      }, 50);
    }

    window.addEventListener("resize", () => scheduleUpdate(true));

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => scheduleUpdate(false));
      ro.observe(carousel);
    }

    // Wait for layout after async include insert
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lastViewport = carousel.offsetWidth;
        updateCarousel();
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => initServicesCarousels());
document.addEventListener("partials:loaded", () => initServicesCarousels());
