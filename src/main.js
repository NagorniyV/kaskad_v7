async function loadHTML(selector, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.querySelector(selector).innerHTML = html;
}

loadHTML("#header", "partials/header.html");
loadHTML("#footer", "partials/footer.html");


document.getElementById('callbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const phoneNumber = document.getElementById('phoneInput').value.trim();
  
  if(!phoneNumber) {
    alert('Пожалуйста, введите номер телефона');
    return;
  }
  
  // Ваш Telegram ID или username
  const telegramUsername = 'EEduarDDD';
  
  // Формируем сообщение
  const message = `Обратный звонок на номер: ${encodeURIComponent(phoneNumber)}`;
  
  // Ссылка для открытия Telegram
  const telegramUrl = `https://t.me/${telegramUsername}?text=${message}`;
  
  // Открываем Telegram
  window.open(telegramUrl, '_blank');
  
  // Очищаем поле ввода
  document.getElementById('phoneInput').value = '';
  
  // Сообщение пользователю
  alert('Сейчас откроется Telegram с готовым сообщением. Просто нажмите "Отправить"!');
});