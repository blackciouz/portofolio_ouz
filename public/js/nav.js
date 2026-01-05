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
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    // Force remove all active classes first
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.style.removeProperty('color');
        link.style.removeProperty('font-weight');
    });

    // Add active class with forced styling
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        let isActive = false;
        
        // Home page
        if ((currentPage === '' || currentPage === 'index.html' || currentPath === '/') && href === '/') {
            isActive = true;
        }
        // Services pages
        else if ((currentPage === 'services.html' || currentPage === 'service-detail.html') && href === 'services.html') {
            isActive = true;
        }
        // Projects pages
        else if ((currentPage === 'projects.html' || currentPage === 'project-detail.html') && href === 'projects.html') {
            isActive = true;
        }
        // About page
        else if (currentPage === 'about.html' && href === 'about.html') {
            isActive = true;
        }
        // Contact page (not in nav but just in case)
        else if (currentPage === 'contact.html' && href === 'contact.html') {
            isActive = true;
        }
        
        if (isActive) {
            link.classList.add('active');
            // Force inline styles as backup
            link.style.setProperty('color', 'var(--brand-400)', 'important');
            link.style.setProperty('font-weight', '600', 'important');
        }
    });
}

// Execute IMMEDIATELY - don't wait for anything
setActiveNavLink();

// Also execute on DOMContentLoaded
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Execute again after a short delay to catch any dynamic content
setTimeout(setActiveNavLink, 100);
setTimeout(setActiveNavLink, 500);

// Set current year in footer
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
