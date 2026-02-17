import { describe, it, expect, vi, beforeEach } from 'vitest';
import loadActiveProjects from './loadActiveProjects';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
    },
}));

describe('loadActiveProjects action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load projects and their related data correctly', async () => {
        const mockProjects = [
            { id: 1, project_name: 'Test Project', funding_allocated: 1000, budget_utilized: 500, status: 'in_progress' }
        ];
        const mockMilestones = [
            { active_project_id: 1, status: 'completed' },
            { active_project_id: 1, status: 'pending' }
        ];
        const mockTeam = [
            { active_project_id: 1, name: 'Alice' }
        ];

        // Robust mock implementation that filters by table name
        vi.mocked(supabase.from).mockImplementation((table: string) => {
            if (table === 'active_projects') {
                return {
                    select: vi.fn().mockReturnThis(),
                    order: vi.fn().mockImplementation(() => Promise.resolve({ data: mockProjects, error: null })),
                    eq: vi.fn().mockReturnThis(),
                } as any;
            }
            if (table === 'project_milestones') {
                return {
                    select: vi.fn().mockReturnThis(),
                    in: vi.fn().mockImplementation(() => Promise.resolve({ data: mockMilestones, error: null })),
                } as any;
            }
            if (table === 'project_team_members') {
                return {
                    select: vi.fn().mockReturnThis(),
                    in: vi.fn().mockImplementation(() => Promise.resolve({ data: mockTeam, error: null })),
                } as any;
            }
            return {
                select: vi.fn().mockReturnThis(),
                then: vi.fn((cb) => cb({ data: [], error: null })),
            } as any;
        });

        const result = await loadActiveProjects();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expect.objectContaining({
            project_name: 'Test Project',
            completed_milestones: 1,
            total_milestones: 2,
            team_size: 1,
            budget_utilization_percent: 50
        }));
    });

    it('should handle errors gracefully with descriptive messages', async () => {
        vi.mocked(supabase.from).mockImplementation((table: string) => {
            if (table === 'active_projects') {
                return {
                    select: vi.fn().mockReturnThis(),
                    order: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: { message: 'Database failure' } })),
                } as any;
            }
            return { select: vi.fn().mockReturnThis() } as any;
        });

        await expect(loadActiveProjects()).rejects.toThrow('Failed to load active projects: Database failure');
    });

    it('should return empty array if no projects found', async () => {
        vi.mocked(supabase.from).mockImplementation((table: string) => {
            if (table === 'active_projects') {
                return {
                    select: vi.fn().mockReturnThis(),
                    order: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null })),
                } as any;
            }
            return { select: vi.fn().mockReturnThis() } as any;
        });

        const result = await loadActiveProjects();
        expect(result).toEqual([]);
    });
});
