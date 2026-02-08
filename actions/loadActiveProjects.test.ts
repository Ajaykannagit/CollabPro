import { describe, it, expect, vi } from 'vitest';
import loadActiveProjects from './loadActiveProjects';
import * as dataActions from '@/lib/data-actions';

vi.mock('@/lib/data-actions', () => ({
    action: vi.fn((name, type, config) => Promise.resolve({ name, type, config })),
}));

describe('loadActiveProjects action', () => {
    it('should call action with correct parameters', async () => {
        const result = await loadActiveProjects();

        expect(dataActions.action).toHaveBeenCalledWith(
            'loadActiveProjects',
            'SQL',
            expect.objectContaining({
                datasourceName: 'collabsync_pro_db',
                query: expect.stringContaining('SELECT'),
            })
        );

        expect(result).toEqual({
            name: 'loadActiveProjects',
            type: 'SQL',
            config: expect.objectContaining({
                datasourceName: 'collabsync_pro_db',
            }),
        });
    });

    it('should include status filtering in the query', async () => {
        await loadActiveProjects();

        const callArgs = vi.mocked(dataActions.action).mock.calls[0];
        const { query } = callArgs[2] as any;

        expect(query).toContain('ap.status = {{params.status}}');
    });

    it('should calculate budget utilization in the query', async () => {
        await loadActiveProjects();

        const callArgs = vi.mocked(dataActions.action).mock.calls[0];
        const { query } = callArgs[2] as any;

        expect(query).toContain('ap.budget_utilized / NULLIF(ap.funding_allocated, 0) * 100');
    });
});
