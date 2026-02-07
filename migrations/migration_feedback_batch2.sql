-- Migration for Feedback Batch 2 (Scopes & Interviews)

-- 1. Project Scopes Table for Negotiation
CREATE TABLE IF NOT EXISTS project_scopes (
    id BIGSERIAL PRIMARY KEY,
    collaboration_request_id BIGINT REFERENCES collaboration_requests(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    scope_description TEXT NOT NULL,
    deliverables TEXT NOT NULL,
    timeline TEXT NOT NULL,
    budget NUMERIC NOT NULL,
    status TEXT DEFAULT 'proposed', -- proposed, approved, rejected
    created_by TEXT NOT NULL, -- Name/ID of user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Interview Requests Table for Talent Showcase
CREATE TABLE IF NOT EXISTS interview_requests (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT REFERENCES student_profiles(id) ON DELETE CASCADE,
    requester_name TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    requester_organization TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, scheduled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS and Policies
ALTER TABLE project_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_requests ENABLE ROW LEVEL SECURITY;

-- Public access policies (demo mode)
CREATE POLICY "Public Read Scopes" ON project_scopes FOR SELECT USING (true);
CREATE POLICY "Public Insert Scopes" ON project_scopes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Scopes" ON project_scopes FOR UPDATE USING (true);

CREATE POLICY "Public Read Interviews" ON interview_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert Interviews" ON interview_requests FOR INSERT WITH CHECK (true);
