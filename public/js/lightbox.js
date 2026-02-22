// Lightbox pour images - supporte les images dynamiques (chargées après init)

(function() {
    let lightboxInited = false;
    let lightboxEl = null;
    let lightboxImg = null;
    let lightboxCaption = null;

    function createLightbox() {
        if (lightboxInited) return;
        lightboxInited = true;

        const html = `
        <div id="lightbox" style="
            display:none; position:fixed; z-index:99999;
            left:0; top:0; width:100%; height:100%;
            background:rgba(0,0,0,0.95); backdrop-filter:blur(12px);
            align-items:center; justify-content:center; flex-direction:column;
        ">
            <button id="lightbox-close" style="
                position:absolute; top:20px; right:24px;
                background:rgba(255,255,255,0.15); border:none;
                color:white; font-size:28px; width:44px; height:44px;
                border-radius:50%; cursor:pointer; z-index:100000;
                display:flex; align-items:center; justify-content:center;
                transition:background 0.2s;
            ">&times;</button>
            <img id="lightbox-img" style="
                max-width:90vw; max-height:85vh;
                object-fit:contain; border-radius:8px;
                box-shadow:0 0 60px rgba(14,165,233,0.4);
            ">
            <div id="lightbox-caption" style="
                margin-top:16px; color:rgba(255,255,255,0.8);
                font-size:0.9rem; text-align:center; max-width:80vw;
                min-height:1.5em;
            "></div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);

        lightboxEl = document.getElementById('lightbox');
        lightboxImg = document.getElementById('lightbox-img');
        lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = document.getElementById('lightbox-close');

        function closeLightbox() {
            lightboxEl.style.display = 'none';
            document.body.style.overflow = '';
        }

        closeBtn.onclick = closeLightbox;

        lightboxEl.onclick = (e) => {
            if (e.target === lightboxEl) closeLightbox();
        };

        // Un seul keydown global - on vérifie si lightbox est ouverte
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxEl.style.display === 'flex') {
                closeLightbox();
            }
        });

        closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,255,255,0.3)'; };
        closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.15)'; };
    }

    // Ouvre une image dans la lightbox
    window.openLightbox = function(src, caption) {
        createLightbox();
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
        lightboxEl.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    // Attache la lightbox à tous les éléments gallery-image existants ET futurs
    // Utilise un MutationObserver pour détecter les images ajoutées dynamiquement
    function attachToImages() {
        document.querySelectorAll('.gallery-image, [data-lightbox]').forEach(img => {
            if (img._lightboxAttached) return; // évite les doublons
            img._lightboxAttached = true;
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const src = img.src || img.getAttribute('data-src');
                const caption = img.alt || img.getAttribute('data-caption') || '';
                window.openLightbox(src, caption);
            });
        });
    }

    // Init lightbox au chargement
    function init() {
        createLightbox();
        attachToImages();

        // Observer pour les images injectées dynamiquement (projets, services)
        const observer = new MutationObserver(() => {
            attachToImages();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
