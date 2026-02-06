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

-- Create policies for public read access (adjust based on your security needs)
CREATE POLICY "Allow public read access" ON colleges FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON research_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON industry_challenges FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ip_disclosures FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON negotiations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agreements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON student_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON licensing_opportunities FOR SELECT USING (true);
