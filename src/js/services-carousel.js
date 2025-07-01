document.addEventListener('DOMContentLoaded', function() {
    try {
      // Находим все карусели на странице
      const carousels = document.querySelectorAll('.services-carousel');
      
      if (!carousels || carousels.length === 0) {
        console.warn('Карусели услуг не найдены на странице');
        return;
      }
      
      // Инициализируем каждую карусель
      carousels.forEach((carousel, carouselIndex) => {
        try {
          if (!carousel) return;
          
          const container = carousel.querySelector('.services-container');
          const prevBtn = carousel.parentElement?.querySelector('#prevBtn');
          const nextBtn = carousel.parentElement?.querySelector('#nextBtn');
          const cards = carousel.querySelectorAll('.service-card');
          let currentIndex = 0;
          
          // Проверка необходимых элементов
          if (!container || !cards || cards.length === 0) {
            console.warn(`Карусель #${carouselIndex} не содержит необходимых элементов`);
            return;
          }
  
          // Определяем количество видимых карточек
          function getCardsPerView() {
            try {
              if (!carousel || cards.length === 0) return 0;
              
              const containerWidth = carousel.offsetWidth;
              if (containerWidth <= 0) return 1; // Запасной вариант
              
              const cardStyle = window.getComputedStyle(cards[0]);
              const cardWidth = cards[0].offsetWidth + 
                              parseInt(cardStyle.marginLeft || 0) + 
                              parseInt(cardStyle.marginRight || 0);
              
              return Math.max(Math.floor(containerWidth / cardWidth), 1);
            } catch (e) {
              console.error('Ошибка в getCardsPerView:', e);
              return 1; // Возвращаем минимальное значение при ошибке
            }
          }
  
          // Обновляем карусель
          function updateCarousel() {
            try {
              if (cards.length === 0 || !container) return;
              
              const cardStyle = window.getComputedStyle(cards[0]);
              const cardWidth = cards[0].offsetWidth + 
                              parseInt(cardStyle.marginLeft || 0) + 
                              parseInt(cardStyle.marginRight || 0);
              
              container.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
              
              // Обновляем состояние кнопок
              const cardsPerView = getCardsPerView();
              const maxIndex = Math.max(cards.length - cardsPerView, 0);
              
              if (prevBtn) {
                prevBtn.disabled = currentIndex === 0;
                prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
              }
              
              if (nextBtn) {
                nextBtn.disabled = currentIndex >= maxIndex;
                nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
              }
            } catch (e) {
              console.error('Ошибка в updateCarousel:', e);
            }
          }
  
          // Обработчики кнопок с проверкой существования
          if (prevBtn) {
            prevBtn.addEventListener('click', () => {
              if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
              }
            });
          } else {
            console.warn(`Не найдена кнопка "Назад" для карусели #${carouselIndex}`);
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
          } else {
            console.warn(`Не найдена кнопка "Вперед" для карусели #${carouselIndex}`);
          }
  
          // Обработчик изменения размера окна с debounce
          let resizeTimeout;
          function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
              currentIndex = 0;
              updateCarousel();
            }, 100);
          }
          
          window.addEventListener('resize', handleResize);
          
          // Функция для очистки (на случай динамического удаления карусели)
          function cleanup() {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
          }
          
          // Инициализация
          updateCarousel();
          
          // Для возможного использования извне
          carousel._carouselAPI = {
            update: updateCarousel,
            cleanup: cleanup
          };
          
        } catch (e) {
          console.error(`Ошибка при инициализации карусели #${carouselIndex}:`, e);
        }
      });
      
    } catch (e) {
      console.error('Ошибка при инициализации каруселей услуг:', e);
    }
  });