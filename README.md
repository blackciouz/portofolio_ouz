# Portfolio Ouzéfi 🚀

Portfolio professionnel avec CMS intégré pour gérer les réalisations dynamiquement.

## Stack Technique
- **Frontend**: HTML5, CSS3 (Tailwind), Vanilla JavaScript
- **Backend**: Netlify Functions (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Design**: Glassmorphism, Dark Mode SaaS, Animations

## Installation

1. Cloner le repo
2. Installer les dépendances:
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement:
   - Copier `.env.example` vers `.env`
   - Remplir avec vos clés Supabase

4. Démarrer en local:
   ```bash
   npm run dev
   ```

## Configuration Supabase

Créer une table `projects` avec la structure suivante:

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  technologies TEXT[],
  image_url TEXT,
  demo_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy pour lecture publique
CREATE POLICY "Public can read projects" ON projects
  FOR SELECT USING (true);

-- Policy pour modification (avec auth)
CREATE POLICY "Authenticated can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
```

## Déploiement sur Netlify

1. Connecter votre repo GitHub à Netlify
2. Configurer les variables d'environnement dans Netlify
3. Déployer automatiquement à chaque push

## Panel Admin

Accéder au panel d'administration: `/admin`
Mot de passe défini dans les variables d'environnement.

## Structure du Projet

```
.
├── public/              # Frontend static
│   ├── index.html      # Page principale
│   ├── admin.html      # Panel admin
│   ├── css/
│   │   └── styles.css  # Styles personnalisés
│   ├── js/
│   │   ├── main.js     # Logic frontend
│   │   └── admin.js    # Logic admin panel
│   └── assets/         # Images, icons, etc.
├── netlify/
│   └── functions/      # API Serverless
│       ├── get-projects.js
│       ├── create-project.js
│       ├── update-project.js
│       └── delete-project.js
├── netlify.toml        # Config Netlify
├── package.json
└── README.md
```

## Fonctionnalités

✅ Portfolio statique avec design premium
✅ Section réalisations dynamique (CRUD)
✅ Panel admin pour gérer le contenu
✅ Animations et effets glassmorphism
✅ Responsive design
✅ SEO optimized
✅ Performance optimisée

## Contact

Ouzéfi - Architecte de systèmes d'automatisation & IA
