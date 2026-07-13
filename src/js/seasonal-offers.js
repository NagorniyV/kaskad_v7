document.addEventListener("DOMContentLoaded", () => {
  const sliderTrack = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const slider = document.querySelector(".offers-slider");

  if (!sliderTrack || !slider || slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;
  let isTransitioning = false;

  function manageVideoPlayback(targetSlide) {
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    });

    const activeVideo = targetSlide?.querySelector("video");
    if (!activeVideo) return;

    setTimeout(() => {
      activeVideo.play().catch(() => {});
    }, 300);
  }

  function showSlide(n) {
    if (isTransitioning) return;
    isTransitioning = true;

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    currentSlide = (n + slides.length) % slides.length;
    const targetSlide = slides[currentSlide];
    targetSlide.classList.add("active");
    dots[currentSlide]?.classList.add("active");
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    manageVideoPlayback(targetSlide);

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (index === currentSlide) return;
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });

  slider.addEventListener("mouseenter", stopSlider);
  slider.addEventListener("mouseleave", startSlider);

  manageVideoPlayback(slides[0]);
  startSlider();
});
