document.addEventListener('DOMContentLoaded', function() {
  // Находим все карусели на странице
  const carousels = document.querySelectorAll('.services-carousel');
  
  // Инициализируем каждую карусель
  carousels.forEach((carousel) => {
      const container = carousel.querySelector('.services-container');
      const prevBtn = carousel.parentElement.querySelector('#prevBtn');
      const nextBtn = carousel.parentElement.querySelector('#nextBtn');
      const cards = carousel.querySelectorAll('.service-card');
      let currentIndex = 0;

      // Определяем количество видимых карточек
      function getCardsPerView() {
          const containerWidth = carousel.offsetWidth;
          if (cards.length === 0) return 0;
          
          const cardStyle = window.getComputedStyle(cards[0]);
          const cardWidth = cards[0].offsetWidth + 
                          parseInt(cardStyle.marginLeft) + 
                          parseInt(cardStyle.marginRight);
          
          return Math.floor(containerWidth / cardWidth);
      }

      // Обновляем карусель
      function updateCarousel() {
          if (cards.length === 0) return;
          
          const cardStyle = window.getComputedStyle(cards[0]);
          const cardWidth = cards[0].offsetWidth + 
                          parseInt(cardStyle.marginLeft) + 
                          parseInt(cardStyle.marginRight);
          
          container.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
          
          // Обновляем состояние кнопок
          const cardsPerView = getCardsPerView();
          const maxIndex = Math.max(cards.length - cardsPerView, 0);
          
          if (prevBtn) prevBtn.disabled = currentIndex === 0;
          if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
          
          // Обновляем стили кнопок
          if (prevBtn) prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
          if (nextBtn) nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
      }

      // Обработчики кнопок
      if (prevBtn) {
          prevBtn.addEventListener('click', () => {
              if (currentIndex > 0) {
                  currentIndex--;
                  updateCarousel();
              }
          });
      }

      if (nextBtn) {
          nextBtn.addEventListener('click', () => {
              const cardsPerView = getCardsPerView();
              const maxIndex = Math.max(cards.length - cardsPerView, 0);
              
              if (currentIndex < maxIndex) {
                  currentIndex++;
                  updateCarousel();
              }
          });
      }

      // Обработчик изменения размера окна с debounce
      let resizeTimeout;
      window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
              currentIndex = 0;
              updateCarousel();
          }, 100);
      });

      // Инициализация
      updateCarousel();
  });
});

//BREND SECTION

// JavaScript для бесконечного эффекта
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const logos = track.querySelectorAll('img');
  const logosCount = logos.length;
  
  // Клонируем логотипы для бесшовности
  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    track.appendChild(clone);
  });
  
  // Перезапуск анимации при скролле
  track.addEventListener('animationiteration', () => {
    track.style.animation = 'none';
    void track.offsetWidth; // Trigger reflow
    track.style.animation = 'scroll 40s linear infinite';
  });
});

//кнопка Піднятись в гору

// Плавный скролл при клике на кнопку
document.getElementById('back-to-top').addEventListener('click', function(e) {
e.preventDefault(); // Отменяем стандартное поведение ссылки
window.scrollTo({
  top: 0,
  behavior: 'smooth' // Плавная прокрутка
});
});

