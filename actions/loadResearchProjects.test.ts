import { describe, it, expect, vi } from 'vitest';
import loadResearchProjects from './loadResearchProjects';
import * as dataActions from '@/lib/data-actions';

vi.mock('@/lib/data-actions', () => ({
    action: vi.fn((name, type, config) => Promise.resolve({ name, type, config })),
}));

describe('loadResearchProjects action', () => {
    it('should call action with correct parameters', async () => {
        const result = await loadResearchProjects();

        expect(dataActions.action).toHaveBeenCalledWith(
            'loadResearchProjects',
            'SQL',
            expect.objectContaining({
                datasourceName: 'collabsync_pro_db',
                query: expect.stringContaining('SELECT'),
            })
        );

        expect(result).toEqual({
            name: 'loadResearchProjects',
            type: 'SQL',
            config: expect.objectContaining({
                datasourceName: 'collabsync_pro_db',
            }),
        });
    });

    it('should include searchQuery filtering in the query', async () => {
        await loadResearchProjects();

        const callArgs = vi.mocked(dataActions.action).mock.calls[0];
        const { query } = callArgs[2] as any;

        expect(query).toContain('rp.title ILIKE');
        expect(query).toContain('params.searchQuery');
    });
});
