document.addEventListener('DOMContentLoaded', function() {
    // Установка языка по умолчанию (украинский)
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'uk');
    }
    const currentLang = localStorage.getItem('language');
  
    // Элементы переключателя
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Устанавливаем активную кнопку
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  
    // Обработчики клика на кнопки
    langButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const selectedLang = this.dataset.lang;
        
        // Обновляем активную кнопку
        langButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Сохраняем выбор
        localStorage.setItem('language', selectedLang);
        
        // Загружаем переводы
        loadTranslations(selectedLang);
      });
    });
  
    // Функция загрузки переводов
    function loadTranslations(lang) {
      fetch(`locales/${lang}.json`)
        .then(response => response.json())
        .then(translations => {
          // Обновляем текстовые элементы
          document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[key]) el.textContent = translations[key];
          });
  
          // Обновляем placeholder'ы
          document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (translations[key]) el.placeholder = translations[key];
          });
        })
        .catch(error => console.error('Ошибка загрузки переводов:', error));
    }
    
    // Первоначальная загрузка
    loadTranslations(currentLang);
  });

//    data-translate="hero-title"