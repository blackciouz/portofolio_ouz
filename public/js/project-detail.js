// Project Detail Page JavaScript

async function loadProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        showError('Aucun projet spécifié');
        return;
    }
    
    try {
        const response = await fetch(`/.netlify/functions/projects-get?slug=${slug}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            renderProjectDetail(result.data);
        } else {
            showError('Projet non trouvé');
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showError('Erreur de chargement');
    }
}

function renderProjectDetail(project) {
    const loadingState = document.getElementById('loading-state');
    const contentDiv = document.getElementById('project-content');
    
    // Update page title
    document.title = `${project.title} - Ouzéfi`;
    
    // Project info section
    const projectInfo = [];
    if (project.client_name) projectInfo.push({ icon: 'user', label: 'Client', value: project.client_name });
    if (project.project_date) projectInfo.push({ icon: 'calendar', label: 'Date', value: new Date(project.project_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) });
    if (project.duration) projectInfo.push({ icon: 'clock', label: 'Durée', value: project.duration });
    if (project.my_role) projectInfo.push({ icon: 'briefcase', label: 'Mon rôle', value: project.my_role });
    
    let projectInfoHtml = '';
    if (projectInfo.length > 0) {
        projectInfoHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Informations du projet</h3>
                <div class="grid grid-cols-2" style="gap: 1.5rem;">
                    ${projectInfo.map(info => `
                        <div style="display: flex; align-items: start; gap: 0.75rem;">
                            <div style="width: 40px; height: 40px; flex-shrink: 0; background: rgba(16, 185, 129, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="${info.icon}" style="color: var(--emerald-500); width: 20px; height: 20px;"></i>
                            </div>
                            <div>
                                <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.25rem;">${info.label}</div>
                                <div style="font-weight: 600; color: var(--text-primary);">${info.value}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Technologies
    let techHtml = '';
    if (project.technologies && project.technologies.length > 0) {
        techHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="code" style="color: var(--brand-400); width: 24px; height: 24px;"></i>
                    Stack technique
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                    ${project.technologies.map(tech => `
                        <span style="padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 0.5rem; font-size: 0.875rem; color: var(--emerald-500); font-weight: 500;">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Stats
    let statsHtml = '';
    if (project.stats && Object.keys(project.stats).length > 0) {
        statsHtml = `
            <div class="card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(14, 165, 233, 0.05));">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="trending-up" style="color: var(--emerald-500); width: 24px; height: 24px;"></i>
                    Résultats & Impact
                </h3>
                <div class="grid grid-cols-3" style="gap: 2rem;">
                    ${Object.entries(project.stats).map(([key, value]) => `
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--emerald-500); font-family: var(--font-display); margin-bottom: 0.5rem;">
                                ${value}
                            </div>
                            <div style="font-size: 0.875rem; color: var(--text-muted); text-transform: capitalize;">
                                ${key.replace(/_/g, ' ')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Embedded files (Videos, PDFs, etc.)
    let embeddedFilesHtml = '';
    if (project.embedded_files && Array.isArray(project.embedded_files) && project.embedded_files.length > 0) {
        embeddedFilesHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="play-circle" style="color: var(--purple-500); width: 24px; height: 24px;"></i>
                    Démos & Documentation
                </h3>
                <div class="grid grid-cols-1" style="gap: 2rem;">
                    ${project.embedded_files.map(file => renderEmbeddedFile(file)).join('')}
                </div>
            </div>
        `;
    }
    
    // Gallery
    let galleryHtml = '';
    if (project.gallery_images && project.gallery_images.length > 0) {
        galleryHtml = `
            <div class="card">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="images" style="color: var(--brand-400); width: 24px; height: 24px;"></i>
                    Galerie
                </h3>
                <div class="grid grid-cols-2" style="gap: 1rem;">
                    ${project.gallery_images.map(img => `
                        <img src="${img}" alt="Gallery" style="width: 100%; height: 300px; object-fit: cover; border-radius: 0.75rem; border: 1px solid var(--border-primary); cursor: pointer; transition: transform 0.3s ease;" 
                             onmouseover="this.style.transform='scale(1.02)'"
                             onmouseout="this.style.transform='scale(1)'"
                             onclick="window.open('${img}', '_blank')">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Testimonial
    let testimonialHtml = '';
    if (project.testimonial && project.testimonial.text) {
        testimonialHtml = `
            <div class="card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(14, 165, 233, 0.05)); border: 1px solid rgba(139, 92, 246, 0.2);">
                <div style="text-align: center; max-width: 700px; margin: 0 auto;">
                    <i data-lucide="quote" style="color: var(--purple-500); width: 48px; height: 48px; margin: 0 auto 1.5rem;"></i>
                    <p style="font-size: 1.125rem; color: var(--text-primary); line-height: 1.8; margin-bottom: 1.5rem; font-style: italic;">
                        "${project.testimonial.text}"
                    </p>
                    ${project.testimonial.author ? `
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${project.testimonial.author}</div>
                            ${project.testimonial.role ? `<div style="font-size: 0.875rem; color: var(--text-muted);">${project.testimonial.role}</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    const html = `
        <!-- Hero Section -->
        <section class="section" style="padding-top: 140px; padding-bottom: 2rem;">
            <div class="container">
                <div style="margin-bottom: 1.5rem;">
                    <a href="projects.html" class="btn btn-ghost" style="padding-left: 0;">
                        <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                        Retour aux projets
                    </a>
                </div>
                
                <div class="grid grid-cols-1" style="gap: 2rem;">
                    <!-- Featured Image -->
                    ${project.image_url ? `
                        <div style="width: 100%; height: 400px; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1));">
                            <img src="${project.image_url}" alt="${project.title}" 
                                 style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    ` : ''}
                    
                    <!-- Title & Meta -->
                    <div>
                        ${project.category ? `
                            <div style="margin-bottom: 1rem;">
                                <span style="padding: 0.375rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 999px; font-size: 0.875rem; color: var(--emerald-500); font-weight: 600;">
                                    ${project.category}
                                </span>
                                ${project.is_featured ? `
                                    <span style="padding: 0.375rem 1rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 999px; font-size: 0.875rem; color: var(--purple-500); font-weight: 600; margin-left: 0.5rem;">
                                        <i data-lucide="star" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i>
                                        Projet Phare
                                    </span>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        <h1 style="margin-bottom: 1rem;">${project.title}</h1>
                        <p style="font-size: 1.25rem; color: var(--text-tertiary); line-height: 1.6;">
                            ${project.short_description || ''}
                        </p>
                        
                        ${project.external_link || project.demo_url || project.github_url ? `
                            <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
                                ${project.demo_url ? `
                                    <a href="${project.demo_url}" target="_blank" class="btn btn-primary">
                                        <i data-lucide="external-link" style="width: 18px; height: 18px;"></i>
                                        Voir la démo
                                    </a>
                                ` : ''}
                                ${project.github_url ? `
                                    <a href="${project.github_url}" target="_blank" class="btn btn-secondary">
                                        <i data-lucide="github" style="width: 18px; height: 18px;"></i>
                                        Code source
                                    </a>
                                ` : ''}
                                ${project.external_link && !project.demo_url ? `
                                    <a href="${project.external_link}" target="_blank" class="btn btn-primary">
                                        <i data-lucide="link" style="width: 18px; height: 18px;"></i>
                                        Lien externe
                                    </a>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>

        <!-- Content -->
        <section class="section section-sm">
            <div class="container">
                <div class="grid grid-cols-1" style="gap: 2rem;">
                    <!-- Description -->
                    ${project.full_description ? `
                        <div class="card">
                            <h3 style="margin-bottom: 1rem;">À propos du projet</h3>
                            <div style="color: var(--text-tertiary); line-height: 1.8; white-space: pre-wrap;">
                                ${project.full_description}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Project Info -->
                    ${projectInfoHtml}
                    
                    <!-- Technologies -->
                    ${techHtml}
                    
                    <!-- Stats -->
                    ${statsHtml}
                    
                    <!-- Embedded Files -->
                    ${embeddedFilesHtml}
                    
                    <!-- Gallery -->
                    ${galleryHtml}
                    
                    <!-- Testimonial -->
                    ${testimonialHtml}
                    
                    <!-- CTA -->
                    <div class="card" style="text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1)); border: 1px solid rgba(16, 185, 129, 0.2);">
                        <h3 style="margin-bottom: 1rem; font-size: 1.75rem;">Un projet similaire en tête ?</h3>
                        <p style="color: var(--text-tertiary); max-width: 600px; margin: 0 auto 2rem;">
                            Je peux créer des solutions sur mesure adaptées à vos besoins.
                        </p>
                        <a href="contact.html" class="btn btn-primary btn-lg">
                            <i data-lucide="message-circle" style="width: 20px; height: 20px;"></i>
                            Discutons de votre projet
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    contentDiv.innerHTML = html;
    loadingState.style.display = 'none';
    contentDiv.style.display = 'block';
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderEmbeddedFile(file) {
    if (!file || !file.url) return '';
    
    const title = file.title || 'Fichier intégré';
    const type = file.type || 'video';
    
    if (type === 'video') {
        // Support YouTube, Vimeo, or direct video
        let embedHtml = '';
        
        if (file.url.includes('youtube.com') || file.url.includes('youtu.be')) {
            const videoId = file.url.includes('youtu.be') 
                ? file.url.split('/').pop()
                : new URL(file.url).searchParams.get('v');
            embedHtml = `
                <div class="embed-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                </div>
            `;
        } else if (file.url.includes('vimeo.com')) {
            const videoId = file.url.split('/').pop();
            embedHtml = `
                <div class="embed-container">
                    <iframe src="https://player.vimeo.com/video/${videoId}" 
                            frameborder="0" 
                            allow="autoplay; fullscreen; picture-in-picture" 
                            allowfullscreen></iframe>
                </div>
            `;
        } else {
            embedHtml = `
                <div class="embed-container">
                    <video controls style="width: 100%; height: 100%;">
                        <source src="${file.url}" type="video/mp4">
                        Votre navigateur ne supporte pas la vidéo.
                    </video>
                </div>
            `;
        }
        
        return `
            <div>
                <h4 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="video" style="color: var(--purple-500); width: 20px; height: 20px;"></i>
                    ${title}
                </h4>
                ${embedHtml}
            </div>
        `;
    } else if (type === 'pdf') {
        return `
            <div>
                <h4 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="file-text" style="color: var(--brand-400); width: 20px; height: 20px;"></i>
                    ${title}
                </h4>
                <div class="embed-container" style="padding-bottom: 75%;">
                    <iframe src="${file.url}" frameborder="0"></iframe>
                </div>
            </div>
        `;
    }
    
    return '';
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
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Impossible de charger le projet.</p>
                <a href="projects.html" class="btn btn-secondary">
                    <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                    Retour aux projets
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
    loadProjectDetail();
});
