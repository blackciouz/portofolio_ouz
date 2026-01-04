// Services page JavaScript

async function loadServices() {
    const container = document.getElementById('services-container');
    
    try {
        const response = await fetch('/.netlify/functions/services-get');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            // Create grid
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2';
            
            result.data.forEach(service => {
                const card = createServiceCard(service);
                grid.appendChild(card);
            });
            
            container.innerHTML = '';
            container.appendChild(grid);
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            showEmptyState(container);
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showErrorState(container);
    }
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.onclick = () => window.location.href = `service-detail.html?slug=${service.slug}`;
    
    const iconName = service.icon || 'box';
    
    // Features list
    let featuresHtml = '';
    if (service.features && Array.isArray(service.features) && service.features.length > 0) {
        const featuresToShow = service.features.slice(0, 4);
        featuresHtml = `
            <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; flex: 1;">
                ${featuresToShow.map(feature => `
                    <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative; color: var(--text-tertiary); font-size: 0.875rem;">
                        <i data-lucide="check" style="position: absolute; left: 0; top: 0.6rem; color: var(--brand-400); width: 16px; height: 16px;"></i>
                        ${feature}
                    </li>
                `).join('')}
                ${service.features.length > 4 ? `
                    <li style="padding: 0.5rem 0; color: var(--text-muted); font-size: 0.875rem;">
                        +${service.features.length - 4} autres fonctionnalités
                    </li>
                ` : ''}
            </ul>
        `;
    }
    
    // Technologies
    let techHtml = '';
    if (service.technologies && service.technologies.length > 0) {
        techHtml = `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                ${service.technologies.slice(0, 4).map(tech => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 999px; font-size: 0.75rem; color: var(--brand-400);">
                        ${tech}
                    </span>
                `).join('')}
            </div>
        `;
    }
    
    card.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 56px; height: 56px; flex-shrink: 0; background: rgba(14, 165, 233, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="${iconName}" style="color: var(--brand-400); width: 28px; height: 28px;"></i>
            </div>
            <div style="flex: 1;">
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${service.title}</h3>
                ${service.category ? `
                    <div style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 999px; font-size: 0.75rem; color: var(--purple-500); font-weight: 600;">
                        ${service.category}
                    </div>
                ` : ''}
            </div>
        </div>
        
        <p style="color: var(--text-tertiary); margin-bottom: 1.5rem; line-height: 1.6;">
            ${service.short_description || service.full_description || 'Description non disponible'}
        </p>
        
        ${featuresHtml}
        
        ${techHtml}
        
        <div style="padding-top: 1rem; margin-top: auto; border-top: 1px solid var(--border-secondary); display: flex; align-items: center; justify-content: space-between;">
            ${service.price_starting_from ? `
                <div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">À partir de</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--brand-400); font-family: var(--font-display);">
                        ${service.price_starting_from}€
                    </div>
                </div>
            ` : '<span></span>'}
            
            <button class="btn btn-secondary" style="pointer-events: none;">
                En savoir plus
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </button>
        </div>
        
        ${service.external_link ? `
            <a href="${service.external_link}" target="_blank" class="btn btn-ghost" 
               style="width: 100%; margin-top: 0.5rem; justify-content: center;"
               onclick="event.stopPropagation();">
                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                Lien externe
            </a>
        ` : ''}
    `;
    
    return card;
}

function showEmptyState(container) {
    container.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem 2rem;">
            <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: rgba(100, 116, 139, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="inbox" style="color: var(--text-muted); width: 32px; height: 32px;"></i>
            </div>
            <h3 style="margin-bottom: 0.5rem;">Aucun service disponible</h3>
            <p style="color: var(--text-muted);">Les services seront ajoutés prochainement.</p>
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
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Impossible de charger les services.</p>
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
    loadServices();
});
