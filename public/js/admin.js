// Admin Panel JavaScript

let adminPassword = '';
let editingProjectId = null;

// Check if already logged in
const savedPassword = sessionStorage.getItem('adminPassword');
if (savedPassword) {
    adminPassword = savedPassword;
    showAdminPanel();
}

// Login form handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    // Test the password by making a simple request
    try {
        const response = await fetch('/.netlify/functions/get-projects');
        if (response.ok) {
            adminPassword = password;
            sessionStorage.setItem('adminPassword', password);
            showAdminPanel();
            loadProjects();
        }
    } catch (error) {
        showAlert('Erreur de connexion', 'error');
    }
});

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadProjects();
}

// Logout
function logout() {
    sessionStorage.removeItem('adminPassword');
    adminPassword = '';
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('admin-password').value = '';
}

// Project form handler
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectData = {
        adminPassword: adminPassword,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        technologies: document.getElementById('technologies').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
        image_url: document.getElementById('image_url').value,
        demo_url: document.getElementById('demo_url').value,
        featured: document.getElementById('featured').checked
    };
    
    try {
        let response;
        
        if (editingProjectId) {
            // Update existing project
            projectData.id = editingProjectId;
            response = await fetch('/.netlify/functions/update-project', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
        } else {
            // Create new project
            response = await fetch('/.netlify/functions/create-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(
                editingProjectId ? 'Projet mis à jour avec succès !' : 'Projet ajouté avec succès !',
                'success'
            );
            resetForm();
            loadProjects();
        } else {
            showAlert(result.error || 'Erreur lors de l\'enregistrement', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur de connexion au serveur', 'error');
    }
});

// Load projects
async function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    
    try {
        const response = await fetch('/.netlify/functions/get-projects');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            projectsList.innerHTML = '';
            
            result.data.forEach(project => {
                const projectItem = createProjectItem(project);
                projectsList.appendChild(projectItem);
            });
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            projectsList.innerHTML = `
                <div class="glass-card" style="padding: 2rem; text-align: center;">
                    <i data-lucide="inbox" style="color: var(--text-gray); width: 32px; height: 32px;"></i>
                    <p style="margin-top: 1rem; color: var(--text-gray);">Aucun projet pour le moment</p>
                </div>
            `;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = `
            <div class="glass-card" style="padding: 2rem; text-align: center;">
                <i data-lucide="alert-circle" style="color: var(--alert-orange); width: 32px; height: 32px;"></i>
                <p style="margin-top: 1rem; color: var(--text-gray);">Erreur de chargement</p>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Create project item
function createProjectItem(project) {
    const item = document.createElement('div');
    item.className = 'project-item';
    
    const techStack = project.technologies && Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : '';
    
    const featuredBadge = project.featured
        ? '<span style="display: inline-block; padding: 0.25rem 0.5rem; background: rgba(16, 185, 129, 0.2); border-radius: 0.25rem; font-size: 0.75rem; color: var(--neon-emerald); margin-left: 0.5rem;">Phare</span>'
        : '';
    
    item.innerHTML = `
        <div class="project-info">
            <h4 style="margin-bottom: 0.5rem;">
                ${project.title}
                ${featuredBadge}
            </h4>
            ${project.category ? `<p style="color: var(--brand-400); font-size: 0.875rem; margin-bottom: 0.5rem;">${project.category}</p>` : ''}
            <p style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.5rem;">${project.description || 'Pas de description'}</p>
            ${techStack ? `<p style="color: var(--text-gray); font-size: 0.75rem;">Technologies: ${techStack}</p>` : ''}
            ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" style="color: var(--brand-400); font-size: 0.75rem; text-decoration: none;">Voir le projet →</a>` : ''}
        </div>
        <div class="project-actions">
            <button onclick="editProject('${project.id}')" class="btn btn-secondary btn-small">
                <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
            </button>
            <button onclick="deleteProject('${project.id}')" class="btn btn-danger btn-small">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
        </div>
    `;
    
    return item;
}

// Edit project
async function editProject(projectId) {
    try {
        const response = await fetch('/.netlify/functions/get-projects');
        const result = await response.json();
        
        if (result.success) {
            const project = result.data.find(p => p.id === projectId);
            
            if (project) {
                editingProjectId = projectId;
                
                // Fill form
                document.getElementById('project-id').value = project.id;
                document.getElementById('title').value = project.title;
                document.getElementById('description').value = project.description || '';
                document.getElementById('category').value = project.category || '';
                document.getElementById('technologies').value = Array.isArray(project.technologies) 
                    ? project.technologies.join(', ') 
                    : '';
                document.getElementById('image_url').value = project.image_url || '';
                document.getElementById('demo_url').value = project.demo_url || '';
                document.getElementById('featured').checked = project.featured || false;
                
                // Update form UI
                document.getElementById('form-title').textContent = 'Modifier le projet';
                document.getElementById('submit-text').textContent = 'Mettre à jour';
                
                // Scroll to form
                document.querySelector('.project-form').scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showAlert('Erreur lors du chargement du projet', 'error');
    }
}

// Delete project
async function deleteProject(projectId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        return;
    }
    
    try {
        const response = await fetch('/.netlify/functions/delete-project', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminPassword: adminPassword,
                id: projectId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Projet supprimé avec succès !', 'success');
            loadProjects();
        } else {
            showAlert(result.error || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur de connexion au serveur', 'error');
    }
}

// Reset form
function resetForm() {
    editingProjectId = null;
    document.getElementById('project-form').reset();
    document.getElementById('project-id').value = '';
    document.getElementById('form-title').textContent = 'Ajouter un nouveau projet';
    document.getElementById('submit-text').textContent = 'Ajouter le projet';
}

// Show alert
function showAlert(message, type) {
    const container = document.getElementById('alert-container');
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" style="width: 20px; height: 20px;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(alert);
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Console message
console.log('%c🔐 Admin Panel', 'font-size: 18px; font-weight: bold; color: #0ea5e9;');
console.log('%cGestion des projets du portfolio', 'font-size: 12px; color: #9ca3af;');
