// Projects page JavaScript

let allProjects = [];
let currentCategory = 'all';

async function loadProjects() {
    const container = document.getElementById('projects-container');
    
    try {
        const response = await fetch('/.netlify/functions/projects-get');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            allProjects = result.data;
            
            // Extract unique categories
            const categories = [...new Set(allProjects.map(p => p.category).filter(c => c))];
            renderFilters(categories);
            
            // Render projects
            renderProjects(allProjects);
        } else {
            showEmptyState(container);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        showErrorState(container);
    }
}

function renderFilters(categories) {
    const filtersContainer = document.getElementById('category-filters');
    
    const allBtn = filtersContainer.querySelector('[data-category="all"]');
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-category', category);
        btn.textContent = category;
        btn.onclick = () => filterProjects(category);
        filtersContainer.appendChild(btn);
    });
    
    allBtn.onclick = () => filterProjects('all');
}

function filterProjects(category) {
    currentCategory = category;
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter and render
    const filtered = category === 'all' 
        ? allProjects 
        : allProjects.filter(p => p.category === category);
    
    renderProjects(filtered);
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-3';
    
    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(grid);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.onclick = () => window.location.href = `project-detail.html?slug=${project.slug}`;
    
    // Image
    const imageHtml = project.image_url ? `
        <div style="width: 100%; height: 220px; margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1));">
            <img src="${project.image_url}" alt="${project.title}" 
                 style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;\\\'><i data-lucide=\\'folder\\' style=\\'color: var(--emerald-500); width: 56px; height: 56px;\\'></i></div>';lucide.createIcons();">
        </div>
    ` : `
        <div style="width: 100%; height: 220px; margin-bottom: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1)); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="folder" style="color: var(--emerald-500); width: 56px; height: 56px;"></i>
        </div>
    `;
    
    // Featured badge
    const featuredBadge = project.is_featured ? `
        <div style="position: absolute; top: 1rem; right: 1rem; padding: 0.375rem 0.75rem; background: rgba(16, 185, 129, 0.9); backdrop-filter: blur(10px); border-radius: 999px; font-size: 0.75rem; color: white; font-weight: 600; display: flex; align-items: center; gap: 0.375rem;">
            <i data-lucide="star" style="width: 14px; height: 14px; fill: currentColor;"></i>
            Projet Phare
        </div>
    ` : '';
    
    card.innerHTML = `
        <div style="position: relative;">
            ${imageHtml}
            ${featuredBadge}
        </div>
        
        ${project.category ? `
            <div style="margin-bottom: 0.75rem;">
                <span style="font-size: 0.75rem; color: var(--emerald-500); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
                    ${project.category}
                </span>
            </div>
        ` : ''}
        
        <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; line-height: 1.3;">${project.title}</h3>
        
        <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.6; flex: 1;">
            ${project.short_description || 'Description non disponible'}
        </p>
        
        ${project.technologies && project.technologies.length > 0 ? `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                ${project.technologies.slice(0, 3).map(tech => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 999px; font-size: 0.75rem; color: var(--emerald-500);">
                        ${tech}
                    </span>
                `).join('')}
                ${project.technologies.length > 3 ? `
                    <span style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-muted);">
                        +${project.technologies.length - 3}
                    </span>
                ` : ''}
            </div>
        ` : ''}
        
        <div style="padding-top: 1rem; border-top: 1px solid var(--border-secondary); display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.875rem; color: var(--text-muted);">Voir le projet</span>
            <i data-lucide="arrow-right" style="color: var(--emerald-500); width: 20px; height: 20px;"></i>
        </div>
    `;
    
    return card;
}

function showEmptyState(container) {
    container.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem 2rem;">
            <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: rgba(100, 116, 139, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="inbox" style="color: var(--text-muted); width: 32px; height: 32px;"></i>
            </div>
            <h3 style="margin-bottom: 0.5rem;">Aucun projet disponible</h3>
            <p style="color: var(--text-muted);">Les projets seront ajoutés prochainement.</p>
        </div>
    `;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function showErrorState(container) {
    container.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem 2rem;">
            <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: rgba(249, 115, 22, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="alert-circle" style="color: var(--orange-500); width: 32px; height: 32px;"></i>
            </div>
            <h3 style="margin-bottom: 0.5rem;">Erreur de chargement</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Impossible de charger les projets.</p>
            <button onclick="location.reload()" class="btn btn-secondary">
                <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
                Réessayer
            </button>
        </div>
    `;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});
