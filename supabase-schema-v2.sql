-- ============================================
-- PORTFOLIO OUZEFI - SCHEMA COMPLET V2
-- ============================================

-- Suppression des anciennes tables si elles existent
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- ============================================
-- TABLE SERVICES
-- ============================================
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon TEXT,
  category TEXT,
  price_starting_from DECIMAL(10,2),
  external_link TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  technologies TEXT[],
  image_url TEXT,
  gallery_images TEXT[],
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE PROJECTS
-- ============================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  category TEXT,
  technologies TEXT[],
  image_url TEXT,
  gallery_images TEXT[],
  external_link TEXT,
  demo_url TEXT,
  github_url TEXT,
  
  -- Nouveaux champs pour les détails
  client_name TEXT,
  project_date DATE,
  duration TEXT,
  team_size INTEGER,
  my_role TEXT,
  
  -- Fichiers embed (PDFs, vidéos, etc.)
  embedded_files JSONB DEFAULT '[]'::jsonb,
  
  -- Stats du projet
  stats JSONB DEFAULT '{}'::jsonb,
  
  -- Testimonial
  testimonial JSONB,
  
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Public can read projects" ON projects
  FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Authenticated can manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Services indexes
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_featured ON services(is_featured);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_order ON services(order_index);

-- Projects indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_order ON projects(order_index);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FONCTION POUR GÉNÉRER LES SLUGS
-- ============================================

CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[àáâãäå]', 'a', 'gi'),
                '[èéêë]', 'e', 'gi'
            ),
            '[^a-z0-9]+', '-', 'gi'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DONNÉES D'EXEMPLE - SERVICES
-- ============================================

INSERT INTO services (title, slug, short_description, full_description, icon, category, price_starting_from, external_link, features, technologies, is_featured, order_index) VALUES

-- Service 1: MultiGPT1
('MultiGPT1 - Chatbot IA Multimodal', 'multigpt1-chatbot-ia', 
'Chatbot IA révolutionnaire accessible sans forfait internet classique', 
'MultiGPT1 est un chatbot IA multimodal qui agrège plusieurs modèles d''intelligence artificielle pour offrir le meilleur de chaque modèle : raisonnement, rapidité, et coût optimisé. Spécialement conçu pour l''Afrique avec une consommation de données minimale.',
'brain',
'IA & SaaS',
2500.00,
'https://m.me/MultiGPT1',
'[
  "Agrégation de plusieurs modèles IA",
  "Accessible via Messenger",
  "Consommation data ultra-faible",
  "Multimodal (texte, images)",
  "Réponses contextuelles avancées",
  "Support 24/7"
]'::jsonb,
ARRAY['AI', 'Messenger API', 'NLP', 'Computer Vision', 'Node.js'],
true,
1),

-- Service 2: Automatisation Prospection
('Automatisation Prospection 360°', 'automatisation-prospection-360',
'Système complet d''automatisation de prospection end-to-end',
'De la génération de leads à la conversion, notre système automatise 100% de votre processus de prospection : qualification automatique, messages personnalisés, relances intelligentes multicanales, A/B testing, et suivi jusqu''à la conversion.',
'target',
'Automatisation',
5000.00,
NULL,
'[
  "Génération automatique de leads",
  "Qualification intelligente",
  "Messages personnalisés dynamiques",
  "Relances multicanales",
  "Scénarios conditionnels",
  "A/B testing automatique",
  "Dashboard temps réel"
]'::jsonb,
ARRAY['Automation', 'CRM', 'AI', 'Multi-channel', 'Analytics'],
true,
2),

-- Service 3: Social Media Automation
('Social Media Automation Suite', 'social-media-automation-suite',
'Automatisation complète de tous vos canaux sociaux',
'Gérez tous vos réseaux sociaux depuis un seul système : Facebook, Instagram, X, LinkedIn, YouTube, WhatsApp. Publication automatique, gestion des commentaires, inbox automatisé avec chatbot intelligent.',
'share-2',
'Marketing Digital',
3500.00,
NULL,
'[
  "Multi-plateformes (FB, IG, X, LinkedIn, YouTube)",
  "Publication automatique posts/stories",
  "Chatbot inbox intelligent",
  "Gestion automatique des commentaires",
  "Génération de contenu IA",
  "Planification avancée",
  "Analytics complet"
]'::jsonb,
ARRAY['Social Media API', 'Automation', 'AI Content', 'Chatbot'],
true,
3),

-- Service 4: Scraping & Data
('Scraping & Data Extraction', 'scraping-data-extraction',
'Extraction et traitement de données web avancé',
'Systèmes de scraping sur mesure pour e-commerce, réseaux sociaux, ou tout site web. Extraction structurée, nettoyage automatique, export vers dashboards ou CRM.',
'database',
'Data & Scraping',
2000.00,
NULL,
'[
  "Scraping e-commerce (produits, prix, stock)",
  "Extraction réseaux sociaux",
  "Scraping de sites complexes",
  "Nettoyage automatique des données",
  "Export vers CRM/Dashboard",
  "Surveillance temps réel",
  "Gestion des contraintes techniques"
]'::jsonb,
ARRAY['Python', 'Scrapy', 'Beautiful Soup', 'Selenium', 'Data Processing'],
false,
4),

-- Service 5: SaaS Sur Mesure
('Développement SaaS Sur Mesure', 'developpement-saas-sur-mesure',
'Création de SaaS personnalisés pour votre business',
'Conception et développement de solutions SaaS complètes : architecture scalable, monétisation, dashboards, API, et maintenance long terme.',
'rocket',
'SaaS Development',
8000.00,
NULL,
'[
  "Architecture cloud native",
  "Interface utilisateur moderne",
  "API REST complète",
  "Système de paiement intégré",
  "Multi-tenancy",
  "Dashboards analytics",
  "Documentation complète",
  "Support et maintenance"
]'::jsonb,
ARRAY['Full-Stack', 'Cloud', 'API', 'Payment Integration', 'Scalable'],
false,
5),

-- Service 6: Dashboard & UX
('Dashboards & Interfaces Client', 'dashboards-interfaces-client',
'Interfaces utilisateur intuitives et dashboards temps réel',
'Création de dashboards sur mesure qui abstraient toute la complexité technique. Le client pilote son système sans être un expert.',
'layout-dashboard',
'UX & Dashboards',
2500.00,
NULL,
'[
  "Design UI/UX moderne",
  "Dashboards temps réel",
  "Visualisation de données",
  "Abstraction de la complexité",
  "Responsive design",
  "Rapports automatiques",
  "Interfaces intuitives"
]'::jsonb,
ARRAY['UI/UX', 'Data Viz', 'React', 'Dashboard Design'],
false,
6);

-- ============================================
-- DONNÉES D'EXEMPLE - PROJECTS
-- ============================================

INSERT INTO projects (title, slug, short_description, full_description, category, technologies, image_url, external_link, demo_url, client_name, project_date, duration, my_role, embedded_files, stats, is_featured, order_index) VALUES

-- Project 1: MultiGPT1
('MultiGPT1', 'multigpt1',
'Chatbot IA multimodal accessible sans forfait internet',
'MultiGPT1 est un projet innovant qui agrège plusieurs modèles d''IA pour créer un chatbot intelligent accessible via Messenger. Optimisé pour l''Afrique avec une consommation de données ultra-faible. Le système utilise le meilleur de chaque modèle : GPT pour le raisonnement, Claude pour l''analyse, et d''autres pour l''optimisation des coûts.',
'IA & Chatbot',
ARRAY['AI', 'Messenger API', 'Node.js', 'NLP', 'Multi-Model'],
'https://via.placeholder.com/800x500/0ea5e9/ffffff?text=MultiGPT1',
'https://m.me/MultiGPT1',
'https://m.me/MultiGPT1',
'Projet Personnel',
'2024-01-01',
'6 mois',
'Lead Developer & Product Owner',
'[
  {"type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ", "title": "Démo MultiGPT1"},
  {"type": "pdf", "url": "https://example.com/doc.pdf", "title": "Documentation technique"}
]'::jsonb,
'{"users": "1000+", "messages": "50000+", "uptime": "99.9%"}'::jsonb,
true,
1),

-- Project 2: E-commerce Automation
('Automatisation E-commerce Complète', 'automatisation-ecommerce-complete',
'Système d''automatisation complète pour boutique en ligne',
'Automatisation end-to-end d''une boutique e-commerce : gestion des commandes, relances paniers abandonnés, service client automatisé, scraping de prix concurrents, et synchronisation multi-plateformes.',
'E-commerce & Automation',
ARRAY['Automation', 'E-commerce', 'Scraping', 'CRM', 'Multi-platform'],
'https://via.placeholder.com/800x500/10b981/ffffff?text=E-commerce+Automation',
NULL,
NULL,
'Client Confidentiel',
'2023-11-01',
'4 mois',
'Automation Architect',
'[]'::jsonb,
'{"revenue_increase": "+45%", "abandoned_carts_recovered": "30%", "support_automation": "80%"}'::jsonb,
true,
2),

-- Project 3: Social Media Management Platform
('Plateforme de Gestion Social Media', 'plateforme-gestion-social-media',
'Gestion automatisée de 5 canaux sociaux simultanément',
'Plateforme complète pour gérer Facebook, Instagram, X, LinkedIn et YouTube depuis une seule interface. Publication automatique, génération de contenu IA, analytics temps réel.',
'Marketing Digital',
ARRAY['Social Media API', 'AI Content', 'Automation', 'Analytics', 'Multi-platform'],
'https://via.placeholder.com/800x500/9333ea/ffffff?text=Social+Media+Platform',
NULL,
NULL,
'Agence Marketing',
'2024-03-01',
'3 mois',
'Full-Stack Developer',
'[]'::jsonb,
'{"posts_automated": "500+", "engagement_increase": "+60%", "time_saved": "15h/week"}'::jsonb,
false,
3);

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Services créés:' as info, COUNT(*) as count FROM services;
SELECT 'Projects créés:' as info, COUNT(*) as count FROM projects;

SELECT * FROM services ORDER BY order_index;
SELECT * FROM projects ORDER BY order_index;
