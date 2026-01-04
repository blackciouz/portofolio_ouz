// Home page JavaScript

// Load featured services
async function loadFeaturedServices() {
    const container = document.getElementById('services-preview');
    
    try {
        const response = await fetch('/.netlify/functions/services-get?featured=true');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = '';
            
            // Show max 3 services
            const services = result.data.slice(0, 3);
            
            services.forEach(service => {
                const card = createServiceCard(service);
                container.appendChild(card);
            });
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            showEmptyState(container, 'Aucun service disponible');
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showErrorState(container, 'Erreur de chargement des services');
    }
}

// Load featured projects
async function loadFeaturedProjects() {
    const container = document.getElementById('projects-preview');
    
    try {
        const response = await fetch('/.netlify/functions/projects-get?featured=true');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = '';
            
            // Show max 3 projects
            const projects = result.data.slice(0, 3);
            
            projects.forEach(project => {
                const card = createProjectCard(project);
                container.appendChild(card);
            });
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            showEmptyState(container, 'Aucun projet disponible');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        showErrorState(container, 'Erreur de chargement des projets');
    }
}

// Create service card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `service-detail.html?slug=${service.slug}`;
    
    const iconName = service.icon || 'box';
    
    card.innerHTML = `
        <div style="width: 56px; height: 56px; margin-bottom: 1.5rem; background: rgba(14, 165, 233, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="${iconName}" style="color: var(--brand-400); width: 28px; height: 28px;"></i>
        </div>
        
        <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">${service.title}</h3>
        
        <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.6;">
            ${service.short_description || 'Description non disponible'}
        </p>
        
        ${service.category ? `
            <div style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 999px; font-size: 0.75rem; color: var(--purple-500); font-weight: 600;">
                ${service.category}
            </div>
        ` : ''}
        
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-secondary); display: flex; align-items: center; justify-content: space-between;">
            ${service.price_starting_from ? `
                <span style="font-size: 0.875rem; color: var(--text-muted);">
                    À partir de <strong style="color: var(--brand-400);">${service.price_starting_from}€</strong>
                </span>
            ` : '<span></span>'}
            
            <i data-lucide="arrow-right" style="color: var(--brand-400); width: 20px; height: 20px;"></i>
        </div>
    `;
    
    return card;
}

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `project-detail.html?slug=${project.slug}`;
    
    // Image or placeholder
    const imageHtml = project.image_url ? `
        <div style="width: 100%; height: 200px; margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1));">
            <img src="${project.image_url}" alt="${project.title}" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;\\\'><i data-lucide=\\'folder\\' style=\\'color: var(--brand-400); width: 48px; height: 48px;\\'></i></div>';">
        </div>
    ` : `
        <div style="width: 100%; height: 200px; margin-bottom: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1)); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="folder" style="color: var(--brand-400); width: 48px; height: 48px;"></i>
        </div>
    `;
    
    card.innerHTML = `
        ${imageHtml}
        
        <div style="margin-bottom: 0.5rem;">
            ${project.category ? `
                <span style="font-size: 0.75rem; color: var(--emerald-500); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
                    ${project.category}
                </span>
            ` : ''}
        </div>
        
        <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">${project.title}</h3>
        
        <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.6;">
            ${project.short_description || 'Description non disponible'}
        </p>
        
        ${project.technologies && project.technologies.length > 0 ? `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                ${project.technologies.slice(0, 3).map(tech => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 999px; font-size: 0.75rem; color: var(--brand-400);">
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

// Show empty state
function showEmptyState(container, message) {
    container.innerHTML = `
        <div class="card" style="text-align: center; grid-column: 1 / -1; padding: 3rem;">
            <i data-lucide="inbox" style="color: var(--text-muted); width: 48px; height: 48px; margin: 0 auto 1rem;"></i>
            <p style="color: var(--text-muted);">${message}</p>
        </div>
    `;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show error state
function showErrorState(container, message) {
    container.innerHTML = `
        <div class="card" style="text-align: center; grid-column: 1 / -1; padding: 3rem;">
            <i data-lucide="alert-circle" style="color: var(--orange-500); width: 48px; height: 48px; margin: 0 auto 1rem;"></i>
            <p style="color: var(--text-muted);">${message}</p>
            <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 1rem;">
                <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
                Réessayer
            </button>
        </div>
    `;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedServices();
    loadFeaturedProjects();
});
