import { supabase } from '@/lib/supabase';

export interface LoadResearchProjectsParams {
  searchQuery?: string | null;
}

export default async function loadResearchProjects(params?: LoadResearchProjectsParams): Promise<any[]> {
  const searchQuery = params?.searchQuery?.trim() || '';

  try {
    let query = supabase
      .from('research_projects')
      .select(`
        id,
        title,
        description,
        funding_needed,
        funding_allocated,
        budget_utilized,
        trl_level,
        status,
        team_lead,
        team_size,
        publications_count,
        college_id,
        college_name,
        start_date,
        end_date,
        created_at,
        colleges ( name, location )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data: rows, error } = await query;

    if (error) throw new Error(`Failed to load research projects: ${error.message}`);

    return (rows || []).map((r: any) => {
      const college = r.colleges;
      return ({
        id: r.id,
        title: r.title,
        description: r.description ?? '',
        funding_needed: r.funding_needed == null ? 0 : Number(r.funding_needed),
        funding_allocated: r.funding_allocated == null ? 0 : Number(r.funding_allocated),
        budget_utilized: r.budget_utilized == null ? 0 : Number(r.budget_utilized),
        trl_level: r.trl_level ?? 0,
        status: r.status ?? 'active',
        team_lead: r.team_lead ?? '',
        team_size: r.team_size ?? 0,
        publications_count: r.publications_count ?? 0,
        College_name: r.college_name ?? college?.name ?? '',
        College_location: college?.location ?? '',
        expertise_areas: [],
        created_at: r.created_at,
      });
    });
  } catch (err: any) {
    console.error('Error in loadResearchProjects:', err);
    throw err;
  }
}
