// Simple Lightbox for Images

function initLightbox() {
    // Create lightbox HTML
    const lightboxHTML = `
        <div id="lightbox" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px); align-items: center; justify-content: center;">
            <span id="lightbox-close" style="position: absolute; top: 30px; right: 50px; font-size: 40px; color: white; cursor: pointer; z-index: 10000;">&times;</span>
            <img id="lightbox-img" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; box-shadow: 0 0 50px rgba(14, 165, 233, 0.3);">
            <div id="lightbox-caption" style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); color: white; font-size: 16px; text-align: center; max-width: 80%;"></div>
        </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    
    // Close handlers
    closeBtn.onclick = () => {
        lightbox.style.display = 'none';
    };
    
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
        }
    });
    
    // Make all images in galleries clickable
    document.querySelectorAll('.gallery-image, [data-lightbox]').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.onclick = () => {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || '';
            lightbox.style.display = 'flex';
        };
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
} else {
    initLightbox();
}
