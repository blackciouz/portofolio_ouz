/**
 * CLOUDINARY UPLOADER COMPONENT
 * Reusable drag & drop image uploader with preview and progress
 */

class CloudinaryUploader {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            folder: options.folder || 'portfolio',
            multiple: options.multiple !== false,
            maxFiles: options.maxFiles || 10,
            maxSizeMB: options.maxSizeMB || 10,
            onUploadStart: options.onUploadStart || (() => {}),
            onUploadProgress: options.onUploadProgress || (() => {}),
            onUploadComplete: options.onUploadComplete || (() => {}),
            onUploadError: options.onUploadError || (() => {}),
            allowedTypes: options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        };
        
        this.files = [];
        this.uploadedUrls = [];
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Uploader container not found');
            return;
        }

        this.render();
        this.attachEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="cloudinary-uploader">
                <div class="upload-dropzone" id="upload-dropzone">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <h3>Glissez des images ici</h3>
                    <p>ou cliquez pour sélectionner</p>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">
                        Max ${this.options.maxSizeMB}MB par fichier • ${this.options.multiple ? `Jusqu'à ${this.options.maxFiles} fichiers` : '1 fichier'}
                    </p>
                    <input 
                        type="file" 
                        id="file-input" 
                        accept="${this.options.allowedTypes.join(',')}"
                        ${this.options.multiple ? 'multiple' : ''}
                        style="display: none;">
                </div>
                <div class="upload-previews" id="upload-previews"></div>
                <div class="upload-progress" id="upload-progress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <p id="progress-text">Uploading...</p>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('cloudinary-uploader-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cloudinary-uploader-styles';
        styles.textContent = `
            .cloudinary-uploader {
                width: 100%;
            }

            .upload-dropzone {
                border: 2px dashed var(--border-primary);
                border-radius: var(--radius-2xl);
                padding: 3rem 2rem;
                text-align: center;
                cursor: pointer;
                transition: all var(--transition-base);
                background: rgba(15, 23, 42, 0.3);
            }

            .upload-dropzone:hover {
                border-color: var(--brand-400);
                background: rgba(14, 165, 233, 0.05);
            }

            .upload-dropzone.dragover {
                border-color: var(--brand-500);
                background: rgba(14, 165, 233, 0.1);
                transform: scale(1.02);
            }

            .upload-dropzone svg {
                color: var(--brand-400);
                margin: 0 auto 1rem;
            }

            .upload-dropzone h3 {
                margin: 0 0 0.5rem;
                color: var(--text-primary);
            }

            .upload-dropzone p {
                margin: 0;
                color: var(--text-secondary);
            }

            .upload-previews {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .preview-item {
                position: relative;
                border-radius: var(--radius-lg);
                overflow: hidden;
                aspect-ratio: 1;
                border: 1px solid var(--border-primary);
                background: rgba(15, 23, 42, 0.5);
            }

            .preview-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .preview-remove {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: rgba(239, 68, 68, 0.9);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .preview-remove:hover {
                background: rgba(220, 38, 38, 1);
                transform: scale(1.1);
            }

            .upload-progress {
                margin-top: 1.5rem;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-full);
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--brand-500), var(--brand-400));
                transition: width 0.3s ease;
                width: 0%;
            }

            #progress-text {
                text-align: center;
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(styles);
    }

    attachEvents() {
        const dropzone = this.container.querySelector('#upload-dropzone');
        const fileInput = this.container.querySelector('#file-input');

        // Click to select
        dropzone.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    handleFiles(fileList) {
        const files = Array.from(fileList);
        
        // Validate file count
        if (!this.options.multiple && files.length > 1) {
            alert('Un seul fichier autorisé');
            return;
        }

        if (this.files.length + files.length > this.options.maxFiles) {
            alert(`Maximum ${this.options.maxFiles} fichiers autorisés`);
            return;
        }

        // Validate each file
        for (const file of files) {
            if (!this.options.allowedTypes.includes(file.type)) {
                alert(`Type de fichier non autorisé: ${file.type}`);
                continue;
            }

            if (file.size > this.options.maxSizeMB * 1024 * 1024) {
                alert(`Fichier trop volumineux: ${file.name} (max ${this.options.maxSizeMB}MB)`);
                continue;
            }

            this.files.push(file);
            this.renderPreview(file);
        }
    }

    renderPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previews = this.container.querySelector('#upload-previews');
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.dataset.filename = file.name;
            preview.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button class="preview-remove" onclick="window.uploaderInstance.removeFile('${file.name}')">×</button>
            `;
            previews.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }

    removeFile(filename) {
        this.files = this.files.filter(f => f.name !== filename);
        const preview = this.container.querySelector(`[data-filename="${filename}"]`);
        if (preview) preview.remove();
    }

    async uploadFiles() {
        if (this.files.length === 0) {
            this.options.onUploadError('Aucun fichier à uploader');
            return [];
        }

        this.options.onUploadStart();
        const progressEl = this.container.querySelector('#upload-progress');
        const progressFill = this.container.querySelector('#progress-fill');
        const progressText = this.container.querySelector('#progress-text');
        
        progressEl.style.display = 'block';
        this.uploadedUrls = [];

        try {
            // Get signature from server
            const sigResponse = await fetch('/.netlify/functions/cloudinary-signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: this.options.folder })
            });

            if (!sigResponse.ok) {
                throw new Error('Failed to get upload signature');
            }

            const { signature, timestamp, cloudName, apiKey, uploadUrl, folder } = await sigResponse.json();

            // Upload each file
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                const formData = new FormData();
                
                formData.append('file', file);
                formData.append('signature', signature);
                formData.append('timestamp', timestamp);
                formData.append('api_key', apiKey);
                formData.append('folder', folder);

                const uploadResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error(`Upload failed for ${file.name}`);
                }

                const result = await uploadResponse.json();
                this.uploadedUrls.push(result.secure_url);

                // Update progress
                const progress = ((i + 1) / this.files.length) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Upload ${i + 1}/${this.files.length}...`;
                
                this.options.onUploadProgress(progress, i + 1, this.files.length);
            }

            progressEl.style.display = 'none';
            this.options.onUploadComplete(this.uploadedUrls);
            
            // Clear files and previews
            this.files = [];
            this.container.querySelector('#upload-previews').innerHTML = '';
            
            return this.uploadedUrls;

        } catch (error) {
            console.error('Upload error:', error);
            progressEl.style.display = 'none';
            this.options.onUploadError(error.message);
            return [];
        }
    }

    getUploadedUrls() {
        return this.uploadedUrls;
    }

    reset() {
        this.files = [];
        this.uploadedUrls = [];
        this.container.querySelector('#upload-previews').innerHTML = '';
        this.container.querySelector('#upload-progress').style.display = 'none';
    }
}

// Make it globally accessible
window.CloudinaryUploader = CloudinaryUploader;
