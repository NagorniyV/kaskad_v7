document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".services-carousel");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const container = carousel.querySelector(".services-container");
    const cards = carousel.querySelectorAll(".service-card");
    const parent = carousel.parentElement;
    const prevBtn = parent?.querySelector("#prevBtn");
    const nextBtn = parent?.querySelector("#nextBtn");
    if (!container || !cards.length) return;

    let currentIndex = 0;

    function getCardWidth() {
      const style = window.getComputedStyle(cards[0]);
      return (
        cards[0].offsetWidth +
        parseInt(style.marginLeft || "0", 10) +
        parseInt(style.marginRight || "0", 10)
      );
    }

    function getCardsPerView() {
      const width = carousel.offsetWidth;
      if (width <= 0) return 1;
      return Math.max(Math.floor(width / getCardWidth()), 1);
    }

    function updateCarousel() {
      const cardWidth = getCardWidth();
      const maxIndex = Math.max(cards.length - getCardsPerView(), 0);
      currentIndex = Math.min(currentIndex, maxIndex);
      container.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

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
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        currentIndex = 0;
        updateCarousel();
      }, 100);
    });

    updateCarousel();
  });
});
