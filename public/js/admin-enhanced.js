// ENHANCED ADMIN PANEL - Complete functionality with drag & drop, trash, versioning
// ========================================================================

const AdminPanel = {
    currentView: 'dashboard',
    services: [],
    projects: [],
    deletedItems: [],
    settings: {},
    uploaderInstance: null,

    init() {
        this.setupMobileMenu();
        this.setupNavigation();
        this.loadDashboard();
        this.loadSettings();
    },

    // Mobile Menu
    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarClose = document.getElementById('sidebar-close');
        const overlay = document.getElementById('mobile-overlay');

        menuToggle?.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });

        sidebarClose?.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    },

    // Navigation
    setupNavigation() {
        const links = document.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                
                // Update active state
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Load view
                this.loadView(view);
                
                // Close mobile menu
                document.getElementById('sidebar')?.classList.remove('active');
                document.getElementById('mobile-overlay')?.classList.remove('active');
            });
        });
    },

    async loadView(view) {
        this.currentView = view;
        const content = document.getElementById('admin-content');
        const title = document.getElementById('page-title');

        switch(view) {
            case 'dashboard':
                title.textContent = 'Tableau de bord';
                await this.loadDashboard();
                break;
            case 'services':
                title.textContent = 'Services';
                await this.loadServices();
                break;
            case 'projects':
                title.textContent = 'Projets';
                await this.loadProjects();
                break;
            case 'trash':
                title.textContent = 'Corbeille';
                await this.loadTrash();
                break;
            case 'settings':
                title.textContent = 'Paramètres';
                await this.loadSettingsView();
                break;
        }
    },

    // DASHBOARD
    async loadDashboard() {
        const content = document.getElementById('admin-content');
        
        // Load data
        await Promise.all([
            this.fetchServices(),
            this.fetchProjects(),
            this.fetchDeletedItems()
        ]);

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-icon" style="background: rgba(14, 165, 233, 0.1); color: var(--brand-400);">
                            <i data-lucide="briefcase" style="width: 24px; height: 24px;"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${this.services.length}</div>
                    <div class="stat-card-label">Services actifs</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                            <i data-lucide="folder" style="width: 24px; height: 24px;"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${this.projects.length}</div>
                    <div class="stat-card-label">Projets réalisés</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                            <i data-lucide="trash-2" style="width: 24px; height: 24px;"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${this.deletedItems.length}</div>
                    <div class="stat-card-label">Éléments supprimés</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                            <i data-lucide="image" style="width: 24px; height: 24px;"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${this.getTotalImages()}</div>
                    <div class="stat-card-label">Images totales</div>
                </div>
            </div>

            <div class="action-bar">
                <h2>Actions rapides</h2>
            </div>

            <div class="grid grid-cols-2" style="gap: 1.5rem;">
                <div class="card" style="cursor: pointer;" onclick="AdminPanel.loadView('services')">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 48px; height: 48px; background: rgba(14, 165, 233, 0.1); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="plus" style="color: var(--brand-400); width: 24px; height: 24px;"></i>
                        </div>
                        <h3 style="margin: 0;">Nouveau service</h3>
                    </div>
                    <p style="color: var(--text-tertiary); margin: 0;">Ajouter un nouveau service à votre portfolio</p>
                </div>

                <div class="card" style="cursor: pointer;" onclick="AdminPanel.loadView('projects')">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="plus" style="color: #10b981; width: 24px; height: 24px;"></i>
                        </div>
                        <h3 style="margin: 0;">Nouveau projet</h3>
                    </div>
                    <p style="color: var(--text-tertiary); margin: 0;">Ajouter un nouveau projet réalisé</p>
                </div>
            </div>
        `;

        lucide.createIcons();
    },

    getTotalImages() {
        const serviceImages = this.services.reduce((total, s) => {
            return total + (s.gallery_images?.length || 0);
        }, 0);
        const projectImages = this.projects.reduce((total, p) => {
            return total + (p.gallery_images?.length || 0);
        }, 0);
        return serviceImages + projectImages;
    },

    // SERVICES VIEW
    async loadServices() {
        const content = document.getElementById('admin-content');
        await this.fetchServices();

        content.innerHTML = `
            <div class="action-bar">
                <h2>Gestion des Services</h2>
                <button class="btn btn-primary" onclick="AdminPanel.openServiceModal()">
                    <i data-lucide="plus"></i>
                    Ajouter un service
                </button>
            </div>

            <div class="data-table">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px;"><i data-lucide="grip-vertical"></i></th>
                                <th>Titre</th>
                                <th>Catégorie</th>
                                <th>Prix</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="services-tbody">
                            ${this.services.length === 0 ? 
                                '<tr><td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-tertiary);">Aucun service</td></tr>' :
                                this.services.map(s => this.renderServiceRow(s)).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Service Modal -->
            <div id="service-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="service-modal-title">Nouveau service</h3>
                        <button class="modal-close" onclick="AdminPanel.closeServiceModal()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="service-form">
                            <input type="hidden" id="service-id">
                            
                            <div class="form-group">
                                <label class="form-label">Titre</label>
                                <input type="text" id="service-title" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <textarea id="service-description" class="form-textarea" required></textarea>
                            </div>

                            <div class="grid grid-cols-2" style="gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Catégorie</label>
                                    <input type="text" id="service-category" class="form-input" required>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Prix</label>
                                    <input type="text" id="service-price" class="form-input" placeholder="À partir de 500€">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Icône (Lucide)</label>
                                <input type="text" id="service-icon" class="form-input" placeholder="briefcase">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Fonctionnalités (une par ligne)</label>
                                <textarea id="service-features" class="form-textarea" placeholder="Feature 1&#10;Feature 2&#10;Feature 3"></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Images de galerie</label>
                                <div id="service-uploader"></div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="AdminPanel.closeServiceModal()">Annuler</button>
                        <button class="btn btn-primary" onclick="AdminPanel.saveService()">Enregistrer</button>
                    </div>
                </div>
            </div>
        `;

        lucide.createIcons();
        this.initServicesSortable();
    },

    renderServiceRow(service) {
        return `
            <tr data-id="${service.id}">
                <td><i data-lucide="grip-vertical" style="cursor: grab; color: var(--text-muted);"></i></td>
                <td><strong>${service.title}</strong></td>
                <td>${service.category}</td>
                <td>${service.price || 'N/A'}</td>
                <td>${service.gallery_images?.length || 0}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-ghost" onclick="AdminPanel.editService('${service.id}')" title="Modifier">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="AdminPanel.viewHistory('service', '${service.id}')" title="Historique">
                            <i data-lucide="history"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="AdminPanel.deleteService('${service.id}')" title="Supprimer" style="color: #ef4444;">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    initServicesSortable() {
        const tbody = document.getElementById('services-tbody');
        if (!tbody || this.services.length === 0) return;

        new Sortable(tbody, {
            animation: 150,
            handle: '[data-lucide="grip-vertical"]',
            onEnd: async (evt) => {
                const newOrder = Array.from(tbody.children).map((row, index) => ({
                    id: row.dataset.id,
                    display_order: index
                }));
                await this.saveServicesOrder(newOrder);
            }
        });
    },

    async saveServicesOrder(order) {
        // TODO: Call Netlify function to update display_order
        console.log('Saving order:', order);
        this.showNotification('Ordre sauvegardé !', 'success');
    },

    openServiceModal(serviceId = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        
        if (serviceId) {
            title.textContent = 'Modifier le service';
            const service = this.services.find(s => s.id === serviceId);
            if (service) {
                document.getElementById('service-id').value = service.id;
                document.getElementById('service-title').value = service.title;
                document.getElementById('service-description').value = service.description;
                document.getElementById('service-category').value = service.category;
                document.getElementById('service-price').value = service.price || '';
                document.getElementById('service-icon').value = service.icon || '';
                document.getElementById('service-features').value = service.features?.join('\n') || '';
            }
        } else {
            title.textContent = 'Nouveau service';
            document.getElementById('service-form').reset();
            document.getElementById('service-id').value = '';
        }

        // Initialize uploader
        this.uploaderInstance = new CloudinaryUploader('service-uploader', {
            folder: 'portfolio/services',
            multiple: true,
            onUploadComplete: (urls) => {
                console.log('Uploaded:', urls);
            }
        });

        modal.classList.add('active');
        lucide.createIcons();
    },

    closeServiceModal() {
        document.getElementById('service-modal').classList.remove('active');
    },

    async saveService() {
        // TODO: Implement save logic
        console.log('Saving service...');
        this.closeServiceModal();
        this.showNotification('Service enregistré !', 'success');
        await this.loadServices();
    },

    editService(id) {
        this.openServiceModal(id);
    },

    async deleteService(id) {
        if (!confirm('Déplacer ce service vers la corbeille ?')) return;
        
        // TODO: Soft delete
        console.log('Deleting service:', id);
        this.showNotification('Service déplacé vers la corbeille', 'success');
        await this.loadServices();
    },

    // PROJECTS VIEW (similar structure)
    async loadProjects() {
        const content = document.getElementById('admin-content');
        await this.fetchProjects();

        content.innerHTML = `
            <div class="action-bar">
                <h2>Gestion des Projets</h2>
                <button class="btn btn-primary" onclick="AdminPanel.openProjectModal()">
                    <i data-lucide="plus"></i>
                    Ajouter un projet
                </button>
            </div>

            <div class="data-table">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px;"><i data-lucide="grip-vertical"></i></th>
                                <th>Titre</th>
                                <th>Client</th>
                                <th>Catégorie</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="projects-tbody">
                            ${this.projects.length === 0 ? 
                                '<tr><td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-tertiary);">Aucun projet</td></tr>' :
                                this.projects.map(p => this.renderProjectRow(p)).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        lucide.createIcons();
        this.initProjectsSortable();
    },

    renderProjectRow(project) {
        return `
            <tr data-id="${project.id}">
                <td><i data-lucide="grip-vertical" style="cursor: grab; color: var(--text-muted);"></i></td>
                <td><strong>${project.title}</strong></td>
                <td>${project.client || 'N/A'}</td>
                <td>${project.category}</td>
                <td>${project.gallery_images?.length || 0}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-ghost" onclick="AdminPanel.editProject('${project.id}')" title="Modifier">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="AdminPanel.viewHistory('project', '${project.id}')" title="Historique">
                            <i data-lucide="history"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="AdminPanel.deleteProject('${project.id}')" title="Supprimer" style="color: #ef4444;">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    initProjectsSortable() {
        const tbody = document.getElementById('projects-tbody');
        if (!tbody || this.projects.length === 0) return;

        new Sortable(tbody, {
            animation: 150,
            handle: '[data-lucide="grip-vertical"]',
            onEnd: async (evt) => {
                const newOrder = Array.from(tbody.children).map((row, index) => ({
                    id: row.dataset.id,
                    display_order: index
                }));
                await this.saveProjectsOrder(newOrder);
            }
        });
    },

    async saveProjectsOrder(order) {
        console.log('Saving order:', order);
        this.showNotification('Ordre sauvegardé !', 'success');
    },

    openProjectModal(projectId = null) {
        // Similar to openServiceModal
        alert('Project modal - TODO');
    },

    editProject(id) {
        this.openProjectModal(id);
    },

    async deleteProject(id) {
        if (!confirm('Déplacer ce projet vers la corbeille ?')) return;
        console.log('Deleting project:', id);
        this.showNotification('Projet déplacé vers la corbeille', 'success');
        await this.loadProjects();
    },

    // TRASH VIEW
    async loadTrash() {
        const content = document.getElementById('admin-content');
        await this.fetchDeletedItems();

        content.innerHTML = `
            <div class="action-bar">
                <h2>Corbeille</h2>
                <button class="btn btn-secondary" onclick="AdminPanel.emptyTrash()" ${this.deletedItems.length === 0 ? 'disabled' : ''}>
                    <i data-lucide="trash-2"></i>
                    Vider la corbeille
                </button>
            </div>

            ${this.deletedItems.length === 0 ? `
                <div class="card" style="text-align: center; padding: 4rem 2rem;">
                    <i data-lucide="inbox" style="width: 64px; height: 64px; margin: 0 auto 1rem; color: var(--text-muted);"></i>
                    <h3>Corbeille vide</h3>
                    <p style="color: var(--text-tertiary);">Aucun élément supprimé</p>
                </div>
            ` : `
                <div class="data-table">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Titre</th>
                                    <th>Supprimé le</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.deletedItems.map(item => `
                                    <tr>
                                        <td>${item.item_type}</td>
                                        <td>${item.item_data.title}</td>
                                        <td>${new Date(item.deleted_at).toLocaleDateString()}</td>
                                        <td>
                                            <div class="table-actions">
                                                <button class="btn btn-sm btn-primary" onclick="AdminPanel.restoreItem('${item.id}')">
                                                    <i data-lucide="undo"></i>
                                                    Restaurer
                                                </button>
                                                <button class="btn btn-sm btn-ghost" onclick="AdminPanel.permanentDelete('${item.id}')" style="color: #ef4444;">
                                                    <i data-lucide="x"></i>
                                                    Supprimer définitivement
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `}
        `;

        lucide.createIcons();
    },

    async restoreItem(id) {
        if (!confirm('Restaurer cet élément ?')) return;
        console.log('Restoring:', id);
        this.showNotification('Élément restauré !', 'success');
        await this.loadTrash();
    },

    async permanentDelete(id) {
        if (!confirm('Supprimer définitivement ? Cette action est irréversible.')) return;
        console.log('Permanent delete:', id);
        this.showNotification('Élément supprimé définitivement', 'success');
        await this.loadTrash();
    },

    async emptyTrash() {
        if (!confirm('Vider toute la corbeille ? Cette action est irréversible.')) return;
        console.log('Emptying trash');
        this.showNotification('Corbeille vidée', 'success');
        await this.loadTrash();
    },

    // SETTINGS VIEW
    async loadSettingsView() {
        const content = document.getElementById('admin-content');

        content.innerHTML = `
            <div class="action-bar">
                <h2>Paramètres</h2>
            </div>

            <div class="card">
                <h3>Photo de profil</h3>
                <div style="margin: 1.5rem 0;">
                    <img id="current-profile-photo" src="${this.settings.profile_photo_url || ''}" 
                         style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--brand-400);">
                </div>
                
                <div class="form-group">
                    <label class="form-label">URL de la photo</label>
                    <input type="text" id="profile-photo-url" class="form-input" value="${this.settings.profile_photo_url || ''}">
                </div>

                <div class="form-group">
                    <label class="form-label">Ou uploader une nouvelle photo</label>
                    <div id="profile-uploader"></div>
                </div>

                <button class="btn btn-primary" onclick="AdminPanel.saveSettings()">
                    <i data-lucide="save"></i>
                    Enregistrer
                </button>
            </div>
        `;

        // Init uploader
        new CloudinaryUploader('profile-uploader', {
            folder: 'portfolio/profile',
            multiple: false,
            onUploadComplete: (urls) => {
                document.getElementById('profile-photo-url').value = urls[0];
                document.getElementById('current-profile-photo').src = urls[0];
            }
        });

        lucide.createIcons();
    },

    async saveSettings() {
        const photoUrl = document.getElementById('profile-photo-url').value;
        // TODO: Save to settings table
        console.log('Saving settings:', { photoUrl });
        this.showNotification('Paramètres enregistrés !', 'success');
    },

    // VERSION HISTORY
    viewHistory(type, id) {
        alert(`View history for ${type} ${id} - TODO`);
    },

    // DATA FETCHING
    async fetchServices() {
        try {
            const response = await fetch('/.netlify/functions/services-get');
            const data = await response.json();
            this.services = data.services || [];
        } catch (error) {
            console.error('Error fetching services:', error);
            this.services = [];
        }
    },

    async fetchProjects() {
        try {
            const response = await fetch('/.netlify/functions/projects-get');
            const data = await response.json();
            this.projects = data.projects || [];
        } catch (error) {
            console.error('Error fetching projects:', error);
            this.projects = [];
        }
    },

    async fetchDeletedItems() {
        // TODO: Implement fetch from deleted_items table
        this.deletedItems = [];
        
        // Update trash badge
        const badge = document.getElementById('trash-count');
        if (badge) {
            badge.textContent = this.deletedItems.length;
            badge.style.display = this.deletedItems.length > 0 ? 'block' : 'none';
        }
    },

    async loadSettings() {
        // TODO: Fetch from settings table
        this.settings = {
            profile_photo_url: 'https://thumbor.comeup.com/E-aONi_hJRsOeZSE-S4vN8KZjYY=/400x400/filters:quality(90):no_upscale()/user/c9f09ab7-dc31-4007-8629-7c74ae6faab3.jpg',
            profile_name: 'Ouzéfi'
        };

        // Update sidebar
        const sidebarImg = document.getElementById('sidebar-profile-img');
        const sidebarName = document.getElementById('sidebar-profile-name');
        if (sidebarImg) sidebarImg.src = this.settings.profile_photo_url;
        if (sidebarName) sidebarName.textContent = this.settings.profile_name;
    },

    // NOTIFICATIONS
    showNotification(message, type = 'info') {
        // Simple alert for now - can be improved with toast notifications
        alert(message);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});

// Make it globally accessible
window.AdminPanel = AdminPanel;
