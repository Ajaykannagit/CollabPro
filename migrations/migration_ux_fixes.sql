-- Migration for UX/UI Fixes and Enhanced Interactions

-- 1. Add approval status columns to agreements table
-- These track the "Grant Approval" step before the final signature
ALTER TABLE agreements
ADD COLUMN IF NOT EXISTS college_approval_status BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS corporate_approval_status BOOLEAN DEFAULT FALSE;

-- 2. Create table for Licensing Marketplace Inquiries
CREATE TABLE IF NOT EXISTS licensing_inquiries (
    id BIGSERIAL PRIMARY KEY,
    licensing_opportunity_id BIGINT REFERENCES licensing_opportunities(id) ON DELETE CASCADE,
    inquirer_name TEXT,
    inquirer_email TEXT,
    inquirer_organization TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, contacted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS and Policies for new table
ALTER TABLE licensing_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes (adjust for production)
CREATE POLICY "Public Read Access" ON licensing_inquiries FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON licensing_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON licensing_inquiries FOR UPDATE USING (true);
