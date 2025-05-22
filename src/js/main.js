// ФОРМА ОБРАТНОЙ СВЯЗИ

document.getElementById('callbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Получаем значения из всех полей
  const name = document.getElementById('nameInput').value;
  const phoneNumber = document.getElementById('phoneInput').value;
  const messageText = document.getElementById('messageInput').value;
  const responseMessage = document.getElementById('responseMessage');
  const botToken = '7679464526:AAFDTqmh8t8kW-IGP6R19fHOevH7g4-t7Yc';
  const adminChatIds = ['398501551', '1229928272'];
  
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

//кнопка-бургер
document.addEventListener('DOMContentLoaded', function() {
  const desktopMenu = document.querySelector('.desktop-menu');
  const desktopMenuBtn = document.querySelector('.desktop-menu-btn');
  
  // Исправляем опечатку в селекторе (было .desktop-menu)
  const desktopMenuContainer = document.querySelector('.desktop-menu');
  
  // Обработчик клика по кнопке
  desktopMenuBtn.addEventListener('click', function() {
      desktopMenuContainer.classList.toggle('active');
  });
  
  // Закрытие меню при клике вне его области
  document.addEventListener('click', function(e) {
      if (!desktopMenuContainer.contains(e.target)) {
          desktopMenuContainer.classList.remove('active');
      }
  });
});

