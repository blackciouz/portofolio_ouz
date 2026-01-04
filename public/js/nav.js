// Navigation JavaScript

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate toggle icon
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
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu when clicking a link
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

// Scroll effect for navigation
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Set active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');
    
    // Check exact match
    if (href === currentPage) {
        link.classList.add('active');
    }
    // Check if on home page
    else if ((currentPage === '' || currentPage === 'index.html') && href === '/') {
        link.classList.add('active');
    }
    // Check if on services pages
    else if ((currentPage === 'services.html' || currentPage === 'service-detail.html') && href === 'services.html') {
        link.classList.add('active');
    }
    // Check if on projects pages
    else if ((currentPage === 'projects.html' || currentPage === 'project-detail.html') && href === 'projects.html') {
        link.classList.add('active');
    }
    // Check if on about page
    else if (currentPage === 'about.html' && href === 'about.html') {
        link.classList.add('active');
    }
    // Check if on contact page (special case - button has active class)
    else if (currentPage === 'contact.html' && href === 'contact.html') {
        // For contact, we add active to the parent nav-cta button
        const parentCta = link.closest('.nav-cta');
        if (parentCta) {
            link.classList.add('active');
        }
    }
});
