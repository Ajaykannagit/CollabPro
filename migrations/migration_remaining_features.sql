-- Migration: Remaining Features (Analytics Charts, Documents Management, IP Disclosures)
-- This migration adds support for project documents, chart data views, and IP disclosure project linking
-- Run this in the Supabase SQL Editor

-- 1. Create project_documents table
CREATE TABLE IF NOT EXISTS project_documents (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    storage_path TEXT NOT NULL,
    uploaded_by TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    description TEXT
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_uploaded_at ON project_documents(uploaded_at DESC);

-- 3. Enable RLS
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for project_documents
CREATE POLICY "Public Read Access" ON project_documents FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON project_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON project_documents FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON project_documents FOR DELETE USING (true);

-- 5. Create view for monthly collaboration trends
CREATE OR REPLACE VIEW monthly_collaboration_trends AS
SELECT 
    DATE_TRUNC('month', cr.created_at) as month,
    COUNT(DISTINCT cr.id) as total_requests,
    COUNT(DISTINCT CASE WHEN cr.status = 'approved' THEN cr.id END) as approved_requests,
    COUNT(DISTINCT CASE WHEN a.status = 'signed' THEN a.id END) as signed_agreements,
    AVG(CASE WHEN cr.status = 'approved' THEN cr.proposed_budget END) as avg_budget
FROM collaboration_requests cr
LEFT JOIN agreements a ON a.collaboration_request_id = cr.id
WHERE cr.created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', cr.created_at)
ORDER BY month DESC;

-- 6. Create view for expertise area distribution
CREATE OR REPLACE VIEW expertise_area_distribution AS
SELECT 
    rp.research_area as expertise_area,
    COUNT(DISTINCT rp.id) as project_count,
    COUNT(DISTINCT cr.id) as collaboration_count,
    SUM(rp.funding_allocated) as total_funding
FROM research_projects rp
LEFT JOIN collaboration_requests cr ON cr.research_project_id = rp.id
GROUP BY rp.research_area
ORDER BY project_count DESC
LIMIT 10;

-- 7. Add project_id to ip_disclosures if not exists (for linking)
-- Check if column exists first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ip_disclosures' 
        AND column_name = 'research_project_id'
    ) THEN
        ALTER TABLE ip_disclosures 
        ADD COLUMN research_project_id BIGINT REFERENCES research_projects(id) ON DELETE SET NULL;
        
        CREATE INDEX idx_ip_disclosures_project_id ON ip_disclosures(research_project_id);
    END IF;
END $$;

-- 8. Insert sample project documents (for testing)
INSERT INTO project_documents (project_id, file_name, file_size, file_type, storage_path, uploaded_by, description)
SELECT 
    rp.id,
    'Research_Proposal.pdf',
    2457600, -- 2.4 MB
    'application/pdf',
    'projects/' || rp.id || '/Research_Proposal.pdf',
    'Dr. Priya Sharma',
    'Initial research proposal document'
FROM research_projects rp
WHERE rp.id = 1
ON CONFLICT DO NOTHING;

INSERT INTO project_documents (project_id, file_name, file_size, file_type, storage_path, uploaded_by, description)
SELECT 
    rp.id,
    'Budget_Overview.xlsx',
    1153434, -- 1.1 MB
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'projects/' || rp.id || '/Budget_Overview.xlsx',
    'Rajesh Kumar',
    'Detailed budget breakdown'
FROM research_projects rp
WHERE rp.id = 1
ON CONFLICT DO NOTHING;

INSERT INTO project_documents (project_id, file_name, file_size, file_type, storage_path, uploaded_by, description)
SELECT 
    rp.id,
    'Lab_Safety_Protocol.docx',
    870400, -- 850 KB
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'projects/' || rp.id || '/Lab_Safety_Protocol.docx',
    'Dr. Priya Sharma',
    'Laboratory safety guidelines and protocols'
FROM research_projects rp
WHERE rp.id = 1
ON CONFLICT DO NOTHING;

-- 9. Link existing IP disclosures to projects (sample data)
UPDATE ip_disclosures 
SET research_project_id = 1
WHERE title LIKE '%Catalyst%' OR title LIKE '%Photovoltaic%';

-- Migration complete
-- Verify with: SELECT * FROM project_documents;
-- Verify with: SELECT * FROM monthly_collaboration_trends;
-- Verify with: SELECT * FROM expertise_area_distribution;
