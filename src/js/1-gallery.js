document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    
    // Массив с именами файлов из папки kaskad
    // В реальном проекте этот список можно получить через серверный скрипт
    const imageFiles = [
        'i1.jpg',
        'i2.jpg',
        'i3.jpg',
        'i4.jpg',
        'i5.jpg',
        'i6.jpg',
        'i7.jpg',
        'i8.jpg',
        'i9.jpg',
        'i10.jpg',
        'i11.jpg',
        'i12.jpg',
        'i13.jpg',
        'i14.jpg',
        'i15.jpg',
        'i16.jpg',
        'i17.jpg',
        'i18.jpg',
        'i19.jpg',
        'i20.jpg',
        'i21.jpg',
        'i22.jpg',
        'i23.jpg',
        'i24.jpg',
        'i25.jpg',
        'i26.jpg',
        'i27.jpg',
        'i28.jpg',
        'i29.jpg',
        'i30.jpg',
        'i31.jpg',
        'i32.jpg',
        'i33.jpg',
        'i34.jpg',
        'i35.jpg',
        'i36.jpg'
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