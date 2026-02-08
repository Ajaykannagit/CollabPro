-- Migration: Agreement Versions, Sections, and Comments
-- This migration adds support for agreement versioning and commenting system
-- Run this in the Supabase SQL Editor

-- 1. Create agreement_versions table
CREATE TABLE IF NOT EXISTS agreement_versions (
    id BIGSERIAL PRIMARY KEY,
    agreement_id BIGINT REFERENCES agreements(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    change_summary TEXT,
    UNIQUE(agreement_id, version_number)
);

-- 2. Create agreement_sections table
CREATE TABLE IF NOT EXISTS agreement_sections (
    id BIGSERIAL PRIMARY KEY,
    agreement_version_id BIGINT REFERENCES agreement_versions(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create agreement_comments table
CREATE TABLE IF NOT EXISTS agreement_comments (
    id BIGSERIAL PRIMARY KEY,
    agreement_id BIGINT REFERENCES agreements(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    author TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agreement_versions_agreement_id ON agreement_versions(agreement_id);
CREATE INDEX IF NOT EXISTS idx_agreement_sections_version_id ON agreement_sections(agreement_version_id);
CREATE INDEX IF NOT EXISTS idx_agreement_comments_agreement_id ON agreement_comments(agreement_id);
CREATE INDEX IF NOT EXISTS idx_agreement_comments_section_id ON agreement_comments(section_id);

-- 5. Enable RLS
ALTER TABLE agreement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_comments ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for public read access
CREATE POLICY "Public Read Access" ON agreement_versions FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON agreement_versions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access" ON agreement_sections FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON agreement_sections FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access" ON agreement_comments FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON agreement_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON agreement_comments FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON agreement_comments FOR DELETE USING (true);

-- 7. Migrate existing agreements to version 1.0
-- This creates initial version 1.0 for all existing agreements
INSERT INTO agreement_versions (agreement_id, version_number, created_by, change_summary)
SELECT 
    id,
    '1.0',
    'System Migration',
    'Initial version created from existing agreement'
FROM agreements
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_versions av WHERE av.agreement_id = agreements.id
);

-- 8. Create initial sections for version 1.0
-- This populates sections from existing agreement data
INSERT INTO agreement_sections (agreement_version_id, section_id, title, content, display_order)
SELECT 
    av.id,
    '1',
    'Scope of Work',
    COALESCE(cr.project_brief, 'To be defined'),
    1
FROM agreement_versions av
JOIN agreements a ON av.agreement_id = a.id
JOIN collaboration_requests cr ON a.collaboration_request_id = cr.id
WHERE av.version_number = '1.0'
AND NOT EXISTS (
    SELECT 1 FROM agreement_sections asec WHERE asec.agreement_version_id = av.id AND asec.section_id = '1'
);

INSERT INTO agreement_sections (agreement_version_id, section_id, title, content, display_order)
SELECT 
    av.id,
    '2',
    'Confidentiality Terms',
    COALESCE(a.confidentiality_terms, 'Standard confidentiality terms apply'),
    2
FROM agreement_versions av
JOIN agreements a ON av.agreement_id = a.id
WHERE av.version_number = '1.0'
AND NOT EXISTS (
    SELECT 1 FROM agreement_sections asec WHERE asec.agreement_version_id = av.id AND asec.section_id = '2'
);

INSERT INTO agreement_sections (agreement_version_id, section_id, title, content, display_order)
SELECT 
    av.id,
    '3',
    'IP Ownership',
    COALESCE(a.ip_ownership_split, 'To be negotiated'),
    3
FROM agreement_versions av
JOIN agreements a ON av.agreement_id = a.id
WHERE av.version_number = '1.0'
AND NOT EXISTS (
    SELECT 1 FROM agreement_sections asec WHERE asec.agreement_version_id = av.id AND asec.section_id = '3'
);

INSERT INTO agreement_sections (agreement_version_id, section_id, title, content, display_order)
SELECT 
    av.id,
    '4',
    'Revenue Sharing',
    COALESCE(a.revenue_sharing_model, 'To be negotiated'),
    4
FROM agreement_versions av
JOIN agreements a ON av.agreement_id = a.id
WHERE av.version_number = '1.0'
AND NOT EXISTS (
    SELECT 1 FROM agreement_sections asec WHERE asec.agreement_version_id = av.id AND asec.section_id = '4'
);

INSERT INTO agreement_sections (agreement_version_id, section_id, title, content, display_order)
SELECT 
    av.id,
    '5',
    'Termination Clauses',
    COALESCE(a.termination_clauses, 'Standard termination clauses apply'),
    5
FROM agreement_versions av
JOIN agreements a ON av.agreement_id = a.id
WHERE av.version_number = '1.0'
AND NOT EXISTS (
    SELECT 1 FROM agreement_sections asec WHERE asec.agreement_version_id = av.id AND asec.section_id = '5'
);

-- 9. Add some sample comments for demonstration
INSERT INTO agreement_comments (agreement_id, section_id, author, comment_text)
SELECT 
    a.id,
    '1',
    'College Legal Team',
    'Please clarify the scope regarding sub-licensing rights and derivative works.'
FROM agreements a
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_comments ac WHERE ac.agreement_id = a.id AND ac.section_id = '1'
)
LIMIT 1;

INSERT INTO agreement_comments (agreement_id, section_id, author, comment_text)
SELECT 
    a.id,
    '2',
    'Corporate Legal',
    'This confidentiality clause matches our standard terms. Approved.'
FROM agreements a
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_comments ac WHERE ac.agreement_id = a.id AND ac.section_id = '2'
)
LIMIT 1;

-- Migration complete
-- Verify with: SELECT * FROM agreement_versions;
-- Verify with: SELECT * FROM agreement_sections;
-- Verify with: SELECT * FROM agreement_comments;
