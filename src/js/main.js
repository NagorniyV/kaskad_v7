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

document.getElementById('back-to-top').addEventListener('click', function(e) {
  e.preventDefault(); // Отменяем стандартное поведение ссылки
  
  // Находим элемент header
  const headerElement = document.getElementById('header');
  
  // Плавный скролл до header
  if (headerElement) {
    headerElement.scrollIntoView({
      behavior: 'smooth'
    });
  }
});

// ФОРМА ОБРАТНОЙ СВЯЗИ

document.getElementById('callbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('nameInput').value.trim();
  const phoneNumber = document.getElementById('phoneInput').value.trim();
  const messageText = document.getElementById('messageInput').value.trim();
  const responseMessage = document.getElementById('responseMessage');
  
  // Валидация номера телефона (минимум 10 цифр)
  const phoneRegex = /[\d]{10,}/;
  const cleanPhone = phoneNumber.replace(/\D/g, ''); // Удаляем всё, кроме цифр
  
  if (!phoneRegex.test(cleanPhone)) {
    responseMessage.textContent = "Введіть коректний номер телефону!";
    responseMessage.className = "response-message error";
    responseMessage.style.display = "block";
    return;
  }

  // Формируем сообщение для Telegram
  const telegramMessage = `
    Новий запит на дзвінок!
    Ім'я: ${name || 'Не вказано'}
    Телефон: ${phoneNumber}
    Авто: ${messageText || 'Не вказано'}
  `;

  const botToken = '7401776138:AAEIszjxs4_-9alGK01THnbG9VHvAGUrEwA';
  const adminChatIds = ['398501551'];
  
  // Отправляем запросы
  Promise.all(
    adminChatIds.map(chatId => 
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage
        })
      })
    )
  )
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(data => {
    responseMessage.textContent = "Дякуємо! Ми вам зателефонуємо найближчим часом.";
    responseMessage.className = "response-message success";
    responseMessage.style.display = "block";
    document.getElementById('callbackForm').reset();
    
    setTimeout(() => {
      responseMessage.style.display = "none";
    }, 5000);
  })
  .catch(error => {
    console.error("Помилка відправки:", error);
    responseMessage.textContent = "Помилка відправки. Спробуйте ще раз або зателефонуйте нам.";
    responseMessage.className = "response-message error";
    responseMessage.style.display = "block";
  });
});

// БУРГЕР КНОПКА

document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.nav');
  const dropdowns = document.querySelectorAll('.dropdown');

  // Бургер-меню
  burger.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Аккордеон для выпадающих пунктов
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const content = this.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
});