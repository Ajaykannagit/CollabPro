-- Migration for project execution and IP management features

-- Active projects table (created from accepted collaboration requests)
CREATE TABLE active_projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collaboration_request_id BIGINT REFERENCES collaboration_requests(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  funding_allocated NUMERIC(12, 2),
  start_date DATE NOT NULL,
  end_date DATE,
  budget_utilized NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project milestones
CREATE TABLE project_milestones (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  active_project_id BIGINT NOT NULL REFERENCES active_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completion_date DATE,
  status TEXT DEFAULT 'pending',
  deliverables TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project team members
CREATE TABLE project_team_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  active_project_id BIGINT NOT NULL REFERENCES active_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project activity feed
CREATE TABLE project_activities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  active_project_id BIGINT NOT NULL REFERENCES active_projects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_name TEXT,
  metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IP disclosures
CREATE TABLE ip_disclosures (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  active_project_id BIGINT NOT NULL REFERENCES active_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  invention_category TEXT,
  potential_applications TEXT,
  prior_art_references TEXT,
  commercial_potential TEXT,
  status TEXT DEFAULT 'disclosed',
  filing_date DATE,
  patent_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IP contributors
CREATE TABLE ip_contributors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_disclosure_id BIGINT NOT NULL REFERENCES ip_disclosures(id) ON DELETE CASCADE,
  contributor_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  ownership_percentage NUMERIC(5, 2) NOT NULL,
  role TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student talent profiles
CREATE TABLE student_profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  College_id BIGINT NOT NULL REFERENCES Colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  degree_level TEXT,
  field_of_study TEXT,
  graduation_year INT,
  gpa NUMERIC(3, 2),
  bio TEXT,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student skills
CREATE TABLE student_skills (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_profile_id, skill_name)
);

-- Student project involvement
CREATE TABLE student_project_involvement (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
  role TEXT,
  contribution_description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recruitment requests
CREATE TABLE recruitment_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  corporate_partner_id BIGINT NOT NULL REFERENCES corporate_partners(id) ON DELETE CASCADE,
  student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  position_title TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  interview_date DATE,
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Revenue tracking for IP commercialization
CREATE TABLE ip_revenue_transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_disclosure_id BIGINT NOT NULL REFERENCES ip_disclosures(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  transaction_date DATE NOT NULL,
  licensee_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_active_projects_status ON active_projects(status);
CREATE INDEX idx_project_milestones_due_date ON project_milestones(due_date);
CREATE INDEX idx_ip_disclosures_status ON ip_disclosures(status);
CREATE INDEX idx_student_profiles_College ON student_profiles(College_id);
CREATE INDEX idx_recruitment_requests_status ON recruitment_requests(status);

-- Insert sample data for active projects
INSERT INTO active_projects (collaboration_request_id, project_name, description, funding_allocated, start_date, budget_utilized, status) VALUES
(1, 'AI Predictive Maintenance System for Mumbai-Ahmedabad Rail', 'Development of machine learning models for predictive maintenance of high-speed rail infrastructure with pilot deployment', 850000, '2024-01-15', 285000, 'in_progress');

-- Insert sample milestones
INSERT INTO project_milestones (active_project_id, title, description, due_date, status, deliverables) VALUES
(1, 'Phase 1: Data Collection Setup', 'Install sensors and establish data pipeline for 50km track section', '2024-04-15', 'completed', 'Sensor deployment report, Data architecture documentation'),
(1, 'Phase 2: Model Development', 'Develop and train ML models for failure prediction', '2024-08-15', 'in_progress', 'Trained model, Performance metrics report'),
(1, 'Phase 3: Pilot Deployment', 'Deploy system for 6-month pilot testing', '2025-01-15', 'pending', 'Pilot deployment plan, System integration guide'),
(1, 'Phase 4: Evaluation & Scale-up', 'Evaluate pilot results and plan full-scale deployment', '2025-06-15', 'pending', 'Pilot evaluation report, Scale-up recommendations');

-- Insert sample team members
INSERT INTO project_team_members (active_project_id, name, role, email, organization) VALUES
(1, 'Dr. Sarah Chen', 'Principal Investigator', 'sarah.chen@mit.edu', 'MIT'),
(1, 'Rajesh Kumar', 'Technical Lead', 'rajesh.k@nhsrcl.in', 'NHSRCL'),
(1, 'Priya Sharma', 'Data Scientist', 'priya.sharma@mit.edu', 'MIT'),
(1, 'Amit Patel', 'Infrastructure Engineer', 'amit.p@nhsrcl.in', 'NHSRCL');

-- Insert sample project activities
INSERT INTO project_activities (active_project_id, activity_type, description, user_name) VALUES
(1, 'milestone_completed', 'Phase 1: Data Collection Setup completed successfully', 'Dr. Sarah Chen'),
(1, 'document_uploaded', 'Q1 Progress Report uploaded', 'Priya Sharma'),
(1, 'budget_update', 'Budget utilization updated: $285,000 spent', 'Rajesh Kumar'),
(1, 'team_meeting', 'Monthly review meeting conducted with all stakeholders', 'Dr. Sarah Chen');

-- Insert sample IP disclosure
INSERT INTO ip_disclosures (active_project_id, title, description, invention_category, potential_applications, commercial_potential, status) VALUES
(1, 'Real-time Vibration Analysis Algorithm for Rail Track Monitoring', 'Novel machine learning algorithm that analyzes track vibration patterns to predict maintenance needs 7-14 days in advance with 94% accuracy', 'Software/Algorithm', 'High-speed rail systems, metro networks, freight rail infrastructure, bridge monitoring', 'High - Applicable to global rail industry worth $200B+. Licensing potential to rail operators worldwide', 'under_review');

-- Insert sample IP contributors
INSERT INTO ip_contributors (ip_disclosure_id, contributor_name, organization, ownership_percentage, role) VALUES
(1, 'Dr. Sarah Chen', 'MIT', 40.0, 'Lead Inventor'),
(1, 'Priya Sharma', 'MIT', 30.0, 'Algorithm Developer'),
(1, 'Rajesh Kumar', 'NHSRCL', 30.0, 'Domain Expert');

-- Insert sample student profiles
INSERT INTO student_profiles (College_id, name, email, degree_level, field_of_study, graduation_year, gpa, bio, availability_status) VALUES
(1, 'Alex Thompson', 'alex.t@mit.edu', 'PhD', 'Computer Science - Machine Learning', 2025, 3.92, 'PhD candidate specializing in deep learning for predictive maintenance. Published 3 papers in top ML conferences. Experience with TensorFlow, PyTorch, and large-scale data processing.', 'available'),
(1, 'Maria Garcia', 'maria.g@mit.edu', 'Masters', 'Electrical Engineering', 2024, 3.87, 'Masters student with focus on IoT sensor networks and embedded systems. Strong programming skills in Python and C++. Previous internship at Tesla.', 'available'),
(2, 'David Lee', 'david.l@stanford.edu', 'PhD', 'Renewable Energy Engineering', 2026, 3.95, 'PhD researcher working on next-generation solar cell materials. 5 publications, 2 patent applications. Seeking R&D position in cleantech industry.', 'available'),
(3, 'Ananya Reddy', 'ananya.r@iitb.ac.in', 'Masters', 'Data Science', 2024, 3.89, 'Masters student with expertise in data analytics, machine learning, and cloud computing. Completed projects in predictive analytics for manufacturing.', 'available');

-- Insert sample student skills
INSERT INTO student_skills (student_profile_id, skill_name, proficiency_level) VALUES
(1, 'Machine Learning', 'Expert'),
(1, 'Python', 'Expert'),
(1, 'TensorFlow', 'Advanced'),
(1, 'Data Analysis', 'Advanced'),
(2, 'IoT Systems', 'Advanced'),
(2, 'Embedded Programming', 'Advanced'),
(2, 'Python', 'Advanced'),
(2, 'Hardware Design', 'Intermediate'),
(3, 'Solar Energy', 'Expert'),
(3, 'Materials Science', 'Expert'),
(3, 'Research', 'Expert'),
(4, 'Data Science', 'Advanced'),
(4, 'Machine Learning', 'Advanced'),
(4, 'SQL', 'Advanced'),
(4, 'Cloud Computing', 'Intermediate');

-- Insert sample student project involvement
INSERT INTO student_project_involvement (student_profile_id, research_project_id, role, contribution_description, start_date) VALUES
(1, 1, 'Graduate Research Assistant', 'Developed core ML algorithms for predictive maintenance system. Led model training and validation.', '2023-06-01'),
(2, 1, 'Research Assistant', 'Designed and deployed IoT sensor network for data collection. Managed embedded systems integration.', '2023-09-01');

-- Insert sample recruitment requests
INSERT INTO recruitment_requests (corporate_partner_id, student_profile_id, position_title, message, status) VALUES
(1, 1, 'Senior Machine Learning Engineer', 'We are impressed with your work on predictive maintenance. Would you be interested in discussing a full-time position with NHSRCL?', 'pending'),
(2, 3, 'Renewable Energy Research Scientist', 'Your solar cell research aligns perfectly with our R&D roadmap. We would like to schedule an interview.', 'interview_scheduled');
