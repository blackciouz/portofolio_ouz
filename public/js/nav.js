// Navigation JavaScript

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

// Scroll effect — guard si .nav absent
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Set active nav link based on current page — une seule fois, proprement
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.style.removeProperty('color');
        link.style.removeProperty('font-weight');
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        let isActive = false;

        if ((currentPage === '' || currentPage === 'index.html' || currentPath === '/') && (href === '/' || href === 'index.html')) {
            isActive = true;
        } else if ((currentPage === 'services.html' || currentPage === 'service-detail.html') && href === 'services.html') {
            isActive = true;
        } else if ((currentPage === 'projects.html' || currentPage === 'project-detail.html') && href === 'projects.html') {
            isActive = true;
        } else if (currentPage === 'about.html' && href === 'about.html') {
            isActive = true;
        } else if (currentPage === 'contact.html' && href === 'contact.html') {
            isActive = true;
        }

        if (isActive) {
            link.classList.add('active');
            // Force les styles inline pour garantir l'affichage
            link.style.setProperty('color', 'var(--brand-400)', 'important');
            link.style.setProperty('font-weight', '700', 'important');
        }
    });
}

// Un seul appel immédiat — le DOM est dispo car script en bas de body
setActiveNavLink();

// Mise à jour de l'année dans le footer
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
