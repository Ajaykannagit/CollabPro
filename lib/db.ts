// IndexedDB database setup using Dexie.js

import Dexie, { Table } from 'dexie';
import type {
    ResearchProject,
    IndustryChallenge,
    University,
    CollaborationRequest,
    IPDisclosure,
    Negotiation,
    Agreement,
    Notification,
    StudentProfile,
    LicensingOpportunity,
} from './types';

export class CollabProDatabase extends Dexie {
    research_projects!: Table<ResearchProject, number>;
    industry_challenges!: Table<IndustryChallenge, number>;
    universities!: Table<University, number>;
    collaboration_requests!: Table<CollaborationRequest, number>;
    ip_disclosures!: Table<IPDisclosure, number>;
    negotiations!: Table<Negotiation, number>;
    agreements!: Table<Agreement, number>;
    notifications!: Table<Notification, number>;
    student_profiles!: Table<StudentProfile, number>;
    licensing_opportunities!: Table<LicensingOpportunity, number>;

    constructor() {
        super('CollabProDB');

        this.version(1).stores({
            research_projects: '++id, title, status, university_name, *expertise_areas',
            industry_challenges: '++id, title, status, company_name, industry, *required_expertise',
            universities: '++id, name, location',
            collaboration_requests: '++id, status, research_project_id, industry_challenge_id',
            ip_disclosures: '++id, title, status, active_project_id',
            negotiations: '++id, collaboration_request_id, status',
            agreements: '++id, collaboration_request_id, status',
            notifications: '++id, user_id, type, read, created_at',
            student_profiles: '++id, name, university, *skills',
            licensing_opportunities: '++id, ip_disclosure_id, status',
        });
    }
}

export const db = new CollabProDatabase();
