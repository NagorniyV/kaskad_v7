// МОДАЛЬНОЕ ОКНО

// Конфигурация Telegram бота
const botToken = '7401776138:AAEIszjxs4_-9alGK01THnbG9VHvAGUrEwA';
const adminChatIds = ['398501551'];

// Элементы модального окна
const modal = document.getElementById('callbackModal');
const btn = document.querySelector('.details-hero-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('callbackForm');

// Открытие модального окна
btn.onclick = function(e) {
  e.preventDefault();
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}

// Закрытие модального окна
closeBtn.onclick = function() {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// Закрытие при клике вне окна
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}

// Отправка формы
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    vin: document.getElementById('vin').value,
    carModel: document.getElementById('carModel').value
  };

  // Формируем сообщение для Telegram
  const message = `Новая заявка на установку ГБО:\n\n` +
                 `Имя: ${formData.name}\n` +
                 `Телефон: ${formData.phone}\n` +
                 `VIN: ${formData.vin || 'не указан'}\n` +
                 `Автомобиль: ${formData.carModel || 'не указан'}`;

  // Отправка в Telegram
  adminChatIds.forEach(chatId => {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });
  });

  // Закрываем модальное окно
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  
  // Очищаем форму
  form.reset();
  
  // Можно добавить уведомление об успешной отправке
  alert('Спасибо! Ваша заявка отправлена.');
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