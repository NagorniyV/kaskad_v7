document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    
    // Массив с именами файлов из папки kaskad
    // В реальном проекте этот список можно получить через серверный скрипт
    const imageFiles = [
        'hero1.jpg',
        'hero2.jpg',
        'hero3.png',
        'hero4.jpg',
        'hero5.jpg',
        // Добавьте все ваши изображения
    ];
    
    // Создаем элементы галереи
    const galleryItems = imageFiles.map(file => {
        return `
            <li class="gallery-item">
                <a href="./src/img/kaskad/${file}">
                    <img 
                        class="gallery-image" 
                        src="./src/img/kaskad/${file}" 
                        alt="Автосервис Каскад - ${file.replace('.jpg', '')}"
                    >
                </a>
            </li>
        `;
    }).join('');
    
    // Вставляем в DOM
    gallery.innerHTML = galleryItems;
    
    // Инициализируем SimpleLightbox
    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
        overlayOpacity: 0.8,
        navText: ['←','→'],
        closeText: '×',
        scrollZoom: false
    });
    
    // Обновляем lightbox после загрузки изображений
    window.addEventListener('load', () => {
        lightbox.refresh();
    });
});