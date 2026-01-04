// Admin Panel JavaScript

let adminPassword = '';
let editingServiceId = null;
let editingProjectId = null;

// Check if already logged in
const savedPassword = sessionStorage.getItem('adminPassword');
if (savedPassword) {
    adminPassword = savedPassword;
    showAdminPanel();
}

// Login handler
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    adminPassword = password;
    sessionStorage.setItem('adminPassword', password);
    showAdminPanel();
});

function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadServices();
    loadProjects();
}

function logout() {
    sessionStorage.removeItem('adminPassword');
    adminPassword = '';
    location.reload();
}

// Tab switching
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const technologies = document.getElementById('service-technologies').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);
    
    const data = {
        adminPassword: adminPassword,
        title: document.getElementById('service-title').value,
        category: document.getElementById('service-category').value,
        short_description: document.getElementById('service-short-desc').value,
        full_description: document.getElementById('service-full-desc').value,
        icon: document.getElementById('service-icon').value,
        price_starting_from: parseFloat(document.getElementById('service-price').value) || null,
        external_link: document.getElementById('service-external-link').value,
        technologies: technologies,
        is_featured: document.getElementById('service-featured').checked
    };
    
    try {
        let response;
        if (editingServiceId) {
            data.id = editingServiceId;
            response = await fetch('/.netlify/functions/services-update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch('/.netlify/functions/services-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(editingServiceId ? 'Service mis à jour !' : 'Service ajouté !', 'success');
            resetServiceForm();
            loadServices();
        } else {
            showAlert(result.error || 'Erreur', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur de connexion', 'error');
    }
});

async function loadServices() {
    const container = document.getElementById('services-list');
    
    try {
        const response = await fetch('/.netlify/functions/services-get');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(service => {
                container.appendChild(createServiceItem(service));
            });
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            container.innerHTML = '<div class="card" style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Aucun service</p></div>';
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="card" style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Erreur de chargement</p></div>';
    }
}

function createServiceItem(service) {
    const item = document.createElement('div');
    item.className = 'item-card';
    
    item.innerHTML = `
        <div class="item-info">
            <h4 style="margin-bottom: 0.5rem;">
                ${service.title}
                ${service.is_featured ? '<span style="display: inline-block; padding: 0.25rem 0.5rem; background: rgba(16, 185, 129, 0.2); border-radius: 0.25rem; font-size: 0.75rem; color: var(--emerald-500); margin-left: 0.5rem;">Phare</span>' : ''}
            </h4>
            ${service.category ? `<p style="color: var(--brand-400); font-size: 0.875rem; margin-bottom: 0.5rem;">${service.category}</p>` : ''}
            <p style="color: var(--text-tertiary); font-size: 0.875rem;">${service.short_description || 'Pas de description'}</p>
            ${service.price_starting_from ? `<p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">Prix: ${service.price_starting_from}€</p>` : ''}
        </div>
        <div class="item-actions">
            <button onclick="editService('${service.id}')" class="btn btn-secondary btn-sm">
                <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
            </button>
            <button onclick="deleteService('${service.id}')" class="btn btn-danger btn-sm">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
        </div>
    `;
    
    return item;
}

async function editService(id) {
    try {
        const response = await fetch('/.netlify/functions/services-get');
        const result = await response.json();
        
        if (result.success) {
            const service = result.data.find(s => s.id === id);
            if (service) {
                editingServiceId = id;
                document.getElementById('service-title').value = service.title;
                document.getElementById('service-category').value = service.category || '';
                document.getElementById('service-short-desc').value = service.short_description || '';
                document.getElementById('service-full-desc').value = service.full_description || '';
                document.getElementById('service-icon').value = service.icon || '';
                document.getElementById('service-price').value = service.price_starting_from || '';
                document.getElementById('service-external-link').value = service.external_link || '';
                document.getElementById('service-technologies').value = Array.isArray(service.technologies) ? service.technologies.join(', ') : '';
                document.getElementById('service-featured').checked = service.is_featured || false;
                
                document.getElementById('service-form-title').textContent = 'Modifier le service';
                document.getElementById('service-submit-text').textContent = 'Mettre à jour';
                
                document.querySelector('#services-tab .card').scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors du chargement', 'error');
    }
}

async function deleteService(id) {
    if (!confirm('Supprimer ce service ?')) return;
    
    try {
        const response = await fetch('/.netlify/functions/services-delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminPassword: adminPassword, id: id })
        });
        
        const result = await response.json();
        if (result.success) {
            showAlert('Service supprimé !', 'success');
            loadServices();
        } else {
            showAlert(result.error || 'Erreur', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur de connexion', 'error');
    }
}

function resetServiceForm() {
    editingServiceId = null;
    document.getElementById('service-form').reset();
    document.getElementById('service-form-title').textContent = 'Ajouter un service';
    document.getElementById('service-submit-text').textContent = 'Ajouter';
}

// ============================================
// PROJECTS MANAGEMENT
// ============================================

document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const technologies = document.getElementById('project-technologies').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);
    
    const data = {
        adminPassword: adminPassword,
        title: document.getElementById('project-title').value,
        category: document.getElementById('project-category').value,
        short_description: document.getElementById('project-short-desc').value,
        full_description: document.getElementById('project-full-desc').value,
        image_url: document.getElementById('project-image').value,
        demo_url: document.getElementById('project-demo').value,
        technologies: technologies,
        is_featured: document.getElementById('project-featured').checked
    };
    
    try {
        let response;
        if (editingProjectId) {
            data.id = editingProjectId;
            response = await fetch('/.netlify/functions/projects-update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch('/.netlify/functions/projects-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(editingProjectId ? 'Projet mis à jour !' : 'Projet ajouté !', 'success');
            resetProjectForm();
            loadProjects();
        } else {
            showAlert(result.error || 'Erreur', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur de connexion', 'error');
    }
});

async function loadProjects() {
    const container = document.getElementById('projects-list');
    
    try {
        const response = await fetch('/.netlify/functions/projects-get');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(project => {
                container.appendChild(createProjectItem(project));
            });
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            container.innerHTML = '<div class="card" style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Aucun projet</p></div>';
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="card" style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Erreur de chargement</p></div>';
    }
}

function createProjectItem(project) {
    const item = document.createElement('div');
    item.className = 'item-card';
    
    const techStack = project.technologies && Array.isArray(project.technologies) 
        ? project.technologies.slice(0, 3).join(', ') + (project.technologies.length > 3 ? '...' : '')
        : '';
    
    item.innerHTML = `
        <div class="item-info">
            <h4 style="margin-bottom: 0.5rem;">
                ${project.title}
                ${project.is_featured ? '<span style="display: inline-block; padding: 0.25rem 0.5rem; background: rgba(16, 185, 129, 0.2); border-radius: 0.25rem; font-size: 0.75rem; color: var(--emerald-500); margin-left: 0.5rem;">Phare</span>' : ''}
            </h4>
            ${project.category ? `<p style="color: var(--emerald-500); font-size: 0.875rem; margin-bottom: 0.5rem;">${project.category}</p>` : ''}
            <p style="color: var(--text-tertiary); font-size: 0.875rem;">${project.short_description || 'Pas de description'}</p>
            ${techStack ? `<p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">Tech: ${techStack}</p>` : ''}
        </div>
        <div class="item-actions">
            <button onclick="editProject('${project.id}')" class="btn btn-secondary btn-sm">
                <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
            </button>
            <button onclick="deleteProject('${project.id}')" class="btn btn-danger btn-sm">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
        </div>
    `;
    
    return item;
}

async function editProject(id) {
    try {
        const response = await fetch('/.netlify/functions/projects-get');
        const result = await response.json();
        
        if (result.success) {
            const project = result.data.find(p => p.id === id);
            if (project) {
                editingProjectId = id;
                document.getElementById('project-title').value = project.title;
                document.getElementById('project-category').value = project.category || '';
                document.getElementById('project-short-desc').value = project.short_description || '';
                document.getElementById('project-full-desc').value = project.full_description || '';
                document.getElementById('project-image').value = project.image_url || '';
                document.getElementById('project-demo').value = project.demo_url || '';
                document.getElementById('project-technologies').value = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
                document.getElementById('project-featured').checked = project.is_featured || false;
                
                document.getElementById('project-form-title').textContent = 'Modifier le projet';
                document.getElementById('project-submit-text').textContent = 'Mettre à jour';
                
                // Switch to projects tab if not already there
                switchTab('projects');
                document.querySelector('#projects-tab .card').scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors du chargement', 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Supprimer ce projet ?')) return;
    
    try {
        const response = await fetch('/.netlify/functions/projects-delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminPassword: adminPassword, id: id })
        });
        
        const result = await response.json();
        if (result.success) {
            showAlert('Projet supprimé !', 'success');
            loadProjects();
        } else {
            showAlert(result.error || 'Erreur', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur de connexion', 'error');
    }
}

function resetProjectForm() {
    editingProjectId = null;
    document.getElementById('project-form').reset();
    document.getElementById('project-form-title').textContent = 'Ajouter un projet';
    document.getElementById('project-submit-text').textContent = 'Ajouter';
}

// ============================================
// UTILITIES
// ============================================

function showAlert(message, type) {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" style="width: 20px; height: 20px;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(alert);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

console.log('%c🔐 Admin Panel Loaded', 'font-size: 18px; font-weight: bold; color: #0ea5e9;');
