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

  // Проверка, мобильное ли устройство (или узкий экран)
  const isMobile = () => window.innerWidth <= 992;

  // Обработка выпадающего меню (только на компьютере)
  if (!isMobile()) {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      const content = dropdown.querySelector('.dropdown-content');

      // Показываем при наведении
      dropdown.addEventListener('mouseenter', () => {
        content.style.display = 'block';
      });

      // Скрываем при уходе курсора
      dropdown.addEventListener('mouseleave', () => {
        content.style.display = 'none';
      });

      // Отменяем стандартное поведение ссылки (если href="#")
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
        }
      });
    });
  }

  // На мобильных устройствах dropdown-content НЕ показывается вообще
  else {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      const content = dropdown.querySelector('.dropdown-content');

      // Скрываем dropdown-content (если вдруг был виден)
      content.style.display = 'none';

      // Отключаем клик по ссылке (если href="#")
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
        }
      });
    });
  }

  // Обновляем поведение при изменении размера окна
  window.addEventListener('resize', () => {
    dropdowns.forEach(dropdown => {
      const content = dropdown.querySelector('.dropdown-content');
      content.style.display = 'none'; // Сбрасываем при любом изменении
    });

    // Если перешли в десктопный режим — включаем обработку наведения
    if (!isMobile()) {
      dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');

        dropdown.addEventListener('mouseenter', () => {
          content.style.display = 'block';
        });

        dropdown.addEventListener('mouseleave', () => {
          content.style.display = 'none';
        });
      });
    }
  });
});

// КАРУСЕЛЬ ПОДБОРА ЗАПЧАСТЕЙ

document.addEventListener('DOMContentLoaded', function() {
  try {
    const carousel = document.querySelector('.carousel');
    const images = document.querySelectorAll('.carousel img');
    
    // Проверяем, существуют ли элементы карусели
    if (!carousel || !images || images.length === 0) {
      console.error('Элементы карусели не найдены');
      return;
    }
    
    let currentIndex = 0;
    const visibleImages = 2; // Количество видимых изображений
    let carouselInterval;
    
    function showNextImages() {
      try {
        // Скрываем все изображения
        images.forEach(img => {
          if (img) { // Проверка на существование элемента
            img.style.display = 'none';
            img.classList.remove('active');
            img.classList.remove('fade');
          }
        });
        
        // Проверяем, есть ли изображения для показа
        if (images.length === 0) return;
        
        // Показываем текущие 2 изображения
        for (let i = 0; i < visibleImages; i++) {
          const index = (currentIndex + i) % images.length;
          if (images[index]) { // Проверка на существование элемента
            images[index].style.display = 'block';
            if (i === 0) {
              images[index].classList.add('active');
              images[index].classList.add('fade');
            }
          }
        }
        
        // Обновляем индекс для следующего перехода
        currentIndex = (currentIndex + 1) % (images.length - visibleImages + 1);
      } catch (e) {
        console.error('Ошибка в функции showNextImages:', e);
        clearInterval(carouselInterval); // Останавливаем интервал при ошибке
      }
    }
    
    // Запускаем карусель
    showNextImages();
    carouselInterval = setInterval(showNextImages, 4000); // Смена каждые 4 секунды
    
    // Для адаптивности можно добавить обработчик изменения размера окна
    window.addEventListener('resize', function() {
      // При необходимости можно добавить логику адаптации
    });
    
  } catch (e) {
    console.error('Ошибка при инициализации карусели:', e);
  }
});

// МОДАЛЬНОЕ ОКНО + ФОРМА ОБРАТНОЙ СВЯЗИ

document.addEventListener('DOMContentLoaded', function() {
  // Общие настройки
  const botToken = '7401776138:AAEIszjxs4_-9alGK01THnbG9VHvAGUrEwA';
  const adminChatIds = ['398501551'];

  // ===== МОДАЛЬНОЕ ОКНО =====
  const modal = document.getElementById('callbackModal');
  const modalForm = document.getElementById('modalForm');
  
  // Открытие/закрытие модалки
  document.querySelector('.details-hero-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
  });

  // Закрытие при клике вне окна
window.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
});

  document.querySelector('.modal-close')?.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  });

  

  // Обработка отправки формы модального окна
  if (modalForm) {
    modalForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      console.log('Форма модального окна отправлена'); // Для отладки
      
      // Получаем значения полей
      const name = document.getElementById('modalName')?.value.trim();
      const phone = document.getElementById('modalPhone')?.value.trim();
      const vin = document.getElementById('modalVin')?.value.trim();
      const carModel = document.getElementById('modalCar')?.value.trim();

      // Валидация телефона
      const phoneRegex = /^[\d\s\-+]{10,}$/;
      const cleanPhone = phone?.replace(/\D/g, '') || '';

      // Формируем сообщение
      const message = `🚗 Новая заявка обратный звонок:\n\n` +
                     `▪ Имя: ${name || 'не указано'}\n` +
                     `▪ Телефон: ${phone}\n` +
                     `▪ VIN: ${vin || 'не указан'}\n` +
                     `▪ Авто: ${carModel || 'не указано'}`;

      try {
        console.log('Отправляем в Telegram:', message); // Для отладки
        await sendToTelegram(message);
        
        // Успешная отправка
        alert('✅ Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
        modalForm.reset();
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      } catch (error) {
        console.error('Ошибка отправки:', error);
        alert('⚠ Произошла ошибка. Пожалуйста, попробуйте ещё раз или позвоните нам.');
      }
    });
  }

  // ===== ОБЩАЯ ФУНКЦИЯ ОТПРАВКИ =====
  async function sendToTelegram(text) {
    const promises = adminChatIds.map(chatId => {
      return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
    });
    
    return await Promise.all(promises);
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
  const telegramMessage = `🚗 Новая заявка обратный звонок:\n\n` +
                     `▪ Имя: ${name || 'не указано'}\n` +
                     `▪ Телефон: ${phoneNumber}\n` +
                     `▪ Авто: ${messageText || 'не указано'}`;

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