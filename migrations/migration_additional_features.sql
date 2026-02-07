-- Migration: Additional Agreement Features
-- This migration adds support for agreement templates, legal checklist persistence, and user sessions
-- Run this in the Supabase SQL Editor

-- 1. Create user_sessions table (mock implementation for user context)
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT,
    organization TEXT NOT NULL,
    organization_type TEXT, -- 'college' or 'corporate'
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create agreement_templates table
CREATE TABLE IF NOT EXISTS agreement_templates (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    agreement_type TEXT NOT NULL,
    ip_ownership_split TEXT,
    revenue_sharing_model TEXT,
    confidentiality_terms TEXT,
    termination_clauses TEXT,
    compliance_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create agreement_checklist_items table
CREATE TABLE IF NOT EXISTS agreement_checklist_items (
    id BIGSERIAL PRIMARY KEY,
    agreement_id BIGINT REFERENCES agreements(id) ON DELETE CASCADE,
    item_label TEXT NOT NULL,
    item_key TEXT NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agreement_id, item_key)
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checklist_items_agreement_id ON agreement_checklist_items(agreement_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- 5. Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_checklist_items ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
CREATE POLICY "Public Read Access" ON user_sessions FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON user_sessions FOR UPDATE USING (true);

CREATE POLICY "Public Read Access" ON agreement_templates FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON agreement_templates FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access" ON agreement_checklist_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON agreement_checklist_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON agreement_checklist_items FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON agreement_checklist_items FOR DELETE USING (true);

-- 7. Insert sample user sessions (mock data)
INSERT INTO user_sessions (user_id, name, email, organization, organization_type, role)
VALUES 
    ('user_1', 'Rajesh Kumar', 'rajesh.kumar@nhsrcl.in', 'NHSRCL', 'corporate', 'Project Manager'),
    ('user_2', 'Dr. Priya Sharma', 'priya.sharma@iitb.ac.in', 'IIT Bombay', 'college', 'Research Lead'),
    ('user_3', 'Sarah Johnson', 'sarah.j@techgiant.com', 'TechGiant Corp', 'corporate', 'Partnership Director')
ON CONFLICT (user_id) DO NOTHING;

-- 8. Insert sample agreement templates
INSERT INTO agreement_templates (
    name, 
    description, 
    agreement_type,
    ip_ownership_split,
    revenue_sharing_model,
    confidentiality_terms,
    termination_clauses,
    compliance_requirements
)
VALUES 
(
    'Standard Research Collaboration',
    'Standard template for university-corporate research collaborations',
    'Research Collaboration Agreement',
    'Joint ownership: 50% University, 50% Corporate Partner. University retains rights for academic publication with 30-day prior notice to corporate partner.',
    '60% to Corporate Partner, 40% to University for first 5 years. After 5 years, 50-50 split. Minimum royalty guarantee of ₹5,00,000 annually.',
    'Both parties agree to maintain strict confidentiality of all proprietary information shared during the collaboration. Non-disclosure period: 5 years from project completion.',
    'Either party may terminate with 90 days written notice. In case of breach, immediate termination with 30 days cure period. All IP developed prior to termination remains jointly owned.',
    'Compliance with Indian Patent Act, Copyright Act, and relevant data protection regulations. Annual compliance audit required.'
),
(
    'Technology Transfer Agreement',
    'Template for transferring developed technology to corporate partner',
    'Technology Transfer Agreement',
    'University retains ownership of background IP. Corporate partner receives exclusive license for commercialization. University retains right to use for research and teaching.',
    'Upfront license fee + 5% royalty on net sales. Minimum annual royalty of ₹10,00,000. Milestone payments based on commercialization progress.',
    'University confidential information protected for 7 years. Corporate partner confidential information protected for 5 years. Public disclosure allowed only with mutual consent.',
    'Termination for convenience with 180 days notice. Termination for cause with 60 days cure period. License survives termination for products already commercialized.',
    'Compliance with export control regulations, technology transfer guidelines, and relevant industry standards. Quarterly progress reports required.'
),
(
    'Joint Development Agreement',
    'Template for joint development of new technology or product',
    'Joint Development Agreement',
    'Joint ownership of all developed IP. Each party has right to use independently for their own purposes. Commercialization requires mutual agreement.',
    'Costs shared 50-50. Revenue from joint commercialization split 50-50. Independent commercialization requires licensing from other party at pre-agreed rates.',
    'All project-related information treated as confidential for 10 years. Publication allowed only with joint approval. Patent applications filed jointly.',
    'Termination requires unanimous consent. In case of deadlock, mediation required. Developed IP remains jointly owned post-termination.',
    'Compliance with research ethics guidelines, safety standards, and environmental regulations. Joint steering committee oversight required.'
)
ON CONFLICT DO NOTHING;

-- 9. Initialize checklist items for existing agreements
INSERT INTO agreement_checklist_items (agreement_id, item_label, item_key, is_checked, display_order)
SELECT 
    a.id,
    'College IP policy reviewed',
    'college_ip_reviewed',
    true,
    1
FROM agreements a
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_checklist_items aci 
    WHERE aci.agreement_id = a.id AND aci.item_key = 'college_ip_reviewed'
);

INSERT INTO agreement_checklist_items (agreement_id, item_label, item_key, is_checked, display_order)
SELECT 
    a.id,
    'Corporate compliance verified',
    'corporate_compliance',
    true,
    2
FROM agreements a
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_checklist_items aci 
    WHERE aci.agreement_id = a.id AND aci.item_key = 'corporate_compliance'
);

INSERT INTO agreement_checklist_items (agreement_id, item_label, item_key, is_checked, display_order)
SELECT 
    a.id,
    'Ethics committee approval',
    'ethics_approval',
    false,
    3
FROM agreements a
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_checklist_items aci 
    WHERE aci.agreement_id = a.id AND aci.item_key = 'ethics_approval'
);

INSERT INTO agreement_checklist_items (agreement_id, item_label, item_key, is_checked, display_order)
SELECT 
    a.id,
    'Data protection compliance',
    'data_protection',
    false,
    4
FROM agreements a
WHERE NOT EXISTS (
    SELECT 1 FROM agreement_checklist_items aci 
    WHERE aci.agreement_id = a.id AND aci.item_key = 'data_protection'
);

-- Migration complete
-- Verify with: SELECT * FROM user_sessions;
-- Verify with: SELECT * FROM agreement_templates;
-- Verify with: SELECT * FROM agreement_checklist_items;
