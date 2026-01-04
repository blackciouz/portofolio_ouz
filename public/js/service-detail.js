// Service Detail Page JavaScript

async function loadServiceDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        showError('Aucun service spécifié');
        return;
    }
    
    try {
        const response = await fetch(`/.netlify/functions/services-get?slug=${slug}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            renderServiceDetail(result.data);
        } else {
            showError('Service non trouvé');
        }
    } catch (error) {
        console.error('Error loading service:', error);
        showError('Erreur de chargement');
    }
}

function renderServiceDetail(service) {
    const iconName = service.icon || 'box';
    const loadingState = document.getElementById('loading-state');
    const contentDiv = document.getElementById('service-content');
    
    // Update page title
    document.title = `${service.title} - Ouzéfi`;
    
    // Features section
    let featuresHtml = '';
    if (service.features && Array.isArray(service.features) && service.features.length > 0) {
        featuresHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="check-circle" style="color: var(--brand-400); width: 24px; height: 24px;"></i>
                    Fonctionnalités incluses
                </h3>
                <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                    ${service.features.map(feature => `
                        <li style="padding: 0.75rem; padding-left: 2.5rem; position: relative; background: rgba(255, 255, 255, 0.02); border-radius: 0.5rem; border: 1px solid var(--border-secondary);">
                            <i data-lucide="check" style="position: absolute; left: 0.75rem; top: 0.95rem; color: var(--brand-400); width: 18px; height: 18px;"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Technologies section
    let techHtml = '';
    if (service.technologies && service.technologies.length > 0) {
        techHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="code" style="color: var(--purple-500); width: 24px; height: 24px;"></i>
                    Technologies utilisées
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                    ${service.technologies.map(tech => `
                        <span style="padding: 0.5rem 1rem; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 0.5rem; font-size: 0.875rem; color: var(--brand-400); font-weight: 500;">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Gallery images
    let galleryHtml = '';
    if (service.gallery_images && service.gallery_images.length > 0) {
        galleryHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Galerie</h3>
                <div class="grid grid-cols-3" style="gap: 1rem;">
                    ${service.gallery_images.map(img => `
                        <img src="${img}" alt="Gallery" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.75rem; border: 1px solid var(--border-primary);">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    const html = `
        <!-- Hero Section -->
        <section class="section" style="padding-top: 140px; padding-bottom: 2rem;">
            <div class="container">
                <div style="margin-bottom: 1.5rem;">
                    <a href="services.html" class="btn btn-ghost" style="padding-left: 0;">
                        <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                        Retour aux services
                    </a>
                </div>
                
                <div class="grid grid-cols-1" style="gap: 3rem;">
                    <div>
                        <div style="display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem;">
                            <div style="width: 80px; height: 80px; flex-shrink: 0; background: rgba(14, 165, 233, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="${iconName}" style="color: var(--brand-400); width: 40px; height: 40px;"></i>
                            </div>
                            <div style="flex: 1;">
                                ${service.category ? `
                                    <div style="display: inline-block; padding: 0.375rem 1rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 999px; font-size: 0.875rem; color: var(--purple-500); font-weight: 600; margin-bottom: 1rem;">
                                        ${service.category}
                                    </div>
                                ` : ''}
                                <h1 style="margin-bottom: 1rem;">${service.title}</h1>
                                <p style="font-size: 1.25rem; color: var(--text-tertiary); line-height: 1.6;">
                                    ${service.short_description || ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="section section-sm">
            <div class="container">
                <div class="grid grid-cols-1" style="gap: 2rem;">
                    <!-- Description -->
                    ${service.full_description ? `
                        <div class="card">
                            <h3 style="margin-bottom: 1rem;">Description détaillée</h3>
                            <div style="color: var(--text-tertiary); line-height: 1.8; white-space: pre-wrap;">
                                ${service.full_description}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Features -->
                    ${featuresHtml}
                    
                    <!-- Technologies -->
                    ${techHtml}
                    
                    <!-- Gallery -->
                    ${galleryHtml}
                    
                    <!-- Pricing & CTA -->
                    <div class="card" style="text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(14, 165, 233, 0.2);">
                        ${service.price_starting_from ? `
                            <div style="margin-bottom: 2rem;">
                                <div style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    À partir de
                                </div>
                                <div style="font-size: 3rem; font-weight: 700; color: var(--brand-400); font-family: var(--font-display);">
                                    ${service.price_starting_from}€
                                </div>
                            </div>
                        ` : ''}
                        
                        <h3 style="margin-bottom: 1rem; font-size: 1.75rem;">Intéressé par ce service ?</h3>
                        <p style="color: var(--text-tertiary); max-width: 600px; margin: 0 auto 2rem;">
                            Discutons de votre projet et voyons comment je peux vous aider.
                        </p>
                        
                        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            <a href="contact.html" class="btn btn-primary btn-lg">
                                <i data-lucide="message-circle" style="width: 20px; height: 20px;"></i>
                                Demander un devis
                            </a>
                            
                            ${service.external_link ? `
                                <a href="${service.external_link}" target="_blank" class="btn btn-secondary btn-lg">
                                    <i data-lucide="external-link" style="width: 20px; height: 20px;"></i>
                                    Voir la démo
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    contentDiv.innerHTML = html;
    loadingState.style.display = 'none';
    contentDiv.style.display = 'block';
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function showError(message) {
    const loadingState = document.getElementById('loading-state');
    loadingState.innerHTML = `
        <div class="container">
            <div class="card" style="text-align: center; padding: 4rem 2rem;">
                <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: rgba(249, 115, 22, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="alert-circle" style="color: var(--orange-500); width: 32px; height: 32px;"></i>
                </div>
                <h3 style="margin-bottom: 0.5rem;">${message}</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Impossible de charger le service.</p>
                <a href="services.html" class="btn btn-secondary">
                    <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                    Retour aux services
                </a>
            </div>
        </div>
    `;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadServiceDetail();
});
