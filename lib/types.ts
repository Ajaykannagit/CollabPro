// TypeScript types for the CollabPro application

export interface ResearchProject {
  id?: number;
  title: string;
  description: string;
  funding_needed: number;
  trl_level: number;
  status: string;
  team_lead: string;
  team_size: number;
  publications_count: number;
  college_name: string;
  college_location: string;
  expertise_areas: string[];
  created_at?: string;
}

export interface IndustryChallenge {
  id?: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  timeline_months: number;
  status: string;
  company_name: string;
  industry: string;
  company_location: string;
  required_expertise: string[];
  created_at?: string;
}

export interface College {
  id?: number;
  name: string;
  location: string;
  website: string;
  research_strengths: string;
  available_resources: string;
  success_rate: number;
  past_partnerships_count: number;
  active_projects_count: number;
  created_at?: string;
}

export interface CollaborationRequest {
  id?: number;
  corporate_partner_id: number;
  research_project_id: number;
  industry_challenge_id?: number;
  project_brief: string;
  budget_proposed: number;
  timeline_proposed: string;
  status: string;
  created_at?: string;
}

export interface IPDisclosure {
  id?: number;
  active_project_id: number;
  title: string;
  description: string;
  invention_type: string;
  inventors: string[];
  disclosure_date: string;
  status: string;
  created_at?: string;
}

export interface NegotiationMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'message' | 'proposal' | 'counter-proposal';
}

export interface Negotiation {
  id?: number;
  collaboration_request_id: number;
  messages: NegotiationMessage[];
  status: string;
  created_at?: string;
}

export interface AgreementSection {
  id: string;
  title: string;
  text: string;
}

export interface AgreementVersion {
  version_number: string;
  created_at: string;
  created_by: string;
  content: string;
  sections: AgreementSection[];
}

export interface Agreement {
  id?: number;
  collaboration_request_id: number;
  versions: AgreementVersion[];
  current_version: string;
  status: string;
  created_at?: string;
}

export interface Notification {
  id?: number;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at?: string;
}

export interface StudentProfile {
  id?: number;
  name: string;
  college: string;
  degree: string;
  skills: string[];
  availability: string;
  gpa: number;
  projects: string[];
  bio: string;
  created_at?: string;
}

export interface LicensingOpportunity {
  id?: number;
  ip_disclosure_id: number;
  title: string;
  description: string;
  price_range: string;
  license_type: string;
  status: string;
  created_at?: string;
}
