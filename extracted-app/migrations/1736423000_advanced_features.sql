-- Migration for advanced features: negotiations, agreements, analytics, and enhanced workflows

-- Negotiation workspace for collaboration discussions
CREATE TABLE negotiation_threads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collaboration_request_id BIGINT NOT NULL REFERENCES collaboration_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE negotiation_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  negotiation_thread_id BIGINT NOT NULL REFERENCES negotiation_threads(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_organization TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  content TEXT NOT NULL,
  attachments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_scope_versions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  negotiation_thread_id BIGINT NOT NULL REFERENCES negotiation_threads(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  scope_description TEXT NOT NULL,
  deliverables TEXT,
  timeline TEXT,
  budget NUMERIC(12, 2),
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Collaboration agreements
CREATE TABLE collaboration_agreements (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collaboration_request_id BIGINT NOT NULL REFERENCES collaboration_requests(id) ON DELETE CASCADE,
  agreement_type TEXT NOT NULL,
  ip_ownership_split TEXT NOT NULL,
  revenue_sharing_model TEXT,
  confidentiality_terms TEXT,
  termination_clauses TEXT,
  compliance_requirements TEXT,
  status TEXT DEFAULT 'draft',
  College_signed_at TIMESTAMPTZ,
  College_signatory TEXT,
  corporate_signed_at TIMESTAMPTZ,
  corporate_signatory TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved candidate lists
CREATE TABLE saved_candidates (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  corporate_partner_id BIGINT NOT NULL REFERENCES corporate_partners(id) ON DELETE CASCADE,
  student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  notes TEXT,
  interest_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(corporate_partner_id, student_profile_id)
);

-- Interview scheduling
CREATE TABLE interview_schedules (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recruitment_request_id BIGINT NOT NULL REFERENCES recruitment_requests(id) ON DELETE CASCADE,
  interview_type TEXT,
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT,
  location TEXT,
  meeting_link TEXT,
  interviewer_names TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patent/licensing workflow tracking
CREATE TABLE ip_workflow_stages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_disclosure_id BIGINT NOT NULL REFERENCES ip_disclosures(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  stage_status TEXT DEFAULT 'pending',
  assigned_to TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Licensing marketplace
CREATE TABLE licensing_opportunities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_disclosure_id BIGINT NOT NULL REFERENCES ip_disclosures(id) ON DELETE CASCADE,
  anonymized_title TEXT NOT NULL,
  anonymized_description TEXT NOT NULL,
  licensing_type TEXT,
  asking_price NUMERIC(12, 2),
  industry_sectors TEXT,
  visibility TEXT DEFAULT 'public',
  inquiries_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics and reporting
CREATE TABLE platform_analytics (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC(12, 2),
  metric_category TEXT,
  time_period TEXT,
  metadata TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Milestone reminders
CREATE TABLE milestone_reminders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_milestone_id BIGINT NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  reminder_date DATE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_negotiation_messages_thread ON negotiation_messages(negotiation_thread_id);
CREATE INDEX idx_collaboration_agreements_status ON collaboration_agreements(status);
CREATE INDEX idx_saved_candidates_corporate ON saved_candidates(corporate_partner_id);
CREATE INDEX idx_interview_schedules_date ON interview_schedules(scheduled_date);
CREATE INDEX idx_ip_workflow_stages_status ON ip_workflow_stages(stage_status);
CREATE INDEX idx_licensing_opportunities_visibility ON licensing_opportunities(visibility);
CREATE INDEX idx_milestone_reminders_date ON milestone_reminders(reminder_date);

-- Sample negotiation data
INSERT INTO negotiation_threads (collaboration_request_id) VALUES (1);

INSERT INTO negotiation_messages (negotiation_thread_id, sender_name, sender_organization, content) VALUES
(1, 'Rajesh Kumar', 'NHSRCL', 'We are excited about this collaboration opportunity. Our key priority is ensuring the predictive maintenance system can scale to our entire 508km network. What is your timeline for achieving this?'),
(1, 'Dr. Sarah Chen', 'MIT', 'Thank you for your interest. Based on our current progress, we recommend a phased approach: 6-month pilot (50km), 12-month expansion (200km), and full deployment by month 24. This allows for iterative improvements based on real-world data.'),
(1, 'Rajesh Kumar', 'NHSRCL', 'That sounds reasonable. Can we discuss the IP ownership structure? We would like joint ownership with exclusive licensing rights for rail applications in India.'),
(1, 'Dr. Sarah Chen', 'MIT', 'We can accommodate joint ownership with MIT retaining 60% and NHSRCL 40%, given our foundational research investment. Exclusive licensing for Indian rail is acceptable. For international licensing, we propose a 70-30 revenue split in your favor.');

INSERT INTO project_scope_versions (negotiation_thread_id, version_number, scope_description, deliverables, timeline, budget, created_by) VALUES
(1, 1, 'AI-powered predictive maintenance system for Mumbai-Ahmedabad corridor with sensor deployment, ML model development, and pilot testing', 'Phase 1: Sensor infrastructure (50km)\nPhase 2: ML model training and validation\nPhase 3: 6-month pilot deployment\nPhase 4: Performance evaluation report', '24 months with quarterly milestones', 6250000, 'Dr. Sarah Chen'),
(1, 2, 'Enhanced scope including real-time monitoring dashboard, mobile app for maintenance crews, and integration with existing NHSRCL systems', 'All Phase 1 deliverables plus:\n- Web-based monitoring dashboard\n- Mobile application (iOS/Android)\n- API integration with SCADA systems\n- Training program for 50 maintenance personnel', '24 months with quarterly milestones', 7000000, 'Rajesh Kumar');

-- Sample collaboration agreement
INSERT INTO collaboration_agreements (
  collaboration_request_id,
  agreement_type,
  ip_ownership_split,
  revenue_sharing_model,
  confidentiality_terms,
  termination_clauses,
  compliance_requirements,
  status
) VALUES (
  1,
  'Joint Development Agreement',
  'MIT 60%, NHSRCL 40% with exclusive licensing rights for Indian rail sector',
  'International licensing revenue: 70% NHSRCL, 30% MIT. Patent costs shared proportionally.',
  'All technical data and research findings classified as confidential for 5 years post-completion. Non-disclosure agreements required for all team members.',
  'Either party may terminate with 90 days notice. In case of termination, each party retains ownership proportional to contribution. NHSRCL retains perpetual license for deployed systems.',
  'ISO 27001 compliance for data security, Indian Railway Safety Standards adherence, quarterly audit reports, ethics committee approval for all research activities',
  'under_review'
);

-- Sample saved candidates
INSERT INTO saved_candidates (corporate_partner_id, student_profile_id, notes, interest_level) VALUES
(1, 1, 'Excellent ML expertise, perfect fit for our AI team. Published work on predictive maintenance highly relevant.', 'high'),
(1, 2, 'Strong IoT background, could help with sensor network deployment.', 'medium'),
(2, 3, 'PhD candidate with solar expertise, potential for renewable energy R&D team.', 'high');

-- Sample interview schedules
INSERT INTO interview_schedules (recruitment_request_id, interview_type, scheduled_date, duration_minutes, location, meeting_link, interviewer_names, status) VALUES
(2, 'Technical Round', '2026-01-15 14:00:00+00', 60, 'Virtual', 'https://meet.google.com/abc-defg-hij', 'Dr. Kumar Patel, Sarah Williams', 'scheduled');

-- Sample IP workflow stages
INSERT INTO ip_workflow_stages (ip_disclosure_id, stage_name, stage_status, assigned_to, started_at) VALUES
(1, 'Initial Review', 'completed', 'Legal Team', '2025-10-01 09:00:00+00'),
(1, 'Prior Art Search', 'completed', 'Patent Attorney', '2025-10-15 09:00:00+00'),
(1, 'Patent Application Drafting', 'in_progress', 'Patent Attorney', '2025-11-01 09:00:00+00'),
(1, 'Filing', 'pending', 'Legal Team', NULL);

-- Sample licensing opportunity
INSERT INTO licensing_opportunities (
  ip_disclosure_id,
  anonymized_title,
  anonymized_description,
  licensing_type,
  asking_price,
  industry_sectors,
  visibility
) VALUES (
  1,
  'Advanced Vibration Analysis System for Infrastructure Monitoring',
  'Proprietary ML algorithm achieving 94% accuracy in predicting maintenance needs for critical infrastructure 7-14 days in advance. Patent pending. Reduces downtime by 40% and maintenance costs by 30%. Technology-ready for immediate deployment.',
  'Exclusive or Non-exclusive License',
  25000000,
  'Rail Transportation, Bridge Monitoring, Industrial Infrastructure, Smart Cities',
  'public'
);

-- Sample analytics data
INSERT INTO platform_analytics (metric_name, metric_value, metric_category, time_period, recorded_at) VALUES
('total_collaborations', 156, 'partnerships', 'all_time', NOW()),
('active_projects', 23, 'projects', 'current', NOW()),
('avg_project_value', 8500000, 'financials', 'current_year', NOW()),
('success_rate', 89.5, 'performance', 'current_year', NOW()),
('total_ip_disclosures', 45, 'innovation', 'all_time', NOW()),
('student_placements', 78, 'recruitment', 'current_year', NOW());

-- Sample milestone reminders
INSERT INTO milestone_reminders (project_milestone_id, reminder_type, reminder_date, sent) VALUES
(2, '7_day_reminder', '2024-08-08', FALSE),
(2, '1_day_reminder', '2024-08-14', FALSE),
(3, '7_day_reminder', '2025-01-08', FALSE);
