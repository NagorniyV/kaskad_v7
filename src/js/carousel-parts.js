// КАРУСЕЛЬ ПОДБОРА ЗАПЧАСТЕЙ

document.addEventListener('DOMContentLoaded', function() {
    try {
      const carousel = document.querySelector('.carousel');
      const pictures = document.querySelectorAll('.carousel picture');
      
      if (!carousel || !pictures || pictures.length === 0) {
        console.error('Элементы карусели не найдены');
        return;
      }
      
      let currentIndex = 0;
      const transitionTime = 4000; // 4 секунды
      let carouselInterval;
      
      function showNextImage() {
        try {
          // Скрываем текущее активное изображение
          const currentActive = document.querySelector('.carousel picture.active');
          if (currentActive) {
            currentActive.classList.remove('active');
          }
          
          // Показываем следующее изображение
          currentIndex = (currentIndex + 1) % pictures.length;
          pictures[currentIndex].classList.add('active');
          
        } catch (e) {
          console.error('Ошибка в функции showNextImage:', e);
          clearInterval(carouselInterval);
        }
      }
      
      // Инициализация - показываем первое изображение
      if (pictures.length > 0) {
        pictures[0].classList.add('active');
      }
      
      // Запускаем карусель
      carouselInterval = setInterval(showNextImage, transitionTime);
      
      // Остановка при наведении
      carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
      });
      
      // Возобновление при уходе курсора
      carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(showNextImage, transitionTime);
      });
      
    } catch (e) {
      console.error('Ошибка при инициализации карусели:', e);
    }
  });