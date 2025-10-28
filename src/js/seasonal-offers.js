document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    
    function nextSlide() {
        currentIndex++;
        
        // Если последний слайд, переходим к первому
        if (currentIndex >= slides.length) {
            // Сначала показываем последний слайд
            updateSlider();
            
            // Затем быстро и без анимации возвращаемся к первому
            setTimeout(() => {
                sliderTrack.style.transition = 'none';
                currentIndex = 0;
                updateSlider();
                
                // Включаем анимацию обратно
                setTimeout(() => {
                    sliderTrack.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 50);
            }, 1000);
        } else {
            updateSlider();
        }
    }
    
    function updateSlider() {
        const translateX = -currentIndex * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Автоматическая смена каждые 5 секунд
    setInterval(nextSlide, 5000);
});