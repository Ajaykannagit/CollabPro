import { describe, it, expect, vi, beforeEach } from 'vitest';
import loadResearchProjects from './loadResearchProjects';
import { supabase } from '@/lib/supabase';

describe('loadResearchProjects action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call supabase with correct parameters', async () => {
        await loadResearchProjects();

        expect(supabase.from).toHaveBeenCalledWith('research_projects');
        expect(supabase.from('research_projects').select).toHaveBeenCalled();
        expect(supabase.from('research_projects').eq).toHaveBeenCalledWith('status', 'active');
        expect(supabase.from('research_projects').order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should include searchQuery filtering in the query', async () => {
        await loadResearchProjects({ searchQuery: 'AI' });

        expect(supabase.from('research_projects').ilike).toHaveBeenCalledWith('title', '%AI%');
    });
});
