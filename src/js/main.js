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

// ФОРМА ОБРАТНОЙ СВЯЗИ

document.getElementById('callbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Получаем значения из всех полей
  const name = document.getElementById('nameInput').value;
  const phoneNumber = document.getElementById('phoneInput').value;
  const messageText = document.getElementById('messageInput').value;
  const responseMessage = document.getElementById('responseMessage');
  const botToken = '7401776138:AAEIszjxs4_-9alGK01THnbG9VHvAGUrEwA';
  const adminChatIds = ['398501551'];
  
  // Формируем сообщение с новыми данными
  let telegramMessage = `Новий запит на дзвінок!\n`;
  if (name) telegramMessage += `Ім'я: ${name}\n`;
  telegramMessage += `Номер телефону: ${phoneNumber}\n`;
  if (messageText) telegramMessage += `Повідомлення: ${messageText}`;
  
  // Отправка в Telegram
  const sendPromises = adminChatIds.map(chatId => {
    return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage
      })
    });
  });
  
  // Обработка результатов
  Promise.all(sendPromises)
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
      responseMessage.textContent = 'Дякуємо! Ми вам зателефонуємо найближчим часом.';
      responseMessage.style.display = 'block';
      document.getElementById('callbackForm').reset(); // Очищаем всю форму
      
      setTimeout(() => {
        responseMessage.style.display = 'none';
      }, 5000);
    })
    .catch(error => {
      responseMessage.textContent = 'Виникла помилка. Спробуйте ще раз пізніше.';
      responseMessage.style.color = 'red';
      responseMessage.style.display = 'block';
    });
});