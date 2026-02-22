# 🚀 Portfolio Ouzéfi — Architecte de Systèmes d'Automatisation & IA

> Portfolio professionnel full-stack déployé sur Netlify, avec backend Supabase, upload Cloudinary, admin complet et bouton Cal.com intégré.

🌐 **Live** : https://portofolio-ouz.netlify.app  
📦 **Repo** : https://github.com/blackciouz/portofolio_ouz

---

## 📋 Table des matières

- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Configuration](#configuration)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données Supabase](#base-de-données-supabase)
- [Cloudinary](#cloudinary)
- [Admin Panel](#admin-panel)
- [Déploiement](#déploiement)
- [Contacts & Liens](#contacts--liens)

---

## 🛠 Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | HTML5, CSS3 (Vanilla), JavaScript ES6+ |
| Backend | Netlify Functions (Node.js serverless) |
| Base de données | Supabase (PostgreSQL) |
| Upload images | Cloudinary |
| Prise de RDV | Cal.com embed |
| Icons | Lucide Icons |
| Fonts | Google Fonts (Space Grotesk + Inter) |
| Drag & Drop | SortableJS |
| Déploiement | Netlify (CI/CD automatique depuis GitHub) |

---

## 📁 Structure du projet

```
portofolio_ouz/
│
├── public/                         # Frontend statique
│   ├── index.html                  # Page d'accueil
│   ├── about.html                  # Page à propos
│   ├── services.html               # Liste des services
│   ├── service-detail.html         # Détail d'un service
│   ├── projects.html               # Liste des projets
│   ├── project-detail.html         # Détail d'un projet
│   ├── contact.html                # Page contact + Cal.com embed
│   ├── admin.html                  # Admin panel complet
│   │
│   ├── css/
│   │   ├── main.css                # Styles globaux (design system dark)
│   │   └── cal-custom.css          # Styles personnalisés Cal.com
│   │
│   ├── js/
│   │   ├── nav.js                  # Navigation active + mobile menu
│   │   ├── home.js                 # Chargement dynamique page accueil
│   │   ├── services.js             # Affichage liste services
│   │   ├── service-detail.js       # Détail service dynamique
│   │   ├── projects.js             # Affichage liste projets + filtres
│   │   ├── project-detail.js       # Détail projet dynamique
│   │   ├── admin-enhanced.js       # Admin panel complet (CRUD, drag&drop, corbeille)
│   │   ├── cloudinary-uploader.js  # Composant upload Cloudinary réutilisable
│   │   ├── lightbox.js             # Lightbox images avec MutationObserver
│   │   └── cal-embed.js            # Bouton flottant Cal.com
│   │
│   └── components/
│       └── contact-cta.html        # Boutons flottants contact (Email, WhatsApp, ComeUp, Upwork)
│
├── netlify/
│   └── functions/                  # Backend serverless
│       ├── services-get.js         # GET /services (avec tri order_index)
│       ├── services-create.js      # POST /services (créer)
│       ├── services-update.js      # POST /services-update (modifier)
│       ├── services-delete.js      # POST /services-delete (soft delete → corbeille)
│       ├── services-reorder.js     # POST /services-reorder (drag & drop ordre)
│       ├── projects-get.js         # GET /projects
│       ├── projects-create.js      # POST /projects
│       ├── projects-update.js      # POST /projects-update
│       ├── projects-delete.js      # POST /projects-delete (soft delete)
│       ├── projects-reorder.js     # POST /projects-reorder
│       ├── trash-get.js            # GET /trash (corbeille)
│       ├── trash-restore.js        # POST /trash-restore (restaurer)
│       ├── trash-delete-permanent.js # POST /trash-delete-permanent
│       ├── cloudinary-signature.js # Génération signature upload sécurisée
│       └── cloudinary-upload.js    # Upload vers Cloudinary
│
├── supabase-schema-v2.sql          # Schéma complet de la base de données
├── supabase-setup.sql              # Setup initial Supabase
├── supabase-migrations-enhanced.sql # Migrations (colonnes order_index, deleted_at, etc.)
├── netlify.toml                    # Config Netlify (redirections, fonctions)
├── package.json                    # Dépendances Node.js
└── README.md                       # Ce fichier
```

---

## ✨ Fonctionnalités

### 🌐 Site public

- **Page d'accueil** : Hero animé, aperçu services & projets chargés dynamiquement depuis Supabase
- **Services** : Grille responsive, filtres par catégorie, cards avec galerie d'images
- **Projets** : Grille responsive, filtres par catégorie, technologies, résultats
- **Détail service/projet** : Page dynamique avec galerie lightbox, embed vidéo/demo
- **Contact** : Cal.com embed inline (prise de RDV 15min), cards cliquables Email/WhatsApp/ComeUp/Upwork
- **Boutons flottants** : Email, WhatsApp, ComeUp, Upwork sur toutes les pages
- **Bouton Cal.com flottant** : Prise de RDV rapide sur toutes les pages
- **Navigation active** : Lien actif surligné automatiquement selon la page courante
- **Responsive** : Mobile, tablette, desktop — 100% adaptatif
- **Lightbox** : Ouverture des images en popup avec zoom, compatible images dynamiques (MutationObserver)

### 🔧 Admin Panel (`/admin.html`)

- **Dashboard** : Statistiques (nb services, projets, images, éléments supprimés)
- **Services CRUD** : Créer, modifier, supprimer avec formulaire complet
- **Projets CRUD** : Créer, modifier, supprimer avec formulaire complet
- **Upload images** : Drag & drop vers Cloudinary directement depuis l'admin
- **Drag & Drop** : Réorganisation visuelle de l'ordre d'affichage (SortableJS)
- **Corbeille** : Soft delete → restauration possible ou suppression définitive
- **Historique** : Visualisation des versions précédentes de chaque item
- **Paramètres** : Gestion photo de profil (upload Cloudinary)
- **Toasts** : Notifications non bloquantes (succès, erreur, info)
- **Responsive** : Sidebar hamburger sur mobile

---

## ⚙️ Configuration

### 1. Cloner le repo

```bash
git clone https://github.com/blackciouz/portofolio_ouz.git
cd portofolio_ouz
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier `.env.example` en `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

### 4. Lancer en local (avec Netlify CLI)

```bash
npm install -g netlify-cli
netlify dev
```

Le site sera accessible sur `http://localhost:8888`

---

## 🔑 Variables d'environnement

À configurer dans **Netlify > Site settings > Environment variables** ET dans le fichier `.env` local :

| Variable | Description | Où trouver |
|----------|-------------|------------|
| `SUPABASE_URL` | URL de votre projet Supabase | Supabase > Settings > API |
| `SUPABASE_ANON_KEY` | Clé publique Supabase | Supabase > Settings > API |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary | console.cloudinary.com |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | console.cloudinary.com |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | console.cloudinary.com |

> ⚠️ **Ne jamais committer ces valeurs dans le code source !**

---

## 🗄️ Base de données Supabase

### Tables principales

#### `services`
```sql
id            UUID PRIMARY KEY
title         TEXT NOT NULL
description   TEXT
category      TEXT
price         TEXT
icon          TEXT
features      TEXT[]
gallery_images TEXT[]
is_featured   BOOLEAN DEFAULT false
order_index   INTEGER DEFAULT 0       -- ordre d'affichage (drag & drop)
deleted_at    TIMESTAMPTZ             -- soft delete (corbeille)
version_history JSONB                 -- historique des versions
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

#### `projects`
```sql
id            UUID PRIMARY KEY
title         TEXT NOT NULL
description   TEXT
category      TEXT
client        TEXT
technologies  TEXT[]
results       TEXT[]
gallery_images TEXT[]
external_link TEXT
order_index   INTEGER DEFAULT 0
deleted_at    TIMESTAMPTZ
version_history JSONB
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

#### `deleted_items` (corbeille)
```sql
id          UUID PRIMARY KEY
item_type   TEXT                -- 'service' ou 'project'
item_data   JSONB               -- données complètes de l'item supprimé
deleted_at  TIMESTAMPTZ DEFAULT NOW()
```

#### `settings`
```sql
id    UUID PRIMARY KEY
key   TEXT UNIQUE
value TEXT
```

### Setup

Exécuter dans Supabase SQL Editor dans cet ordre :
1. `supabase-setup.sql` — tables de base
2. `supabase-schema-v2.sql` — schéma complet
3. `supabase-migrations-enhanced.sql` — colonnes avancées (order_index, deleted_at, etc.)

---

## ☁️ Cloudinary

Cloudinary est utilisé pour stocker toutes les images du portfolio.

### Configuration

| Paramètre | Valeur |
|-----------|--------|
| Cloud Name | `dqx4yzasn` |
| API Key | Dans les variables d'environnement Netlify |
| API Secret | Dans les variables d'environnement Netlify |

### Structure des dossiers Cloudinary

```
portfolio/
├── services/    # Images galeries des services
├── projects/    # Images galeries des projets
└── profile/     # Photo de profil
```

### Fonctionnement de l'upload

1. Le frontend demande une **signature sécurisée** à `/.netlify/functions/cloudinary-signature`
2. La signature est générée côté serveur avec l'API Secret (jamais exposé côté client)
3. Le fichier est uploadé directement vers Cloudinary avec la signature
4. L'URL de l'image retournée est sauvegardée dans Supabase

---

## 🎛️ Admin Panel

Accessible à l'URL : `/admin.html`

> ⚠️ **Sécurité** : L'admin n'a pas d'authentification forte pour l'instant. Protégez l'URL via Netlify Identity ou un Basic Auth si nécessaire.

### Utilisation

1. **Dashboard** → Vue d'ensemble des statistiques
2. **Services** → Gérer les services (ajouter, modifier, réorganiser, supprimer)
3. **Projets** → Gérer les projets (même fonctionnalités)
4. **Corbeille** → Restaurer ou supprimer définitivement les éléments
5. **Paramètres** → Changer la photo de profil

### Drag & Drop

- Cliquer sur les **⁞⁞** (grip) à gauche d'une ligne
- Glisser-déposer pour réorganiser
- L'ordre est sauvegardé automatiquement en base

---

## 🚀 Déploiement

### Automatique (recommandé)

Chaque `git push` sur la branche `main` déclenche un déploiement automatique Netlify.

```bash
git add -A
git commit -m "feat: ma nouvelle feature"
git push origin main
```

### Manuel

```bash
netlify deploy --prod
```

### Configuration Netlify (`netlify.toml`)

```toml
[build]
  publish = "public"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📞 Contacts & Liens

| Canal | Lien |
|-------|------|
| 📧 Email | ouzefib@gmail.com |
| 💬 WhatsApp | +229 51 63 33 51 |
| ⬆️ ComeUp | https://comeup.com/fr/@automaciouz |
| 💼 Upwork | https://upwork.com/freelancers/~01118d44db25713a68 |
| 📅 Réserver un RDV | https://cal.com/ouzefi-automaciouz-yugozj/15min |
| 🐙 GitHub | https://github.com/blackciouz |

---

## 📝 Historique des développements majeurs

### Phase 1 — Site public & Design
- Design system dark (CSS variables, glassmorphism)
- Pages : Home, Services, Projets, À propos, Contact
- Navigation responsive avec hamburger menu
- Chargement dynamique des données depuis Supabase

### Phase 2 — Backend Netlify Functions
- CRUD complet services et projets
- Fonctions serverless pour toutes les opérations
- Gestion des erreurs et CORS

### Phase 3 — Admin Panel
- Interface d'administration complète
- Drag & drop (SortableJS) pour réorganiser
- Upload images vers Cloudinary
- Soft delete + corbeille + restauration
- Historique des versions

### Phase 4 — Corrections & Optimisations
- **Cal.com** : réinitialisation propre (1 seule init), plus de double scroll
- **Navigation active** : fix définitif (guard null, 1 seul appel, styles forcés)
- **Lightbox** : MutationObserver pour images chargées dynamiquement
- **Contact CTA** : SVGs WhatsApp et Upwork complets, boutons uniformes
- **Notifications** : Toasts animés non bloquants (remplace alert())
- **Responsive** : grid-cols-2 passe en 1 colonne sur tablette
- **Sécurité** : Lien admin retiré du footer public, secrets Cloudinary retirés du code
- **CRUD admin** : saveService() et saveProject() implémentés, modales complètes
- **Corbeille** : emptyTrash() connecté à l'API réelle
- **Reorder** : Colonne order_index unifiée entre reorder et get

---

## 📄 Licence

Projet privé — Tous droits réservés © 2025 Ouzéfi
