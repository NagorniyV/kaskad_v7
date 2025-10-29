document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    // Функция для управления видео
    function manageVideoPlayback(targetSlide) {
        // Останавливаем все видео и сбрасываем время
        slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // Запускаем видео активного слайда
        const activeVideo = targetSlide.querySelector('video');
        if (activeVideo) {
            // Небольшая задержка для плавности
            setTimeout(() => {
                activeVideo.play().catch(e => {
                    console.log('Autoplay prevented, waiting for user interaction');
                });
            }, 300);
        }
    }

    function showSlide(n) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Скрываем все слайды
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Показываем текущий слайд
        currentSlide = (n + slides.length) % slides.length;
        const targetSlide = slides[currentSlide];
        targetSlide.classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Плавное перемещение трека
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Управление видео
        manageVideoPlayback(targetSlide);
        
        // Сбрасываем флаг после завершения анимации
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (index === currentSlide) return;
            stopSlider();
            showSlide(index);
            startSlider();
        });
    });

    // Пауза при наведении на слайдер
    const slider = document.querySelector('.offers-slider');
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);

    // Запускаем видео для первого слайда при загрузке
    manageVideoPlayback(slides[0]);
    
    // Запуск автоматической смены слайдов
    startSlider();
});