-- Script SQL pour configurer Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Créer la table projects
CREATE TABLE IF NOT EXISTS projects (
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

-- Activer Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy pour lecture publique (tout le monde peut voir les projets)
CREATE POLICY "Public can read projects" ON projects
  FOR SELECT
  USING (true);

-- Policy pour insertion (authentifié seulement)
CREATE POLICY "Authenticated can insert projects" ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy pour mise à jour (authentifié seulement)
CREATE POLICY "Authenticated can update projects" ON projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy pour suppression (authentifié seulement)
CREATE POLICY "Authenticated can delete projects" ON projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer quelques projets d'exemple (optionnel)
INSERT INTO projects (title, description, category, technologies, image_url, featured) VALUES
('MultiGPT1', 'Chatbot IA multimodal accessible sans forfait internet en Afrique. Agrégation de plusieurs modèles d''IA.', 'IA & SaaS', ARRAY['AI', 'Chatbot', 'Messenger API', 'Multi-model'], 'https://via.placeholder.com/600x400', true),
('Automatisation Prospection 360°', 'Système complet d''automatisation de prospection : génération de leads, qualification, relances intelligentes multicanales.', 'Automatisation', ARRAY['Lead Generation', 'CRM', 'Multi-channel', 'AI'], 'https://via.placeholder.com/600x400', true),
('Social Media Automation Suite', 'Automatisation complète de Facebook, Instagram, X, LinkedIn, YouTube : posts, stories, commentaires, inbox.', 'Marketing Digital', ARRAY['Social Media', 'Automation', 'Content Generation', 'API Integration'], 'https://via.placeholder.com/600x400', true);

-- Vérification
SELECT * FROM projects;
