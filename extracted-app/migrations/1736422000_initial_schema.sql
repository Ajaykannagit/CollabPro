-- Migration to create initial CollabSync Pro schema

-- Expertise areas lookup table
CREATE TABLE expertise_areas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Colleges table
CREATE TABLE Colleges (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  website TEXT,
  research_strengths TEXT,
  available_resources TEXT,
  success_rate NUMERIC(5, 2) DEFAULT 0,
  past_partnerships_count INT DEFAULT 0,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Corporate partners table
CREATE TABLE corporate_partners (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT,
  website TEXT,
  company_size TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Research projects table
CREATE TABLE research_projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  College_id BIGINT NOT NULL REFERENCES Colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  funding_needed NUMERIC(12, 2),
  trl_level INT CHECK (trl_level >= 1 AND trl_level <= 9),
  status TEXT DEFAULT 'active',
  team_lead TEXT,
  team_size INT,
  publications_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Research project expertise areas (many-to-many)
CREATE TABLE research_project_expertise (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  research_project_id BIGINT NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
  expertise_area_id BIGINT NOT NULL REFERENCES expertise_areas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(research_project_id, expertise_area_id)
);

-- Industry challenges table
CREATE TABLE industry_challenges (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  corporate_partner_id BIGINT NOT NULL REFERENCES corporate_partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  timeline_months INT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Industry challenge required expertise (many-to-many)
CREATE TABLE industry_challenge_expertise (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  industry_challenge_id BIGINT NOT NULL REFERENCES industry_challenges(id) ON DELETE CASCADE,
  expertise_area_id BIGINT NOT NULL REFERENCES expertise_areas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(industry_challenge_id, expertise_area_id)
);

-- Collaboration requests table
CREATE TABLE collaboration_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  corporate_partner_id BIGINT NOT NULL REFERENCES corporate_partners(id) ON DELETE CASCADE,
  research_project_id BIGINT REFERENCES research_projects(id) ON DELETE CASCADE,
  industry_challenge_id BIGINT REFERENCES industry_challenges(id) ON DELETE CASCADE,
  project_brief TEXT NOT NULL,
  budget_proposed NUMERIC(12, 2),
  timeline_proposed TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Matchmaking scores table
CREATE TABLE matchmaking_scores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  research_project_id BIGINT NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
  industry_challenge_id BIGINT NOT NULL REFERENCES industry_challenges(id) ON DELETE CASCADE,
  compatibility_score NUMERIC(5, 2) NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(research_project_id, industry_challenge_id)
);

-- Create indexes for performance
CREATE INDEX idx_research_projects_College_id ON research_projects(College_id);
CREATE INDEX idx_research_projects_status ON research_projects(status);
CREATE INDEX idx_industry_challenges_corporate_partner_id ON industry_challenges(corporate_partner_id);
CREATE INDEX idx_industry_challenges_status ON industry_challenges(status);
CREATE INDEX idx_collaboration_requests_status ON collaboration_requests(status);
CREATE INDEX idx_matchmaking_scores_score ON matchmaking_scores(compatibility_score DESC);

-- Insert sample expertise areas
INSERT INTO expertise_areas (name, description) VALUES
('Artificial Intelligence', 'Machine learning, deep learning, neural networks'),
('Renewable Energy', 'Solar, wind, hydro, and sustainable energy solutions'),
('Biotechnology', 'Genetic engineering, pharmaceuticals, medical research'),
('Quantum Computing', 'Quantum algorithms, quantum cryptography, quantum hardware'),
('Robotics', 'Autonomous systems, industrial automation, humanoid robots'),
('Cybersecurity', 'Network security, encryption, threat detection'),
('Nanotechnology', 'Nanomaterials, nanoelectronics, nanomedicine'),
('Smart Manufacturing', 'Industry 4.0, IoT in manufacturing, predictive maintenance');

-- Insert sample Colleges
INSERT INTO Colleges (name, location, website, research_strengths, available_resources, success_rate, past_partnerships_count) VALUES
('MIT', 'Cambridge, MA', 'https://mit.edu', 'AI, Robotics, Quantum Computing', 'Advanced labs, supercomputing clusters, $2B research budget', 92.5, 145),
('Stanford College', 'Stanford, CA', 'https://stanford.edu', 'Biotechnology, AI, Renewable Energy', 'Innovation hub, venture partnerships, cutting-edge facilities', 89.3, 128),
('IIT Bombay', 'Mumbai, India', 'https://iitb.ac.in', 'Smart Manufacturing, Cybersecurity, Renewable Energy', 'Industry collaboration center, 500+ PhD researchers', 85.7, 92),
('Cambridge College', 'Cambridge, UK', 'https://cam.ac.uk', 'Quantum Computing, Nanotechnology, Biotechnology', 'Nobel laureate faculty, world-class equipment', 91.2, 156);

-- Insert sample corporate partners
INSERT INTO corporate_partners (name, industry, location, website, company_size) VALUES
('NHSRCL', 'Rail Transportation', 'New Delhi, India', 'https://nhsrcl.in', '5000+'),
('TechCorp Global', 'Technology', 'San Francisco, CA', 'https://techcorp.example', '10000+'),
('GreenEnergy Solutions', 'Renewable Energy', 'Berlin, Germany', 'https://greenenergy.example', '2000-5000'),
('BioMed Innovations', 'Healthcare & Pharmaceuticals', 'Boston, MA', 'https://biomed.example', '1000-2000');

-- Insert sample research projects
INSERT INTO research_projects (College_id, title, description, funding_needed, trl_level, team_lead, team_size, publications_count) VALUES
(1, 'AI-Powered Predictive Maintenance for Rail Systems', 'Developing machine learning models to predict equipment failures in high-speed rail infrastructure, reducing downtime by 40%.', 750000, 6, 'Dr. Sarah Chen', 8, 12),
(2, 'Next-Gen Solar Panel Efficiency', 'Research on perovskite-silicon tandem solar cells achieving 32% efficiency with lower manufacturing costs.', 1200000, 5, 'Prof. Michael Rodriguez', 12, 18),
(3, 'Quantum Encryption for Financial Networks', 'Implementing quantum key distribution protocols for unhackable banking transactions.', 950000, 4, 'Dr. Priya Sharma', 6, 9),
(4, 'Biodegradable Nanomaterials for Drug Delivery', 'Engineering biocompatible nanoparticles for targeted cancer therapy with minimal side effects.', 1800000, 7, 'Prof. James Watson', 15, 24),
(1, 'Autonomous Navigation Systems for Urban Rail', 'Computer vision and sensor fusion for self-driving train technology in complex urban environments.', 2100000, 5, 'Dr. Robert Kim', 10, 15),
(3, 'Smart Grid Optimization Using IoT', 'Real-time energy distribution management leveraging 10,000+ IoT sensors for renewable integration.', 850000, 6, 'Dr. Anita Desai', 7, 11);

-- Link research projects with expertise areas
INSERT INTO research_project_expertise (research_project_id, expertise_area_id) VALUES
(1, 1), (1, 5), -- AI-Powered Predictive Maintenance: AI, Robotics
(2, 2), -- Next-Gen Solar: Renewable Energy
(3, 4), (3, 6), -- Quantum Encryption: Quantum Computing, Cybersecurity
(4, 7), (4, 3), -- Nanomaterials: Nanotechnology, Biotechnology
(5, 1), (5, 5), -- Autonomous Navigation: AI, Robotics
(6, 2), (6, 8); -- Smart Grid: Renewable Energy, Smart Manufacturing

-- Insert sample industry challenges
INSERT INTO industry_challenges (corporate_partner_id, title, description, budget_min, budget_max, timeline_months) VALUES
(1, 'Predictive Maintenance for High-Speed Rail Infrastructure', 'NHSRCL seeks AI-based solutions to predict track and equipment failures before they occur, minimizing service disruptions on the Mumbai-Ahmedabad corridor.', 500000, 1000000, 24),
(2, 'Secure Quantum Communication System', 'Looking for quantum encryption technology to protect sensitive corporate data against future quantum computer threats.', 800000, 1500000, 18),
(3, 'Cost-Effective Solar Panel Manufacturing', 'Need research partnership to develop scalable manufacturing process for high-efficiency solar panels at 30% lower cost.', 1000000, 2000000, 30),
(4, 'Targeted Drug Delivery Platform', 'Seeking nanotechnology solutions for precision delivery of oncology medications to tumor sites.', 1500000, 2500000, 36);

-- Link industry challenges with required expertise
INSERT INTO industry_challenge_expertise (industry_challenge_id, expertise_area_id) VALUES
(1, 1), (1, 5), (1, 8), -- Predictive Maintenance: AI, Robotics, Smart Manufacturing
(2, 4), (2, 6), -- Quantum Communication: Quantum Computing, Cybersecurity
(3, 2), -- Solar Manufacturing: Renewable Energy
(4, 7), (4, 3); -- Drug Delivery: Nanotechnology, Biotechnology

-- Insert sample matchmaking scores
INSERT INTO matchmaking_scores (research_project_id, industry_challenge_id, compatibility_score, reasoning) VALUES
(1, 1, 95.5, 'Excellent alignment: Project specifically targets AI-powered predictive maintenance for rail systems. Team has published 12 papers on ML for infrastructure. TRL 6 indicates near-commercial readiness. Budget match within range.'),
(3, 2, 88.3, 'Strong match: Quantum encryption expertise aligns with secure communication needs. TRL 4 suggests proof-of-concept stage matching 18-month timeline. Budget compatible.'),
(2, 3, 82.7, 'Good alignment: Perovskite solar research directly addresses efficiency and cost goals. Publications demonstrate credibility. Timeline may need extension for manufacturing scale-up.'),
(4, 4, 91.2, 'Excellent fit: Nanoparticle drug delivery research at TRL 7 indicates advanced development. Team size and publication record suggest strong capability. Budget and timeline well-matched.'),
(6, 1, 74.5, 'Moderate match: IoT and smart grid expertise could apply to rail monitoring, but not core focus. Would require project scope adjustment.'),
(5, 1, 79.8, 'Good potential: Autonomous navigation complements predictive maintenance vision. Computer vision could enhance track inspection. Collaboration could expand project scope.');

-- Insert sample collaboration requests
INSERT INTO collaboration_requests (corporate_partner_id, research_project_id, industry_challenge_id, project_brief, budget_proposed, timeline_proposed, status) VALUES
(1, 1, 1, 'NHSRCL proposes collaboration on AI predictive maintenance system for Mumbai-Ahmedabad high-speed rail. Project scope includes sensor deployment, ML model development, and 6-month pilot on 50km track section. Seeking exclusive partnership with IP sharing agreement.', 850000, '24 months with 6-month pilot phase', 'pending'),
(4, 4, 4, 'BioMed Innovations requests partnership for clinical translation of nanoparticle drug delivery platform. Proposal includes co-funding Phase I trials, joint patent filing, and licensing terms. Cambridge team would lead preclinical validation.', 2200000, '36 months including regulatory preparation', 'pending');
