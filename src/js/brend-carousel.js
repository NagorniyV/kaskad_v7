//BREND SECTION

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const items = track.querySelectorAll('div'); // Выбираем все div-элементы, содержащие img и p
    
    // Клонируем все элементы (и изображения, и текст) для бесшовности
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
    
    // Перезапуск анимации при скролле (опционально)
    track.addEventListener('animationiteration', () => {
      track.style.animation = 'none';
      void track.offsetWidth; // Trigger reflow
      track.style.animation = 'scroll 40s linear infinite';
    });
  });
  