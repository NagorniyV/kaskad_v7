document.addEventListener('DOMContentLoaded', function() {
    // Элементы переключателя
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'uk';
    
    // Устанавливаем активную кнопку
    document.querySelector(`.lang-btn[data-lang="${currentLang}"]`).classList.add('active');
    
    // Обработчики клика на кнопки
    langButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const selectedLang = this.dataset.lang;
        
        // Обновляем активную кнопку
        langButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Сохраняем выбор в localStorage
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
        // 1. Обновляем обычные текстовые элементы
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[key]) {
            el.textContent = translations[key];
          }
        });
  
        // 2. Обновляем placeholder для input
        const carInputWrapper = document.querySelector('[data-translate-id="car-input"]');
        if (carInputWrapper) {
          const input = carInputWrapper.querySelector('input');
          if (input && translations['car-brand']) {
            input.placeholder = translations['car-brand'];
          }
        }
  
        // 3. Можно добавить обработку других специальных атрибутов
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
          const key = el.getAttribute('data-translate-placeholder');
          if (translations[key]) {
            el.placeholder = translations[key];
          }
        });
      })
      .catch(error => console.error('Error loading translations:', error));
  }
    
    // Первоначальная загрузка переводов
    loadTranslations(currentLang);
  });

  // В начале скрипта, перед установкой currentLang
if (!localStorage.getItem('language')) {
    const browserLang = navigator.language.slice(0, 2);
    const defaultLang = browserLang === 'ru' ? 'ru' : 'uk';
    localStorage.setItem('language', defaultLang);
  }

  if (el.hasAttribute('data-translate-placeholder')) {
    const key = el.getAttribute('data-translate-placeholder');
    el.placeholder = translations[key];
}
  


//    data-translate="hero-title"