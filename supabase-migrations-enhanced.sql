-- ============================================
-- ENHANCED SCHEMA FOR PORTFOLIO
-- Adds: display_order, deleted_at, version_history, settings table
-- ============================================

-- 1. Add new columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- 2. Add new columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- 3. Create settings table for global configurations
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default settings
INSERT INTO settings (key, value, description) VALUES
    ('profile_photo_url', 'https://thumbor.comeup.com/E-aONi_hJRsOeZSE-S4vN8KZjYY=/400x400/filters:quality(90):no_upscale()/user/c9f09ab7-dc31-4007-8629-7c74ae6faab3.jpg', 'URL de la photo de profil'),
    ('profile_name', 'Ouzéfi', 'Nom du profil'),
    ('email', 'ouzefib@gmail.com', 'Email de contact'),
    ('whatsapp', '+22901516333351', 'Numéro WhatsApp'),
    ('comeup_url', 'https://comeup.com/@ouzefi', 'URL ComeUp'),
    ('upwork_url', 'https://www.upwork.com/freelancers/~YOUR_UPWORK_ID', 'URL Upwork')
ON CONFLICT (key) DO NOTHING;

-- 5. Create deleted_items table (trash/corbeille)
CREATE TABLE IF NOT EXISTS deleted_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_type VARCHAR(50) NOT NULL, -- 'service' or 'project'
    item_id UUID NOT NULL,
    item_data JSONB NOT NULL, -- Complete snapshot of the deleted item
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    can_restore BOOLEAN DEFAULT TRUE
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_services_deleted ON services(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_deleted ON projects(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deleted_items_type ON deleted_items(item_type);
CREATE INDEX IF NOT EXISTS idx_deleted_items_date ON deleted_items(deleted_at);

-- 7. Update display_order for existing items (set sequential order)
WITH ordered_services AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_order
    FROM services
    WHERE deleted_at IS NULL
)
UPDATE services s
SET display_order = os.new_order
FROM ordered_services os
WHERE s.id = os.id;

WITH ordered_projects AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_order
    FROM projects
    WHERE deleted_at IS NULL
)
UPDATE projects p
SET display_order = op.new_order
FROM ordered_projects op
WHERE p.id = op.id;

-- 8. Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Create function to save version before update
CREATE OR REPLACE FUNCTION save_version_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Save current state to version_history
    NEW.version_history = COALESCE(OLD.version_history, '[]'::jsonb) || 
        jsonb_build_object(
            'timestamp', NOW(),
            'data', row_to_json(OLD)::jsonb,
            'action', 'update'
        );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Create triggers for version history
DROP TRIGGER IF EXISTS save_service_version ON services;
CREATE TRIGGER save_service_version
    BEFORE UPDATE ON services
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION save_version_history();

DROP TRIGGER IF EXISTS save_project_version ON projects;
CREATE TRIGGER save_project_version
    BEFORE UPDATE ON projects
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION save_version_history();

-- 12. Grant permissions (if using RLS)
-- ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Settings are viewable by everyone" ON settings FOR SELECT USING (true);
-- CREATE POLICY "Settings are editable by authenticated users" ON settings FOR UPDATE USING (auth.role() = 'authenticated');

COMMENT ON TABLE settings IS 'Global application settings and configurations';
COMMENT ON TABLE deleted_items IS 'Soft delete trash bin for services and projects';
COMMENT ON COLUMN services.display_order IS 'Order for drag and drop sorting';
COMMENT ON COLUMN services.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN services.version_history IS 'JSON array of previous versions';
COMMENT ON COLUMN projects.display_order IS 'Order for drag and drop sorting';
COMMENT ON COLUMN projects.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN projects.version_history IS 'JSON array of previous versions';
