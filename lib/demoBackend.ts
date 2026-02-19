import { predictTRLTransition } from './intelligence/trl-forecaster';
import { calculateSynergy } from './intelligence/matcher';
export type DemoTables = {
  colleges: any[];
  corporate_partners: any[];
  expertise_areas: any[];
  research_projects: any[];
  research_project_expertise: any[];
  industry_challenges: any[];
  matchmaking_scores: any[];
  collaboration_requests: any[];
  agreements: any[];
  agreement_versions: any[];
  agreement_sections: any[];
  agreement_comments: any[];
  agreement_checklist_items: any[];
  agreement_templates: any[];
  active_projects: any[];
  project_milestones: any[];
  project_team_members: any[];
  project_documents: any[];
  ip_disclosures: any[];
  ip_contributors: any[];
  licensing_opportunities: any[];
  licensing_inquiries: any[];
  negotiation_messages: any[];
  project_scopes: any[];
  student_profiles: any[];
  student_skills: any[];
  student_project_involvement: any[];
  saved_candidates: any[];
  interview_requests: any[];
  user_sessions: any[];
  activity_logs: any[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function isoDateDaysFrom(base: string, plusDays: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + plusDays);
  return d.toISOString().slice(0, 10);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ilike(value: unknown, pattern: string) {
  const v = String(value ?? '').toLowerCase();
  const p = pattern.toLowerCase().split('%').join('');
  return v.includes(p);
}

function stableSort<T>(arr: T[], compare: (a: T, b: T) => number) {
  return arr
    .map((v, i) => ({ v, i }))
    .sort((a, b) => compare(a.v, b.v) || a.i - b.i)
    .map((x) => x.v);
}

function toNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nextId(rows: any[]): number {
  const max = rows.reduce((m, r) => Math.max(m, typeof r?.id === 'number' ? r.id : 0), 0);
  return max + 1;
}

export function createDemoTables(): DemoTables {
  const colleges = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const names = [
      'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
      'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IISc Bangalore', 'BITS Pilani',
      'MIT', 'Stanford University', 'University of Cambridge', 'ETH Zurich', 'NUS',
      'Tsinghua University', 'University of Tokyo', 'Imperial College London', 'KAIST', 'NTU',
      'Princeton', 'Harvard', 'Caltech', 'Oxford', 'Yale',
      'UCLA', 'Columbia', 'Cornell', 'UPenn', 'University of Chicago'
    ];
    const locations = [
      'Mumbai, India', 'New Delhi, India', 'Chennai, India', 'Kanpur, India', 'Kharagpur, India',
      'Roorkee, India', 'Guwahati, India', 'Hyderabad, India', 'Bangalore, India', 'Pilani, India',
      'Cambridge, MA, USA', 'Stanford, CA, USA', 'Cambridge, UK', 'Zurich, Switzerland', 'Singapore',
      'Beijing, China', 'Tokyo, Japan', 'London, UK', 'Daejeon, South Korea', 'Singapore',
      'Princeton, NJ, USA', 'Cambridge, MA, USA', 'Pasadena, CA, USA', 'Oxford, UK', 'New Haven, CT, USA',
      'Los Angeles, CA, USA', 'New York, NY, USA', 'Ithaca, NY, USA', 'Philadelphia, PA, USA', 'Chicago, IL, USA'
    ];
    return {
      id,
      name: names[i % names.length],
      location: locations[i % locations.length],
      website: `https://example.edu/${id}`,
      research_strengths: 'AI, Robotics, Systems, Quantum, Bio',
      available_resources: 'Labs, compute, partnerships, research grants',
      success_rate: 80 + (i % 15),
      past_partnerships_count: 10 + i * 2,
      active_projects_count: 3 + (i % 7),
      created_at: isoDaysAgo(200 + i),
    };
  });

  const corporate_partners = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const names = [
      'NHSRCL', 'Reliance', 'TCS', 'Infosys', 'Wipro',
      'Tech Mahindra', 'L&T', 'BHEL', 'Mahindra', 'Adani',
      'Google', 'Microsoft', 'Amazon', 'Apple', 'IBM',
      'Siemens', 'Bosch', 'Samsung', 'Huawei', 'SAP',
      'Meta', 'NVIDIA', 'Tesla', 'Oracle', 'Intel',
      'Adobe', 'Salesforce', 'Cisco', 'Qualcomm', 'Netflix'
    ];
    const industries = [
      'Transportation', 'Energy', 'IT Services', 'IT Services', 'IT Services',
      'IT Services', 'Engineering', 'Industrial', 'Automotive', 'Infrastructure',
      'Technology', 'Technology', 'E-commerce, Cloud', 'Technology', 'Technology, Consulting',
      'Industrial Technology', 'Automotive, Tech', 'Electronics', 'Telecom', 'Enterprise Software',
      'Social Media', 'AI Hardware', 'Automotive, AI', 'Cloud Enterprise', 'Semiconductors',
      'Creative Software', 'CRM SaaS', 'Networking Tech', 'Mobile Tech', 'Entertainment Streaming'
    ];
    const locations = [
      'New Delhi, India', 'Mumbai, India', 'Mumbai, India', 'Bangalore, India', 'Bangalore, India',
      'Pune, India', 'Mumbai, India', 'New Delhi, India', 'Mumbai, India', 'Ahmedabad, India',
      'Mountain View, USA', 'Redmond, USA', 'Seattle, USA', 'Cupertino, USA', 'Armonk, USA',
      'Munich, Germany', 'Stuttgart, Germany', 'Seoul, South Korea', 'Shenzhen, China', 'Walldorf, Germany',
      'Menlo Park, USA', 'Santa Clara, USA', 'Austin, USA', 'Austin, USA', 'Santa Clara, USA',
      'San Jose, USA', 'San Francisco, USA', 'San Jose, USA', 'San Diego, USA', 'Los Gatos, USA'
    ];
    return {
      id,
      name: names[i % names.length],
      industry: industries[i % industries.length],
      location: locations[i % locations.length],
      website: `https://example.com/company/${id}`,
      company_size: 'Large',
      created_at: isoDaysAgo(300 + i),
    };
  });

  const expertise_areas = [
    { id: 1, name: 'Artificial Intelligence', description: 'ML, DL, AI systems', created_at: isoDaysAgo(400) },
    { id: 2, name: 'Internet of Things', description: 'Sensors and edge devices', created_at: isoDaysAgo(399) },
    { id: 3, name: 'Cybersecurity', description: 'Secure systems', created_at: isoDaysAgo(398) },
    { id: 4, name: 'Robotics', description: 'Autonomy and manipulation', created_at: isoDaysAgo(397) },
    { id: 5, name: 'Cloud Computing', description: 'Distributed systems', created_at: isoDaysAgo(396) },
    { id: 6, name: 'Quantum Computing', description: 'Quantum algorithms', created_at: isoDaysAgo(395) },
    { id: 7, name: 'Energy Systems', description: 'Smart grids', created_at: isoDaysAgo(394) },
    { id: 8, name: 'Materials Science', description: 'Advanced materials', created_at: isoDaysAgo(393) },
    { id: 9, name: 'BioTechnology', description: 'Bio/medical tech', created_at: isoDaysAgo(392) },
    { id: 10, name: 'Computer Vision', description: 'Imaging and perception', created_at: isoDaysAgo(391) },
    { id: 11, name: 'Natural Language Processing', description: 'Text and speech', created_at: isoDaysAgo(390) },
    { id: 12, name: 'Blockchain', description: 'Distributed ledger', created_at: isoDaysAgo(389) },
  ];

  const research_projects = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const college_id = (i % colleges.length) + 1;
    const c = colleges[college_id - 1];
    const titles = [
      'AI-Powered Predictive Maintenance',
      'Smart Grid Optimization',
      'Cybersecurity Threat Detection',
      'Robotics for Inspection',
      'NLP for Technical Documents',
      'Quantum Algorithm Benchmarking',
      'Advanced Material Characterization',
      'Biometric Authentication Systems',
      'Smart City Traffic Modeling',
      'Autonomous Drone Navigation'
    ];
    return {
      id,
      college_id,
      title: `Project ${id}: ${titles[i % titles.length]}`,
      description: `Applied research initiative #${id} with clear milestones and deployment targets. Focused on high-impact technology development.`,
      funding_needed: 800000 + id * 25000,
      funding_allocated: 500000 + id * 20000,
      budget_utilized: 100000 + id * 5000,
      trl_level: ((id - 1) % 9) + 1,
      status: i % 10 === 0 ? 'completed' : 'active',
      team_lead: `Dr. Expert ${id}`,
      team_size: 4 + (id % 12),
      project_type: id % 3 === 0 ? 'software' : id % 3 === 1 ? 'hardware' : 'system',
      trl_history: [
        { trl: 1, date: isoDaysAgo(300 + id) },
        { trl: Math.max(1, ((id - 1) % 9)), date: isoDaysAgo(100 + id) }
      ],
      publications_count: id % 7,
      college_name: c?.name ?? '',
      start_date: isoDateDaysFrom('2024-01-01', id * 7),
      end_date: isoDateDaysFrom('2025-12-31', id * 3),
      created_at: isoDaysAgo(120 - id),
      colleges: c ? { name: c.name, location: c.location } : null,
    };
  });

  const research_project_expertise = research_projects.flatMap((p) => {
    const a = ((p.id - 1) % expertise_areas.length) + 1;
    const b = ((p.id + 4) % expertise_areas.length) + 1;
    return [
      { research_project_id: p.id, expertise_area_id: a, created_at: isoDaysAgo(60) },
      { research_project_id: p.id, expertise_area_id: b, created_at: isoDaysAgo(59) },
    ];
  });

  const industry_challenges = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const corporate_partner_id = (i % corporate_partners.length) + 1;
    const cp = corporate_partners[corporate_partner_id - 1];
    const themes = [
      'Operational Efficiency', 'Reliability & Monitoring', 'Security & Compliance',
      'Automation & Analytics', 'Carbon Footprint Reduction', 'Scalable Infrastructure',
      'Supply Chain Resilience', 'Customer Experience AI'
    ];
    return {
      id,
      corporate_partner_id,
      title: `Challenge ${id}: ${themes[id % themes.length]}`,
      description: `Industry partner challenge #${id} with measurable outcomes, seeking innovative academic collaboration for rapid prototyping and validation.`,
      budget_min: 300000 + id * 15000,
      budget_max: 600000 + id * 25000,
      timeline_months: 6 + (id % 24),
      status: i % 5 === 0 ? 'closed' : 'open',
      company_name: cp?.name ?? '',
      industry: cp?.industry ?? '',
      company_location: cp?.location ?? '',
      created_at: isoDaysAgo(90 - id),
      corporate_partners: cp ? { name: cp.name } : null,
    };
  });

  const matchmaking_scores = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const research_project_id = (i % research_projects.length) + 1;
    const industry_challenge_id = (i % industry_challenges.length) + 1;
    const project = research_projects[research_project_id - 1];
    const challenge = industry_challenges[industry_challenge_id - 1];

    const synergy = calculateSynergy(project, challenge);

    return {
      id,
      research_project_id,
      industry_challenge_id,
      compatibility_score: synergy.score,
      reasoning: synergy.reasoning,
      strategic_fit: synergy.strategicFit,
      technical_overlap: synergy.technicalOverlap,
      created_at: isoDaysAgo(30 - id),
    };
  });

  const collaboration_requests = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const corporate_partner_id = (i % corporate_partners.length) + 1;
    const research_project_id = (i % research_projects.length) + 1;
    const industry_challenge_id = (i % industry_challenges.length) + 1;
    return {
      id,
      corporate_partner_id,
      research_project_id,
      industry_challenge_id,
      project_brief: `Strategic collaboration brief for project ${id} and challenge ${id}, detailing joint R&D goals.`,
      budget_proposed: 500000 + id * 20000,
      timeline_proposed: `${6 + (id % 18)} months`,
      status: id % 3 === 0 ? 'accepted' : id % 3 === 1 ? 'pending' : 'under_review',
      created_at: isoDaysAgo(50 - id),
    };
  });

  const agreements = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      collaboration_request_id: id,
      agreement_type: id % 2 === 0 ? 'Joint Development Agreement' : 'Research Collaboration Agreement',
      ip_ownership_split: id % 2 === 0 ? '60% College, 40% Corporate' : '70% College, 30% Corporate',
      revenue_sharing_model: '50-50 revenue sharing',
      confidentiality_terms: 'Confidential for 5 years',
      termination_clauses: '90-day termination notice',
      compliance_requirements: 'Compliance with applicable regulations',
      status: id % 4 === 0 ? 'signed' : id % 4 === 1 ? 'draft' : id % 4 === 2 ? 'under_review' : 'approved',
      college_signed_at: id % 4 === 0 ? isoDaysAgo(5) : null,
      college_signatory: id % 4 === 0 ? 'Dr. Sarah Chen' : null,
      corporate_signed_at: id % 4 === 0 ? isoDaysAgo(4) : null,
      corporate_signatory: id % 4 === 0 ? 'Rajesh Kumar' : null,
      college_approval_status: id % 3 === 0 || id % 4 === 0,
      corporate_approval_status: id % 5 === 0 || id % 4 === 0,
      created_at: isoDaysAgo(80 - id),
      updated_at: isoDaysAgo(10 - (id % 10)),
    };
  });

  const agreement_versions = agreements.map((a) => ({
    id: a.id,
    agreement_id: a.id,
    version_number: 'v1.0',
    created_at: isoDaysAgo(70 - a.id),
    created_by: 'System',
    change_summary: 'Initial draft',
  }));

  const agreement_sections = agreement_versions.flatMap((v) => {
    return [1, 2, 3].map((seq) => ({
      id: v.id * 10 + seq,
      agreement_version_id: v.id,
      section_id: `S${v.id}_${seq}`,
      title: seq === 1 ? 'Scope' : seq === 2 ? 'IP & Licensing' : 'Confidentiality',
      content: 'Section content for demo review and comments.',
      display_order: seq,
      created_at: isoDaysAgo(65 - v.id),
    }));
  });

  const agreement_checklist_items = agreements.flatMap((a) => {
    return [1, 2, 3, 4, 5].map((seq) => ({
      id: a.id * 10 + seq,
      agreement_id: a.id,
      item_label: `Checklist item ${seq}`,
      item_key: `item_${seq}`,
      is_checked: seq === 1,
      display_order: seq,
      created_at: isoDaysAgo(60 - a.id),
      updated_at: isoDaysAgo(5),
    }));
  });

  const agreement_comments = agreements.flatMap((a) => {
    return [1, 2].map((seq) => ({
      id: a.id * 10 + seq,
      agreement_id: a.id,
      section_id: `S${a.id}_${((seq - 1) % 3) + 1}`,
      author: seq === 1 ? 'Reviewer' : 'Legal',
      comment_text: 'Comment for review and iteration.',
      created_at: isoDaysAgo(20 - a.id),
    }));
  });

  const agreement_templates = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Template ${i + 1}`,
    description: 'Reusable agreement template for rapid drafting.',
    agreement_type: i % 2 === 0 ? 'Joint Development Agreement' : 'Research Collaboration Agreement',
    ip_ownership_split: i % 2 === 0 ? '60% College, 40% Corporate' : '70% College, 30% Corporate',
    revenue_sharing_model: '50-50',
    confidentiality_terms: '5 years',
    termination_clauses: '90 days',
    compliance_requirements: 'General compliance',
    created_at: isoDaysAgo(500 - i),
  }));

  const active_projects = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      collaboration_request_id: id,
      project_name: `Execution: ${research_projects[(id - 1) % research_projects.length].title}`,
      description: 'Active execution phase with critical milestones and interdisciplinary team participation.',
      funding_allocated: 600000 + id * 25000,
      start_date: isoDateDaysFrom('2024-02-01', id * 10),
      end_date: isoDateDaysFrom('2025-12-31', id * 4),
      budget_utilized: 120000 + id * 6000,
      status: i % 15 === 0 ? 'completed' : 'in_progress',
      created_at: isoDaysAgo(40 - id),
      updated_at: isoDaysAgo(2),
    };
  });

  const project_milestones = active_projects.flatMap((ap) => {
    return [1, 2].map((seq) => ({
      id: ap.id * 10 + seq,
      active_project_id: ap.id,
      title: `Milestone ${ap.id}.${seq}`,
      description: 'Milestone deliverable with acceptance criteria.',
      due_date: isoDateDaysFrom('2024-03-01', ap.id * 14 + seq * 21),
      completion_date: null,
      status: 'pending',
      deliverables: 'Docs, prototype, evaluation',
      created_at: isoDaysAgo(30),
      updated_at: isoDaysAgo(1),
    }));
  });

  const project_team_members = active_projects.flatMap((ap) => {
    return [1, 2].map((seq) => ({
      id: ap.id * 10 + seq,
      active_project_id: ap.id,
      name: `Member ${ap.id}.${seq}`,
      role: seq === 1 ? 'Lead' : 'Engineer',
      email: `member${ap.id}_${seq}@example.com`,
      organization: ap.id % 2 === 0 ? 'Corporate Partner' : 'College Lab',
      created_at: isoDaysAgo(25),
    }));
  });

  const project_documents = Array.from({ length: 20 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      project_id: id, // research_project_id
      file_name: `document_${id}.pdf`,
      file_size: 200000 + id * 1000,
      file_type: 'application/pdf',
      storage_path: `projects/${id}/document_${id}.pdf`,
      uploaded_by: 'Seeder',
      uploaded_at: isoDaysAgo(10 - (id % 10)),
      version: 1,
      description: 'Seeded project document metadata.',
    };
  });

  const ip_disclosures = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const invention_category = id % 3 === 0 ? 'Software/Algorithm' : id % 3 === 1 ? 'Device/System' : 'Process/Method';
    return {
      id,
      research_project_id: (i % research_projects.length) + 1,
      title: `Novel IP: ${invention_category} for ${expertise_areas[id % expertise_areas.length].name}`,
      description: `Technological disclosure describing a novel technique in ${invention_category}, with significant industrial scalability and market readiness.`,
      invention_category,
      potential_applications: 'Aviation, Rail, Renewable Energy, and Smart Manufacturing',
      commercial_potential: 'High commercial potential with established licensing pathways and strong patentability.',
      prior_art_references: 'Referenced IEEE and USPTO archives for primary technical novelty validation.',
      status: id % 4 === 0 ? 'under_review' : id % 4 === 1 ? 'disclosed' : id % 4 === 2 ? 'draft' : 'patent_pending',
      filing_date: isoDateDaysFrom('2024-03-01', id * 5),
      patent_number: id % 5 === 0 ? `US-${100000 + id}-B2` : null,
      created_at: isoDaysAgo(35 - id),
      submission_date: isoDaysAgo(id),
      category: invention_category,
    };
  });

  const ip_contributors = ip_disclosures.flatMap((ip) => {
    return [1, 2].map((seq) => ({
      id: ip.id * 10 + seq,
      ip_disclosure_id: ip.id,
      contributor_name: `Contributor ${ip.id}.${seq}`,
      organization: seq === 1 ? 'College Lab' : 'Corporate Partner',
      ownership_percentage: seq === 1 ? 60 : 40,
      role: seq === 1 ? 'Inventor' : 'Co-Inventor',
      created_at: isoDaysAgo(20),
    }));
  });

  const licensing_opportunities = ip_disclosures.map((ip) => ({
    id: ip.id,
    ip_disclosure_id: ip.id,
    anonymized_title: `Opportunity ${ip.id}`,
    anonymized_description: 'Anonymized description suitable for public listing.',
    licensing_type: ip.id % 2 === 0 ? 'non-exclusive' : 'exclusive',
    asking_price: 200000 + ip.id * 15000,
    industry_sectors: ip.id % 3 === 0 ? 'Transportation' : ip.id % 3 === 1 ? 'Energy' : 'Enterprise Software',
    inquiries_count: 1,
    visibility: 'public',
    status: 'available',
    created_at: isoDaysAgo(15 - (ip.id % 15)),
  }));

  const licensing_inquiries = Array.from({ length: 20 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      licensing_opportunity_id: id,
      inquirer_name: `Inquirer ${id}`,
      inquirer_email: `inquirer${id}@example.com`,
      inquirer_organization: `Org ${id}`,
      message: 'Interested in exploring licensing terms and technical details.',
      created_at: isoDaysAgo(7 - (id % 7)),
    };
  });

  const negotiation_messages = Array.from({ length: 20 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      collaboration_request_id: id,
      sender_name: id % 2 === 0 ? 'Corporate Rep' : 'College Rep',
      sender_organization: id % 2 === 0 ? 'Corporate Partner' : 'College',
      message_type: 'text',
      content: "Let's align on scope, deliverables, and milestones.",
      is_system_message: false,
      created_at: isoDaysAgo(14 - (id % 14)),
    };
  });

  const project_scopes = Array.from({ length: 20 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      collaboration_request_id: id,
      version_number: 1,
      scope_description: 'Initial scope proposal for collaboration.',
      deliverables: 'Prototype, validation, deployment plan.',
      timeline: `${6 + (id % 18)} months`,
      budget: 400000 + id * 15000,
      created_by: 'System',
      status: id % 3 === 0 ? 'approved' : 'proposed',
      created_at: isoDaysAgo(18 - (id % 18)),
    };
  });

  const student_profiles = Array.from({ length: 30 }).map((_, i) => {
    const id = i + 1;
    const college_id = (i % colleges.length) + 1;
    const names = [
      'Amit Sharma', 'Sarah Johnson', 'Chen Wei', 'Elena Rossi', 'Hiroshi Tanaka',
      'Priya Nair', 'James Miller', 'Sofia Garcia', 'Lucas Meyer', 'Zoe Chen',
      'Arjun Gupta', 'Emma Wilson', 'Li Na', 'Matteo Ricci', 'Yuki Sato',
      'Anjali Devi', 'William Brown', 'Isabella Martinez', 'Hans Schmidt', 'Mia Wong',
      'Rohan Das', 'Olivia Taylor', 'Wang Jun', 'Giulia Bianchi', 'Kenji Ito',
      'Sita Ram', 'Robert Smith', 'Carmen Ortiz', 'Felix Wagner', 'Chloe Lin'
    ];
    return {
      id,
      college_id,
      name: names[i % names.length],
      email: `student${id}@example.edu`,
      degree_level: id % 3 === 0 ? 'PhD' : id % 3 === 1 ? 'Masters' : 'Bachelors',
      field_of_study:
        id % 4 === 0
          ? 'Computer Science'
          : id % 4 === 1
            ? 'Electrical Engineering'
            : id % 4 === 2
              ? 'Mechanical Engineering'
              : 'Data Science',
      graduation_year: 2024 + (id % 3),
      gpa: Number((3.5 + (id % 40) / 100).toFixed(2)),
      bio: `Dedicated ${id % 3 === 0 ? 'doctoral candidate' : 'graduate student'} with strong focus on ${expertise_areas[i % expertise_areas.length].name} and practical implementation skills.`,
      availability_status: id % 2 === 0 ? 'available' : 'busy',
      created_at: isoDaysAgo(70 - id),
      updated_at: isoDaysAgo(3),
    };
  });

  const student_skills = student_profiles.flatMap((sp) => {
    return [
      { id: sp.id * 10 + 1, student_profile_id: sp.id, skill_name: 'Python', proficiency_level: sp.id % 2 === 0 ? 'advanced' : 'intermediate', created_at: isoDaysAgo(40) },
      { id: sp.id * 10 + 2, student_profile_id: sp.id, skill_name: 'SQL', proficiency_level: sp.id % 2 === 0 ? 'advanced' : 'intermediate', created_at: isoDaysAgo(39) },
    ];
  });

  const student_project_involvement = student_profiles.map((sp) => ({
    id: sp.id,
    student_profile_id: sp.id,
    research_project_id: ((sp.id - 1) % research_projects.length) + 1,
    role: 'Research Assistant',
    contribution_description: 'Contributed to experiments, data, and documentation.',
    start_date: isoDateDaysFrom('2024-02-01', sp.id * 3),
    end_date: null,
    created_at: isoDaysAgo(20),
  }));

  const saved_candidates = Array.from({ length: 20 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      corporate_partner_id: ((id - 1) % corporate_partners.length) + 1,
      student_profile_id: ((id - 1) % student_profiles.length) + 1,
      notes: 'Saved for follow-up discussion.',
      interest_level: id % 3 === 0 ? 'high' : id % 3 === 1 ? 'medium' : 'low',
      created_at: isoDaysAgo(12 - (id % 12)),
    };
  });

  const interview_requests = Array.from({ length: 20 }).map((_, i) => {
    const id = i + 1;
    return {
      id,
      student_profile_id: id,
      requester_name: 'Recruiter',
      requester_email: 'recruiter@example.com',
      requester_organization: 'Corporate Partner',
      message: 'Requesting a 30-minute interview to discuss experience and fit.',
      status: id % 4 === 0 ? 'approved' : id % 4 === 2 ? 'declined' : 'pending',
      created_at: isoDaysAgo(8 - (id % 8)),
    };
  });

  const user_sessions = [
    { id: 1, user_id: 'user_1', name: 'Rajesh Kumar', email: 'rajesh.kumar@rail-solutions.com', organization: 'Global Rail Solutions', organization_type: 'corporate', role: 'Project Manager', created_at: isoDaysAgo(5) },
    { id: 2, user_id: 'user_2', name: 'Dr. Sarah Chen', email: 'sarah.chen@iitb.ac.in', organization: 'IIT Bombay', organization_type: 'college', role: 'Principal Investigator', created_at: isoDaysAgo(10) },
    { id: 3, user_id: 'user_3', name: 'Vikram Mehta', email: 'vikram.mehta@tcs.com', organization: 'TCS', organization_type: 'corporate', role: 'Technology Lead', created_at: isoDaysAgo(15) },
    { id: 4, user_id: 'user_4', name: 'Dr. Neha Singh', email: 'neha.singh@iitd.ac.in', organization: 'IIT Delhi', organization_type: 'college', role: 'Research Director', created_at: isoDaysAgo(20) },
    { id: 5, user_id: 'user_5', name: 'Priya Sharma', email: 'priya.sharma@iitm.ac.in', organization: 'IIT Madras', organization_type: 'college', role: 'Research Scientist', created_at: isoDaysAgo(25) },
  ];

  const activity_logs = Array.from({ length: 25 }).map((_, i) => {
    const id = i + 1;
    const project_id = (i % research_projects.length) + 1;
    const actions = [
      'Document Uploaded',
      'Milestone Completed',
      'IP Disclosure Submitted',
      'New Team Member Added',
      'Phase 1 Review Complete',
      'Funding Status Updated',
      'Meeting Scheduled',
      'Budget Report Generated',
    ];
    return {
      id,
      project_id,
      action: actions[i % actions.length],
      actor: i % 2 === 0 ? 'Rajesh Kumar' : 'Dr. Sarah Chen',
      timestamp: isoDaysAgo(i * 2),
      details: `System log for ${actions[i % actions.length]} event.`,
    };
  });

  return {
    colleges,
    corporate_partners,
    expertise_areas,
    research_projects,
    research_project_expertise,
    industry_challenges,
    matchmaking_scores,
    collaboration_requests,
    agreements,
    agreement_versions,
    agreement_sections,
    agreement_comments,
    agreement_checklist_items,
    agreement_templates,
    active_projects,
    project_milestones,
    project_team_members,
    project_documents,
    ip_disclosures,
    ip_contributors,
    licensing_opportunities,
    licensing_inquiries,
    negotiation_messages,
    project_scopes,
    student_profiles,
    student_skills,
    student_project_involvement,
    saved_candidates,
    interview_requests,
    user_sessions,
    activity_logs,
  };
}

export function attachRelations(tables: DemoTables, table: keyof DemoTables, row: any) {
  // Return a copy with common embedded relations used by the UI queries.
  const r = { ...row };

  if (table === 'research_projects') {
    const c = tables.colleges.find((x) => x.id === r.college_id);
    r.colleges = c ? { name: c.name, location: c.location } : null;
    r.activity_logs = tables.activity_logs
      .filter((l) => l.project_id === r.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    r.trl_prediction = predictTRLTransition(r);
  }

  if (table === 'industry_challenges') {
    const cp = tables.corporate_partners.find((x) => x.id === r.corporate_partner_id);
    r.corporate_partners = cp ? { name: cp.name } : null;
  }

  if (table === 'collaboration_requests') {
    const cp = tables.corporate_partners.find((x) => x.id === r.corporate_partner_id);
    const rp = tables.research_projects.find((x) => x.id === r.research_project_id);
    const ic = tables.industry_challenges.find((x) => x.id === r.industry_challenge_id);
    r.corporate_partners = cp ? { name: cp.name, industry: cp.industry } : null;
    r.research_projects = rp ? attachRelations(tables, 'research_projects', rp) : null;
    r.industry_challenges = ic ? { title: ic.title } : null;
  }

  if (table === 'agreements') {
    const cr = tables.collaboration_requests.find((x) => x.id === r.collaboration_request_id);
    if (cr) {
      const cp = tables.corporate_partners.find((x) => x.id === cr.corporate_partner_id);
      const rp = tables.research_projects.find((x) => x.id === cr.research_project_id);
      r.collaboration_requests = {
        ...cr,
        corporate_partners: cp ? { name: cp.name } : null,
        research_projects: rp ? attachRelations(tables, 'research_projects', rp) : null,
      };
    } else {
      r.collaboration_requests = null;
    }
  }

  if (table === 'matchmaking_scores') {
    const rp = tables.research_projects.find((x) => x.id === r.research_project_id);
    const ic = tables.industry_challenges.find((x) => x.id === r.industry_challenge_id);
    const cp = ic ? tables.corporate_partners.find((x) => x.id === ic.corporate_partner_id) : null;
    r.research_projects = rp ? attachRelations(tables, 'research_projects', rp) : null;
    r.industry_challenges = ic
      ? {
        ...ic,
        corporate_partners: cp ? { name: cp.name } : null,
      }
      : null;
  }

  if (table === 'student_profiles') {
    const c = tables.colleges.find((x) => x.id === r.college_id);
    r.colleges = c ? { name: c.name } : null;
    r.student_skills = tables.student_skills
      .filter((s) => s.student_profile_id === r.id)
      .map((s) => ({ skill_name: s.skill_name }));
    r.student_project_involvement = tables.student_project_involvement
      .filter((spi) => spi.student_profile_id === r.id)
      .map((spi) => ({ id: spi.id, research_project_id: spi.research_project_id }));
  }

  if (table === 'saved_candidates') {
    const sp = tables.student_profiles.find((x) => x.id === r.student_profile_id);
    r.student_profiles = sp ? attachRelations(tables, 'student_profiles', sp) : null;
  }

  if (table === 'licensing_opportunities') {
    const ip = tables.ip_disclosures.find((x) => x.id === r.ip_disclosure_id);
    r.ip_disclosures = ip ? { invention_category: ip.invention_category, status: ip.status } : null;
  }

  if (table === 'ip_disclosures') {
    const rp = r.research_project_id ? tables.research_projects.find((x) => x.id === r.research_project_id) : null;
    r.research_projects = rp ? { title: rp.title } : null;
    r.ip_contributors = tables.ip_contributors
      .filter((c) => c.ip_disclosure_id === r.id)
      .map((c) => ({
        contributor_name: c.contributor_name,
        organization: c.organization,
        ownership_percentage: c.ownership_percentage,
        role: c.role,
      }));
  }

  return r;
}

export function createDemoBackend() {
  const tables: DemoTables = createDemoTables();
  const files = new Map<string, Blob>(); // key: `${bucket}:${path}`

  const api = {
    tables,
    files,
    async delay(ms = 600) {
      await new Promise((r) => setTimeout(r, ms));
    },
    getTable(name: keyof DemoTables) {
      return tables[name];
    },
    setTable(name: keyof DemoTables, rows: any[]) {
      (tables as any)[name] = rows;
    },
    attach(table: keyof DemoTables, row: any) {
      return attachRelations(tables, table, row);
    },
    newId(table: keyof DemoTables) {
      return nextId(tables[table]);
    },
    ilike,
    clamp,
    stableSort,
    toNumber,
  };

  return api;
}

export type DemoBackend = ReturnType<typeof createDemoBackend>;

