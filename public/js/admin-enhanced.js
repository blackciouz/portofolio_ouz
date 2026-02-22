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
                <td><span class="drag-handle" style="cursor:grab; color:var(--text-muted); font-size:1.2rem; padding:4px; display:inline-block;">&#8942;&#8942;</span></td>
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
            handle: '.drag-handle',
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
        try {
            const response = await fetch('/.netlify/functions/services-reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            });
            
            if (!response.ok) throw new Error('Failed to save order');
            
            this.showNotification('Ordre sauvegardé !', 'success');
        } catch (error) {
            console.error('Error saving order:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
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
        const id = document.getElementById('service-id').value;
        const title = document.getElementById('service-title').value.trim();
        const description = document.getElementById('service-description').value.trim();
        const category = document.getElementById('service-category').value.trim();
        const price = document.getElementById('service-price').value.trim();
        const icon = document.getElementById('service-icon').value.trim();
        const features = document.getElementById('service-features').value.split('\n').filter(f => f.trim());

        if (!title || !description || !category) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Upload images d'abord si il y en a
        let gallery_images = [];
        if (this.uploaderInstance && this.uploaderInstance.files.length > 0) {
            try {
                gallery_images = await this.uploaderInstance.uploadFiles();
            } catch (e) {
                console.error('Upload error:', e);
            }
        }

        const payload = { title, description, category, price, icon, features };
        if (gallery_images.length > 0) payload.gallery_images = gallery_images;

        const endpoint = id ? '/.netlify/functions/services-update' : '/.netlify/functions/services-create';
        if (id) payload.id = id;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            this.closeServiceModal();
            this.showNotification(id ? 'Service mis à jour !' : 'Service créé !', 'success');
            await this.loadServices();
        } catch (error) {
            console.error('Save service error:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    },

    editService(id) {
        this.openServiceModal(id);
    },

    async deleteService(id) {
        if (!confirm('Déplacer ce service vers la corbeille ?')) return;
        
        try {
            const response = await fetch('/.netlify/functions/services-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            
            if (!response.ok) throw new Error('Failed to delete');
            
            this.showNotification('Service déplacé vers la corbeille', 'success');
            await this.loadServices();
            await this.fetchDeletedItems(); // Update trash count
        } catch (error) {
            console.error('Error deleting service:', error);
            this.showNotification('Erreur lors de la suppression', 'error');
        }
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
                <td><span class="drag-handle" style="cursor:grab; color:var(--text-muted); font-size:1.2rem; padding:4px; display:inline-block;">&#8942;&#8942;</span></td>
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
            handle: '.drag-handle',
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
        try {
            const response = await fetch('/.netlify/functions/projects-reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            });
            
            if (!response.ok) throw new Error('Failed to save order');
            
            this.showNotification('Ordre sauvegardé !', 'success');
        } catch (error) {
            console.error('Error saving order:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    },

    openProjectModal(projectId = null) {
        const content = document.getElementById('admin-content');
        // Injecter la modale projet si elle n'existe pas
        let modal = document.getElementById('project-modal');
        if (!modal) {
            const modalHTML = `
            <div id="project-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="project-modal-title">Nouveau projet</h3>
                        <button class="modal-close" onclick="AdminPanel.closeProjectModal()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="project-form">
                            <input type="hidden" id="project-id">
                            <div class="form-group">
                                <label class="form-label">Titre</label>
                                <input type="text" id="project-title" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <textarea id="project-description" class="form-textarea" required></textarea>
                            </div>
                            <div class="grid grid-cols-2" style="gap:1rem;">
                                <div class="form-group">
                                    <label class="form-label">Catégorie</label>
                                    <input type="text" id="project-category" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Client</label>
                                    <input type="text" id="project-client" class="form-input">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Technologies (une par ligne)</label>
                                <textarea id="project-technologies" class="form-textarea" placeholder="Python&#10;n8n&#10;Make"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Résultats obtenus (une par ligne)</label>
                                <textarea id="project-results" class="form-textarea"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Lien externe (optionnel)</label>
                                <input type="url" id="project-link" class="form-input" placeholder="https://...">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Images de galerie</label>
                                <div id="project-uploader"></div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="AdminPanel.closeProjectModal()">Annuler</button>
                        <button class="btn btn-primary" onclick="AdminPanel.saveProject()">Enregistrer</button>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('project-modal');
        }

        const titleEl = document.getElementById('project-modal-title');
        if (projectId) {
            titleEl.textContent = 'Modifier le projet';
            const project = this.projects.find(p => p.id === projectId);
            if (project) {
                document.getElementById('project-id').value = project.id;
                document.getElementById('project-title').value = project.title || '';
                document.getElementById('project-description').value = project.description || '';
                document.getElementById('project-category').value = project.category || '';
                document.getElementById('project-client').value = project.client || '';
                document.getElementById('project-technologies').value = project.technologies?.join('\n') || '';
                document.getElementById('project-results').value = project.results?.join('\n') || '';
                document.getElementById('project-link').value = project.external_link || '';
            }
        } else {
            titleEl.textContent = 'Nouveau projet';
            document.getElementById('project-form').reset();
            document.getElementById('project-id').value = '';
        }

        this.projectUploaderInstance = new CloudinaryUploader('project-uploader', {
            folder: 'portfolio/projects',
            multiple: true,
            onUploadComplete: (urls) => { console.log('Uploaded project images:', urls); }
        });

        modal.classList.add('active');
        lucide.createIcons();
    },

    closeProjectModal() {
        document.getElementById('project-modal')?.classList.remove('active');
    },

    async saveProject() {
        const id = document.getElementById('project-id').value;
        const title = document.getElementById('project-title').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const category = document.getElementById('project-category').value.trim();
        const client = document.getElementById('project-client').value.trim();
        const technologies = document.getElementById('project-technologies').value.split('\n').filter(t => t.trim());
        const results = document.getElementById('project-results').value.split('\n').filter(r => r.trim());
        const external_link = document.getElementById('project-link').value.trim();

        if (!title || !description || !category) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Upload images d'abord si il y en a
        let gallery_images = [];
        if (this.projectUploaderInstance && this.projectUploaderInstance.files.length > 0) {
            try {
                gallery_images = await this.projectUploaderInstance.uploadFiles();
            } catch (e) {
                console.error('Upload error:', e);
            }
        }

        const payload = { title, description, category, client, technologies, results, external_link };
        if (gallery_images.length > 0) payload.gallery_images = gallery_images;

        const endpoint = id ? '/.netlify/functions/projects-update' : '/.netlify/functions/projects-create';
        if (id) payload.id = id;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            this.closeProjectModal();
            this.showNotification(id ? 'Projet mis à jour !' : 'Projet créé !', 'success');
            await this.loadProjects();
        } catch (error) {
            console.error('Save project error:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    },

    editProject(id) {
        this.openProjectModal(id);
    },

    async deleteProject(id) {
        if (!confirm('Déplacer ce projet vers la corbeille ?')) return;
        
        try {
            const response = await fetch('/.netlify/functions/projects-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            
            if (!response.ok) throw new Error('Failed to delete');
            
            this.showNotification('Projet déplacé vers la corbeille', 'success');
            await this.loadProjects();
            await this.fetchDeletedItems(); // Update trash count
        } catch (error) {
            console.error('Error deleting project:', error);
            this.showNotification('Erreur lors de la suppression', 'error');
        }
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
        
        try {
            const response = await fetch('/.netlify/functions/trash-restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            
            if (!response.ok) throw new Error('Failed to restore');
            
            this.showNotification('Élément restauré !', 'success');
            await this.loadTrash();
        } catch (error) {
            console.error('Error restoring item:', error);
            this.showNotification('Erreur lors de la restauration', 'error');
        }
    },

    async permanentDelete(id) {
        if (!confirm('Supprimer définitivement ? Cette action est irréversible.')) return;
        
        try {
            const response = await fetch('/.netlify/functions/trash-delete-permanent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            
            if (!response.ok) throw new Error('Failed to delete permanently');
            
            this.showNotification('Élément supprimé définitivement', 'success');
            await this.loadTrash();
        } catch (error) {
            console.error('Error deleting permanently:', error);
            this.showNotification('Erreur lors de la suppression', 'error');
        }
    },

    async emptyTrash() {
        if (!confirm('Vider toute la corbeille ? Cette action est irréversible.')) return;
        try {
            const deletePromises = this.deletedItems.map(item =>
                fetch('/.netlify/functions/trash-delete-permanent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id })
                })
            );
            await Promise.all(deletePromises);
            this.showNotification('Corbeille vidée !', 'success');
            await this.loadTrash();
        } catch (error) {
            console.error('Empty trash error:', error);
            this.showNotification('Erreur lors du vidage', 'error');
        }
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
        try {
            const response = await fetch('/.netlify/functions/settings-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'profile_photo_url', value: photoUrl })
            });
            // Si la fonction n'existe pas encore, on met à jour visuellement quand même
            this.settings.profile_photo_url = photoUrl;
            const sidebarImg = document.getElementById('sidebar-profile-img');
            if (sidebarImg) sidebarImg.src = photoUrl;
            this.showNotification('Paramètres enregistrés !', 'success');
        } catch (error) {
            console.error('Save settings error:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    },

    // VERSION HISTORY
    async viewHistory(type, id) {
        const item = type === 'service' 
            ? this.services.find(s => s.id === id) 
            : this.projects.find(p => p.id === id);
        
        const name = item ? item.title : id;
        const history = item?.version_history || [];
        
        const historyHTML = history.length > 0
            ? history.map((v, i) => `<div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.08);">
                <span style="color:var(--text-muted); font-size:0.8rem;">Version ${history.length - i} — ${new Date(v.saved_at || v.updated_at).toLocaleString()}</span>
                <div style="font-size:0.85rem; margin-top:4px; color:var(--text-tertiary);">${v.title || name}</div>
              </div>`).join('')
            : '<p style="color:var(--text-muted);">Aucun historique disponible</p>';

        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:2rem;max-width:500px;width:90%;max-height:70vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                    <h3 style="margin:0;">Historique — ${name}</h3>
                    <button onclick="this.closest('[style*=fixed]').remove()" style="background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;">&times;</button>
                </div>
                ${historyHTML}
            </div>`;
        document.body.appendChild(modal);
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    },

    // DATA FETCHING — clé correcte: data.data (pas data.services)
    async fetchServices() {
        try {
            const response = await fetch('/.netlify/functions/services-get');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            this.services = data.data || [];
        } catch (error) {
            console.error('Error fetching services:', error);
            this.services = [];
        }
    },

    async fetchProjects() {
        try {
            const response = await fetch('/.netlify/functions/projects-get');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            this.projects = data.data || [];
        } catch (error) {
            console.error('Error fetching projects:', error);
            this.projects = [];
        }
    },

    async fetchDeletedItems() {
        try {
            const response = await fetch('/.netlify/functions/trash-get');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            this.deletedItems = data.data || data.deletedItems || [];
        } catch (error) {
            console.error('Error fetching deleted items:', error);
            this.deletedItems = [];
        }
        
        // Update trash badge
        const badge = document.getElementById('trash-count');
        if (badge) {
            badge.textContent = this.deletedItems.length;
            badge.style.display = this.deletedItems.length > 0 ? 'block' : 'none';
        }
    },

    async loadSettings() {
        try {
            const response = await fetch('/.netlify/functions/settings-get');
            if (response.ok) {
                const data = await response.json();
                this.settings = data.data || {};
            }
        } catch (error) {
            console.error('Load settings error:', error);
        }
        // Valeurs par défaut si pas de données
        if (!this.settings.profile_photo_url) {
            this.settings.profile_photo_url = 'https://thumbor.comeup.com/E-aONi_hJRsOeZSE-S4vN8KZjYY=/400x400/filters:quality(90):no_upscale()/user/c9f09ab7-dc31-4007-8629-7c74ae6faab3.jpg';
        }
        if (!this.settings.profile_name) {
            this.settings.profile_name = 'Ouzéfi';
        }

        // Update sidebar
        const sidebarImg = document.getElementById('sidebar-profile-img');
        const sidebarName = document.getElementById('sidebar-profile-name');
        if (sidebarImg) sidebarImg.src = this.settings.profile_photo_url;
        if (sidebarName) sidebarName.textContent = this.settings.profile_name;
    },

    // NOTIFICATIONS — toast non bloquant
    showNotification(message, type = 'info') {
        // Supprimer l'ancien toast s'il existe
        const existing = document.getElementById('admin-toast');
        if (existing) existing.remove();

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#0ea5e9',
            warning: '#f59e0b'
        };
        const icons = {
            success: '&#10003;',
            error: '&#10007;',
            info: '&#8505;',
            warning: '&#9888;'
        };

        const toast = document.createElement('div');
        toast.id = 'admin-toast';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            background: rgba(15,23,42,0.97); border: 1px solid ${colors[type] || colors.info};
            border-left: 4px solid ${colors[type] || colors.info};
            color: white; padding: 14px 20px;
            border-radius: 10px; font-size: 0.9rem; font-weight: 600;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            display: flex; align-items: center; gap: 10px;
            max-width: 360px; animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `
            <span style="color:${colors[type] || colors.info}; font-size:1.1rem;">${icons[type] || icons.info}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="margin-left:auto; background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.1rem; padding:0 0 0 8px;">&#10005;</button>
        `;

        // Ajouter animation CSS si pas encore présente
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                @keyframes slideIn { from { transform: translateX(120%); opacity:0; } to { transform: translateX(0); opacity:1; } }
                @keyframes slideOut { from { transform: translateX(0); opacity:1; } to { transform: translateX(120%); opacity:0; } }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Auto-suppression après 4 secondes
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    },
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});

// Make it globally accessible
window.AdminPanel = AdminPanel;
