-- CollabPro Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Colleges Table
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

-- Research Projects Table
CREATE TABLE IF NOT EXISTS research_projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    funding_needed NUMERIC(12, 2),
    trl_level INTEGER,
    status TEXT DEFAULT 'active',
    team_lead TEXT,
    team_size INTEGER,
    publications_count INTEGER DEFAULT 0,
    college_id BIGINT REFERENCES colleges(id),
    college_name TEXT,
    college_location TEXT,
    expertise_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industry Challenges Table
CREATE TABLE IF NOT EXISTS industry_challenges (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    budget_min NUMERIC(12, 2),
    budget_max NUMERIC(12, 2),
    timeline_months INTEGER,
    status TEXT DEFAULT 'open',
    company_name TEXT,
    industry TEXT,
    company_location TEXT,
    required_expertise TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Requests Table
CREATE TABLE IF NOT EXISTS collaboration_requests (
    id BIGSERIAL PRIMARY KEY,
    status TEXT DEFAULT 'pending',
    research_project_id BIGINT REFERENCES research_projects(id),
    industry_challenge_id BIGINT REFERENCES industry_challenges(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IP Disclosures Table
CREATE TABLE IF NOT EXISTS ip_disclosures (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    active_project_id BIGINT REFERENCES research_projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Negotiations Table
CREATE TABLE IF NOT EXISTS negotiations (
    id BIGSERIAL PRIMARY KEY,
    collaboration_request_id BIGINT REFERENCES collaboration_requests(id),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agreements Table
CREATE TABLE IF NOT EXISTS agreements (
    id BIGSERIAL PRIMARY KEY,
    collaboration_request_id BIGINT REFERENCES collaboration_requests(id),
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

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT,
    type TEXT NOT NULL,
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    college TEXT,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Licensing Opportunities Table
CREATE TABLE IF NOT EXISTS licensing_opportunities (
    id BIGSERIAL PRIMARY KEY,
    ip_disclosure_id BIGINT REFERENCES ip_disclosures(id),
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Data
INSERT INTO colleges (name, location, website, research_strengths, available_resources, success_rate, past_partnerships_count, active_projects_count)
VALUES
    ('Indian Institute of Technology, Bombay', 'Mumbai, Maharashtra', 'www.iitb.ac.in', 'AI, Robotics, Nanotechnology', 'Supercomputing cluster, Nanofabrication lab', 95, 120, 15),
    ('Indian Institute of Science', 'Bengaluru, Karnataka', 'www.iisc.ac.in', 'Biotechnology, Aerospace, Materials Science', 'Wind tunnel, Bio-imaging center', 98, 150, 25),
    ('Delhi Technological University', 'New Delhi, Delhi', 'dtu.ac.in', 'Renewable Energy, Automotive Engineering', 'Solar research center, EV lab', 88, 80, 10)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_research_projects_status ON research_projects(status);
CREATE INDEX IF NOT EXISTS idx_industry_challenges_status ON industry_challenges(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Enable Row Level Security (RLS)
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_disclosures ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE licensing_opportunities ENABLE ROW LEVEL SECURITY;

-- EXTENDED SCHEMA (Added by Agent to support Action Files) --

-- Corporate Partners
CREATE TABLE IF NOT EXISTS corporate_partners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    location TEXT,
    website TEXT,
    company_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expertise Areas
CREATE TABLE IF NOT EXISTS expertise_areas (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Join table: Research Projects <-> Expertise
CREATE TABLE IF NOT EXISTS research_project_expertise (
    research_project_id BIGINT REFERENCES research_projects(id),
    expertise_area_id BIGINT REFERENCES expertise_areas(id),
    PRIMARY KEY (research_project_id, expertise_area_id)
);

-- Join table: Industry Challenges <-> Expertise
CREATE TABLE IF NOT EXISTS industry_challenge_expertise (
    industry_challenge_id BIGINT REFERENCES industry_challenges(id),
    expertise_area_id BIGINT REFERENCES expertise_areas(id),
    PRIMARY KEY (industry_challenge_id, expertise_area_id)
);

-- Matchmaking Scores
CREATE TABLE IF NOT EXISTS matchmaking_scores (
    id BIGSERIAL PRIMARY KEY,
    compatibility_score NUMERIC(5, 2),
    reasoning TEXT,
    research_project_id BIGINT REFERENCES research_projects(id),
    industry_challenge_id BIGINT REFERENCES industry_challenges(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Candidates
CREATE TABLE IF NOT EXISTS saved_candidates (
    id BIGSERIAL PRIMARY KEY,
    notes TEXT,
    interest_level TEXT,
    student_profile_id BIGINT REFERENCES student_profiles(id),
    corporate_partner_id BIGINT REFERENCES corporate_partners(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Skills
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT REFERENCES student_profiles(id),
    skill_name TEXT NOT NULL
);

-- Negotiation Messages
CREATE TABLE IF NOT EXISTS negotiation_messages (
    id BIGSERIAL PRIMARY KEY,
    negotiation_thread_id BIGINT REFERENCES negotiations(id),
    sender_name TEXT,
    sender_organization TEXT,
    message_type TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Scope Versions
CREATE TABLE IF NOT EXISTS project_scope_versions (
    id BIGSERIAL PRIMARY KEY,
    negotiation_thread_id BIGINT REFERENCES negotiations(id),
    version_number INTEGER,
    scope_description TEXT,
    deliverables TEXT,
    timeline TEXT,
    budget NUMERIC(12, 2),
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IP Contributors
CREATE TABLE IF NOT EXISTS ip_contributors (
    id BIGSERIAL PRIMARY KEY,
    ip_disclosure_id BIGINT REFERENCES ip_disclosures(id),
    contributor_name TEXT,
    organization TEXT,
    ownership_percentage NUMERIC(5, 2),
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing tables matches code expectations
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS college_id BIGINT REFERENCES colleges(id);

ALTER TABLE collaboration_requests ADD COLUMN IF NOT EXISTS corporate_partner_id BIGINT REFERENCES corporate_partners(id);
ALTER TABLE collaboration_requests ADD COLUMN IF NOT EXISTS project_brief TEXT;
ALTER TABLE collaboration_requests ADD COLUMN IF NOT EXISTS budget_proposed NUMERIC(12, 2);
ALTER TABLE collaboration_requests ADD COLUMN IF NOT EXISTS timeline_proposed TEXT;

ALTER TABLE industry_challenges ADD COLUMN IF NOT EXISTS corporate_partner_id BIGINT REFERENCES corporate_partners(id);

-- IP Disclosures Updates
ALTER TABLE ip_disclosures ADD COLUMN IF NOT EXISTS invention_category TEXT;
ALTER TABLE ip_disclosures ADD COLUMN IF NOT EXISTS potential_applications TEXT;
ALTER TABLE ip_disclosures ADD COLUMN IF NOT EXISTS prior_art_references TEXT;
ALTER TABLE ip_disclosures ADD COLUMN IF NOT EXISTS commercial_potential TEXT;
ALTER TABLE ip_disclosures ADD COLUMN IF NOT EXISTS filing_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE ip_disclosures ADD COLUMN IF NOT EXISTS patent_number TEXT;

-- Licensing Opportunities Updates
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS anonymized_title TEXT;
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS anonymized_description TEXT;
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS licensing_type TEXT;
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS asking_price NUMERIC(12, 2);
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS industry_sectors TEXT;
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS inquiries_count INTEGER DEFAULT 0;
ALTER TABLE licensing_opportunities ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private';

-- Student Profiles Updates
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS degree_level TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS field_of_study TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS gpa NUMERIC(3, 2);
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS availability_status TEXT;

-- Student Project Involvement Table
CREATE TABLE IF NOT EXISTS student_project_involvement (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT REFERENCES student_profiles(id),
    research_project_id BIGINT REFERENCES research_projects(id),
    role TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
