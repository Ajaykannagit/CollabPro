import Dexie, { Table } from 'dexie';
import {
  ResearchProject,
  IndustryChallenge,
  College,
  CollaborationRequest,
  IPDisclosure,
  Negotiation,
  Agreement,
  Notification,
  StudentProfile,
  LicensingOpportunity,
} from './types';

export class CollabProDB extends Dexie {
  research_projects!: Table<ResearchProject>;
  industry_challenges!: Table<IndustryChallenge>;
  colleges!: Table<College>;
  collaboration_requests!: Table<CollaborationRequest>;
  ip_disclosures!: Table<IPDisclosure>;
  negotiations!: Table<Negotiation>;
  agreements!: Table<Agreement>;
  notifications!: Table<Notification>;
  student_profiles!: Table<StudentProfile>;
  licensing_opportunities!: Table<LicensingOpportunity>;

  constructor() {
    super('CollabProDB');
    this.version(1).stores({
      research_projects: '++id, title, status, college_name',
      industry_challenges: '++id, title, status, company_name',
      colleges: '++id, name, location',
      collaboration_requests: '++id, status, corporate_partner_id, research_project_id',
      ip_disclosures: '++id, title, status, active_project_id',
      negotiations: '++id, status, collaboration_request_id',
      agreements: '++id, status, collaboration_request_id',
      notifications: '++id, user_id, type, read, created_at',
      student_profiles: '++id, name, college',
      licensing_opportunities: '++id, status, ip_disclosure_id',
    });
  }
}

export const db = new CollabProDB();
