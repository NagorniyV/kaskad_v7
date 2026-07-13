document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const pictures = document.querySelectorAll(".carousel picture");
  if (!carousel || !pictures.length) return;

  let currentIndex = 0;
  let timer;

  function showNextImage() {
    pictures[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % pictures.length;
    pictures[currentIndex].classList.add("active");
  }

  pictures[0].classList.add("active");
  timer = setInterval(showNextImage, 4000);

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", () => {
    timer = setInterval(showNextImage, 4000);
  });
});
