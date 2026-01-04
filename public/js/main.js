// Main JavaScript for Ouzefi Portfolio

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(3, 7, 18, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(3, 7, 18, 0.8)';
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index > 0) { // Skip hero section
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        }
    });
    
    // Load projects from API
    loadProjects();
});

// Load projects from Netlify Function (Supabase)
async function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    try {
        const response = await fetch('/.netlify/functions/get-projects');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            // Clear loading state
            projectsGrid.innerHTML = '';
            
            // Render projects
            result.data.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            // No projects found - show empty state
            projectsGrid.innerHTML = `
                <div class="glass-card" style="padding: 3rem; text-align: center; grid-column: 1 / -1;">
                    <i data-lucide="inbox" style="color: var(--text-gray); width: 48px; height: 48px; margin: 0 auto 1rem;"></i>
                    <h3 style="color: var(--text-white); margin-bottom: 0.5rem;">Aucun projet pour le moment</h3>
                    <p style="color: var(--text-gray);">Les projets seront ajoutés prochainement.</p>
                </div>
            `;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Show error state
        projectsGrid.innerHTML = `
            <div class="glass-card" style="padding: 3rem; text-align: center; grid-column: 1 / -1;">
                <i data-lucide="alert-circle" style="color: var(--alert-orange); width: 48px; height: 48px; margin: 0 auto 1rem;"></i>
                <h3 style="color: var(--text-white); margin-bottom: 0.5rem;">Erreur de chargement</h3>
                <p style="color: var(--text-gray);">Impossible de charger les projets. Veuillez réessayer plus tard.</p>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Create project card HTML
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'glass-card feature-card';
    card.style.cursor = 'pointer';
    
    // Format technologies
    const techTags = project.technologies && Array.isArray(project.technologies) 
        ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
        : '';
    
    // Featured badge
    const featuredBadge = project.featured 
        ? `<div style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 1rem; font-size: 0.75rem; color: var(--neon-emerald); margin-bottom: 1rem;">
                <i data-lucide="star" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i> Projet Phare
           </div>`
        : '';
    
    card.innerHTML = `
        ${featuredBadge}
        ${project.image_url ? `
            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(147, 51, 234, 0.1)); border-radius: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <img src="${project.image_url}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<i data-lucide=\\'box\\' style=\\'color: var(--brand-400); width: 48px; height: 48px;\\'></i>';">
            </div>
        ` : `
            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(147, 51, 234, 0.1)); border-radius: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="box" style="color: var(--brand-400); width: 48px; height: 48px;"></i>
            </div>
        `}
        
        <div style="margin-bottom: 0.5rem;">
            ${project.category ? `<span style="font-size: 0.75rem; color: var(--brand-400); text-transform: uppercase; letter-spacing: 0.05em;">${project.category}</span>` : ''}
        </div>
        
        <h3 style="margin-bottom: 1rem;">${project.title}</h3>
        
        <p style="color: var(--text-gray); margin-bottom: 1.5rem; line-height: 1.6;">
            ${project.description || 'Aucune description disponible.'}
        </p>
        
        ${techTags ? `<div class="tech-stack">${techTags}</div>` : ''}
        
        ${project.demo_url ? `
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
                <a href="${project.demo_url}" target="_blank" class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.875rem; padding: 0.75rem;">
                    <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                    Voir le projet
                </a>
            </div>
        ` : ''}
    `;
    
    return card;
}

// Add parallax effect to orbs
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Stats counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target === 100 ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
        }
    }, 30);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('%')) {
                    animateCounter(stat, 100);
                } else if (text.includes('+')) {
                    const num = parseInt(text.replace('+', ''));
                    animateCounter(stat, num);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    statsObserver.observe(statsGrid);
}

// Console Easter Egg
console.log('%c🚀 Ouzefi Portfolio', 'font-size: 20px; font-weight: bold; color: #0ea5e9;');
console.log('%cArchitecte de Systèmes d\'Automatisation & IA', 'font-size: 14px; color: #9ca3af;');
console.log('%cCe portfolio a été construit avec amour et automatisation 💙', 'font-size: 12px; color: #38bdf8;');
