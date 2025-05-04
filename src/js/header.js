// section parts 

document.addEventListener('DOMContentLoaded', function() {
  const cardItems = document.querySelectorAll('.card-item');
  
  cardItems.forEach(item => {
    item.addEventListener('click', function() {
      const details = this.querySelector('.card-details');
      const wasActive = this.classList.contains('active'); // Запоминаем предыдущее состояние
      
      // Закрываем все элементы
      cardItems.forEach(card => {
        card.classList.remove('active');
        const cardDetails = card.querySelector('.card-details');
        cardDetails.classList.remove('active');
        cardDetails.style.maxHeight = '0';
      });
      
      // Если элемент не был активным, открываем его
      if (!wasActive) {
        this.classList.add('active');
        details.classList.add('active');
        details.style.maxHeight = details.scrollHeight + 'px';
      }
    });
  });
});

//кнопка-бургер
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  menuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
  });
});