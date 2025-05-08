// ФОРМА ОБРАТНОЙ СВЯЗИ

document.getElementById('callbackForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Отменяем стандартную отправку формы
    
    const phoneNumber = document.getElementById('phoneInput').value;
    const responseMessage = document.getElementById('responseMessage');
    
    // Здесь нужно заменить YOUR_BOT_TOKEN и YOUR_CHAT_ID на реальные значения
    const botToken = '7679464526:AAFDTqmh8t8kW-IGP6R19fHOevH7g4-t7Yc';
    const chatId = '398501551';
    
    const message = `Новий запит на дзвінок!\nНомер телефону: ${phoneNumber}`;
    
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    })
    .then(response => response.json())
    .then(data => {
      responseMessage.textContent = 'Дякуємо! Ми вам зателефонуємо найближчим часом.';
      responseMessage.style.display = 'block';
      document.getElementById('phoneInput').value = ''; // Очищаем поле ввода
      
      // Скрываем сообщение через 5 секунд
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