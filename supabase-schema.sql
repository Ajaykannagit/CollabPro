-- CollabPro Comprehensive Database Schema for Supabase
-- This script sets up all tables, relationships, and sample data for the platform.
-- Run this in the Supabase SQL Editor.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Core Entities: Universities & Corporate Partners
CREATE TABLE IF NOT EXISTS colleges (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    website TEXT,
    research_strengths TEXT,
    available_resources TEXT,
    success_rate INTEGER DEFAULT 0,
    past_partnerships_count INTEGER DEFAULT 0,
    active_projects_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS corporate_partners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    location TEXT,
    website TEXT,
    company_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Supporting Content: Expertise Areas
CREATE TABLE IF NOT EXISTS expertise_areas (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Academic Content: Research Projects & Student Profiles
CREATE TABLE IF NOT EXISTS research_projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    funding_needed NUMERIC(12, 2),
    funding_allocated NUMERIC(12, 2) DEFAULT 0,
    budget_utilized NUMERIC(12, 2) DEFAULT 0,
    trl_level INTEGER,
    status TEXT DEFAULT 'active',
    team_lead TEXT,
    team_size INTEGER,
    publications_count INTEGER DEFAULT 0,
    college_id BIGINT REFERENCES colleges(id) ON DELETE CASCADE,
    college_name TEXT, -- Denormalized for quick UI access
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
    id BIGSERIAL PRIMARY KEY,
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed
    deliverables TEXT
);

CREATE TABLE IF NOT EXISTS team_members (
    id BIGSERIAL PRIMARY KEY,
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT,
    organization TEXT
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    degree_level TEXT,
    field_of_study TEXT,
    graduation_year INTEGER,
    gpa NUMERIC(3, 2),
    bio TEXT,
    availability_status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_skills (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL
);

-- 4. Industry Content: Challenges
CREATE TABLE IF NOT EXISTS industry_challenges (
    id BIGSERIAL PRIMARY KEY,
    corporate_partner_id BIGINT REFERENCES corporate_partners(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    budget_min NUMERIC(12, 2),
    budget_max NUMERIC(12, 2),
    timeline_months INTEGER,
    status TEXT DEFAULT 'open',
    company_name TEXT, -- Denormalized
    industry TEXT,
    company_location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Link Tables (Many-to-Many)
CREATE TABLE IF NOT EXISTS research_project_expertise (
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    expertise_area_id BIGINT REFERENCES expertise_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (research_project_id, expertise_area_id)
);

CREATE TABLE IF NOT EXISTS industry_challenge_expertise (
    industry_challenge_id BIGINT REFERENCES industry_challenges(id) ON DELETE CASCADE,
    expertise_area_id BIGINT REFERENCES expertise_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (industry_challenge_id, expertise_area_id)
);

CREATE TABLE IF NOT EXISTS student_project_involvement (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT REFERENCES student_profiles(id) ON DELETE CASCADE,
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    role TEXT,
    start_date DATE,
    end_date DATE
);

-- 6. Workflows: Collaboration & Legal
CREATE TABLE IF NOT EXISTS collaboration_requests (
    id BIGSERIAL PRIMARY KEY,
    corporate_partner_id BIGINT REFERENCES corporate_partners(id) ON DELETE CASCADE,
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    industry_challenge_id BIGINT REFERENCES industry_challenges(id) ON DELETE SET NULL,
    project_brief TEXT,
    budget_proposed NUMERIC(12, 2),
    timeline_proposed TEXT,
    status TEXT DEFAULT 'pending', -- pending, accepted, declined, negotiating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS negotiations (
    id BIGSERIAL PRIMARY KEY,
    collaboration_request_id BIGINT REFERENCES collaboration_requests(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS negotiation_messages (
    id BIGSERIAL PRIMARY KEY,
    negotiation_thread_id BIGINT REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_name TEXT,
    sender_organization TEXT,
    message_type TEXT DEFAULT 'text', -- text, proposal
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agreements (
    id BIGSERIAL PRIMARY KEY,
    collaboration_request_id BIGINT REFERENCES collaboration_requests(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft',
    agreement_type TEXT,
    ip_ownership_split TEXT,
    revenue_sharing_model TEXT,
    confidentiality_terms TEXT,
    termination_clauses TEXT,
    compliance_requirements TEXT,
    college_signed_at TIMESTAMP WITH TIME ZONE,
    college_signatory TEXT,
    corporate_signed_at TIMESTAMP WITH TIME ZONE,
    corporate_signatory TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Intellectual Property & Commercialization
CREATE TABLE IF NOT EXISTS ip_disclosures (
    id BIGSERIAL PRIMARY KEY,
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    invention_category TEXT,
    potential_applications TEXT,
    commercial_potential TEXT,
    prior_art_references TEXT,
    status TEXT DEFAULT 'draft', -- draft, under_review, patent_pending, patented, licensed
    filing_date DATE,
    patent_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ip_contributors (
    id BIGSERIAL PRIMARY KEY,
    ip_disclosure_id BIGINT REFERENCES ip_disclosures(id) ON DELETE CASCADE,
    contributor_name TEXT,
    organization TEXT,
    ownership_percentage NUMERIC(5, 2),
    role TEXT
);

CREATE TABLE IF NOT EXISTS licensing_opportunities (
    id BIGSERIAL PRIMARY KEY,
    ip_disclosure_id BIGINT REFERENCES ip_disclosures(id) ON DELETE CASCADE,
    anonymized_title TEXT,
    anonymized_description TEXT,
    licensing_type TEXT,
    asking_price NUMERIC(12, 2),
    industry_sectors TEXT,
    inquiries_count INTEGER DEFAULT 0,
    visibility TEXT DEFAULT 'private', -- private, marketplace
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Analytics & User Data
CREATE TABLE IF NOT EXISTS matchmaking_scores (
    id BIGSERIAL PRIMARY KEY,
    research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
    industry_challenge_id BIGINT REFERENCES industry_challenges(id) ON DELETE CASCADE,
    compatibility_score NUMERIC(5, 2),
    reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_candidates (
    id BIGSERIAL PRIMARY KEY,
    corporate_partner_id BIGINT REFERENCES corporate_partners(id) ON DELETE CASCADE,
    student_profile_id BIGINT REFERENCES student_profiles(id) ON DELETE CASCADE,
    interest_level TEXT, -- low, medium, high
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT, -- In a real app this would link to Auth
    type TEXT NOT NULL,
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Indexes & Performance Optimization
CREATE INDEX IF NOT EXISTS idx_research_projects_status ON research_projects(status);
CREATE INDEX IF NOT EXISTS idx_industry_challenges_status ON industry_challenges(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_status ON collaboration_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- 10. Sample Seed Data
-- ==========================================

-- Colleges
INSERT INTO colleges (name, location, website, research_strengths, success_rate, past_partnerships_count, active_projects_count)
VALUES 
('IIT Bombay', 'Mumbai, India', 'https://www.iitb.ac.in', 'AI, Nanotechnology, Sustainable Energy', 92, 45, 12),
('IISc Bangalore', 'Bengaluru, India', 'https://www.iisc.ac.in', 'Biotechnology, Aerospace, Materials Science', 95, 60, 18),
('IIT Delhi', 'Delhi, India', 'https://www.iitd.ac.in', 'Robotics, Structural Engineering, Computing', 88, 30, 10);

-- Corporate Partners
INSERT INTO corporate_partners (name, industry, location, website, company_size)
VALUES 
('TechGiant Corp', 'Technology', 'San Francisco, USA', 'https://techgiant.com', '10,000+'),
('BioPharm Global', 'Pharmaceuticals', 'Basel, Switzerland', 'https://biopharm.com', '5,000-10,000'),
('EcoEnergy Solutions', 'Renewable Energy', 'Berlin, Germany', 'https://ecoenergy.de', '500-1,000');

-- Expertise Areas
INSERT INTO expertise_areas (name, description)
VALUES 
('Natural Language Processing', 'Advanced analysis and generation of human language'),
('Hydrogen Fuel Cells', 'Clean energy generation from hydrogen'),
('Drug Delivery Systems', 'Micro and nano-scale delivery of medicinal compounds');

-- Research Projects
INSERT INTO research_projects (title, description, funding_needed, trl_level, college_id, college_name, team_lead, team_size)
VALUES 
('Project Aura: Next-Gen LLMs', 'Development of efficient large language models for edge devices.', 200000, 4, 1, 'IIT Bombay', 'Dr. Arnab Ray', 5),
('Solar-H: Photovoltaic Integration', 'Combining solar cells with direct hydrogen production.', 450000, 3, 2, 'IISc Bangalore', 'Prof. Sunita Krishnan', 8);

-- Milestones for Project Aura
INSERT INTO milestones (research_project_id, title, description, due_date, status)
VALUES 
(1, 'Model Architecture Design', 'Finalize the transformer architecture', '2024-03-01', 'completed'),
(1, 'Training Run 1', 'First training phase on the cluster', '2024-06-15', 'in_progress');

-- Team Members for Project Aura
INSERT INTO team_members (research_project_id, name, role, email, organization)
VALUES 
(1, 'Amit Shah', 'Senior Researcher', 'amit@iitb.ac.in', 'IIT Bombay'),
(1, 'John Doe', 'Partner Contact', 'jdoe@techgiant.com', 'TechGiant Corp');

-- Industry Challenges
INSERT INTO industry_challenges (corporate_partner_id, title, description, budget_min, budget_max, timeline_months, company_name, industry)
VALUES 
(1, 'Real-time Translation for Local Dialects', 'We need a system that supports 15+ Indian dialects with 95% accuracy.', 50000, 150000, 12, 'TechGiant Corp', 'Technology');

-- Student Profiles
INSERT INTO student_profiles (college_id, name, email, degree_level, field_of_study, graduation_year, gpa, bio)
VALUES 
(1, 'Rahul Verma', 'rahul@campus.edu', 'Masters', 'Computer Science', 2024, 3.9, 'Passionate about deep learning and NLP.'),
(2, 'Aditi Rao', 'aditi@campus.edu', 'PhD', 'Chemical Engineering', 2025, 4.0, 'Focusing on green hydrogen production.');

-- Student Skills
INSERT INTO student_skills (student_profile_id, skill_name) VALUES (1, 'PyTorch'), (1, 'Python'), (2, 'Catalysis'), (2, 'Matlab');

-- IP Disclosures
INSERT INTO ip_disclosures (research_project_id, title, description, invention_category, status)
VALUES 
(1, 'Efficient Attention Mechanism', 'A new way to calculate attention scores with O(n) complexity.', 'Algorithm', 'patent_pending');

-- Notifications
INSERT INTO notifications (type, title, message)
VALUES 
('collaboration', 'New Request', 'TechGiant Corp is interested in Project Aura.'),
('system', 'System Update', 'Database maintenance completed successfully.');

-- Enable RLS (Optional for local but good for Supabase)
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
-- For this demo/tutorial, we allow all access (In production, you'd restrict this)
CREATE POLICY "Public Read Access" ON colleges FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON research_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON industry_challenges FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON corporate_partners FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON student_profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON agreements FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON ip_disclosures FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON notifications FOR SELECT USING (true);
