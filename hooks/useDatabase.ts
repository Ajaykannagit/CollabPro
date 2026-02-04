// Custom React hooks for IndexedDB operations using Dexie

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import type {
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
} from '../lib/types';

// Research Projects Hook
export function useProjects() {
    const data = useLiveQuery(() => db.research_projects.toArray()) || [];

    const create = async (project: Omit<ResearchProject, 'id' | 'created_at'>) => {
        return await db.research_projects.add({
            ...project,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<ResearchProject>) => {
        return await db.research_projects.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.research_projects.delete(id);
    };

    const getById = async (id: number) => {
        return await db.research_projects.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Industry Challenges Hook
export function useChallenges() {
    const data = useLiveQuery(() => db.industry_challenges.toArray()) || [];

    const create = async (challenge: Omit<IndustryChallenge, 'id' | 'created_at'>) => {
        return await db.industry_challenges.add({
            ...challenge,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<IndustryChallenge>) => {
        return await db.industry_challenges.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.industry_challenges.delete(id);
    };

    const getById = async (id: number) => {
        return await db.industry_challenges.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Colleges Hook
export function useColleges() {
    const data = useLiveQuery(() => db.colleges.toArray()) || [];

    const create = async (college: Omit<College, 'id' | 'created_at'>) => {
        return await db.colleges.add({
            ...college,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<College>) => {
        return await db.colleges.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.colleges.delete(id);
    };

    const getById = async (id: number) => {
        return await db.colleges.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Collaboration Requests Hook
export function useCollaborationRequests() {
    const data = useLiveQuery(() => db.collaboration_requests.toArray()) || [];

    const create = async (request: Omit<CollaborationRequest, 'id' | 'created_at'>) => {
        return await db.collaboration_requests.add({
            ...request,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<CollaborationRequest>) => {
        return await db.collaboration_requests.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.collaboration_requests.delete(id);
    };

    const getById = async (id: number) => {
        return await db.collaboration_requests.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// IP Disclosures Hook
export function useIPDisclosures() {
    const data = useLiveQuery(() => db.ip_disclosures.toArray()) || [];

    const create = async (disclosure: Omit<IPDisclosure, 'id' | 'created_at'>) => {
        return await db.ip_disclosures.add({
            ...disclosure,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<IPDisclosure>) => {
        return await db.ip_disclosures.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.ip_disclosures.delete(id);
    };

    const getById = async (id: number) => {
        return await db.ip_disclosures.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Negotiations Hook
export function useNegotiations() {
    const data = useLiveQuery(() => db.negotiations.toArray()) || [];

    const create = async (negotiation: Omit<Negotiation, 'id' | 'created_at'>) => {
        return await db.negotiations.add({
            ...negotiation,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<Negotiation>) => {
        return await db.negotiations.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.negotiations.delete(id);
    };

    const getById = async (id: number) => {
        return await db.negotiations.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Agreements Hook
export function useAgreements() {
    const data = useLiveQuery(() => db.agreements.toArray()) || [];

    const create = async (agreement: Omit<Agreement, 'id' | 'created_at'>) => {
        return await db.agreements.add({
            ...agreement,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<Agreement>) => {
        return await db.agreements.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.agreements.delete(id);
    };

    const getById = async (id: number) => {
        return await db.agreements.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Notifications Hook
export function useNotifications() {
    const data = useLiveQuery(() =>
        db.notifications.orderBy('created_at').reverse().toArray()
    ) || [];

    const create = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
        return await db.notifications.add({
            ...notification,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<Notification>) => {
        return await db.notifications.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.notifications.delete(id);
    };

    const markAsRead = async (id: number) => {
        return await db.notifications.update(id, { read: true });
    };

    const markAllAsRead = async () => {
        const unread = await db.notifications.where('read').equals(0).toArray();
        await Promise.all(unread.map(n => n.id && db.notifications.update(n.id, { read: true })));
    };

    const unreadCount = data.filter(n => !n.read).length;

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        markAsRead,
        markAllAsRead,
        unreadCount,
    };
}

// Student Profiles Hook
export function useStudentProfiles() {
    const data = useLiveQuery(() => db.student_profiles.toArray()) || [];

    const create = async (profile: Omit<StudentProfile, 'id' | 'created_at'>) => {
        return await db.student_profiles.add({
            ...profile,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<StudentProfile>) => {
        return await db.student_profiles.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.student_profiles.delete(id);
    };

    const getById = async (id: number) => {
        return await db.student_profiles.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Licensing Opportunities Hook
export function useLicensingOpportunities() {
    const data = useLiveQuery(() => db.licensing_opportunities.toArray()) || [];

    const create = async (opportunity: Omit<LicensingOpportunity, 'id' | 'created_at'>) => {
        return await db.licensing_opportunities.add({
            ...opportunity,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<LicensingOpportunity>) => {
        return await db.licensing_opportunities.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.licensing_opportunities.delete(id);
    };

    const getById = async (id: number) => {
        return await db.licensing_opportunities.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}
