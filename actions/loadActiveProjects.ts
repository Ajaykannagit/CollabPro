import { supabase } from '@/lib/supabase';

export interface LoadActiveProjectsParams {
  status?: string | null;
}

export default async function loadActiveProjects(params?: LoadActiveProjectsParams): Promise<any[]> {
  try {
    let query = supabase
      .from('active_projects')
      .select('*')
      .order('created_at', { ascending: false });

    const status = params?.status?.trim();
    if (status) {
      query = query.eq('status', status);
    }

    const { data: projects, error: projectsError } = await query;

    if (projectsError) throw new Error(`Failed to load active projects: ${projectsError.message}`);
    if (!projects?.length) return [];

    const ids = projects.map((p: any) => p.id);

    const [milestonesRes, teamRes] = await Promise.all([
      supabase.from('project_milestones').select('*').in('active_project_id', ids),
      supabase.from('project_team_members').select('*').in('active_project_id', ids),
    ]);

    if (milestonesRes.error) throw new Error(`Failed to load project milestones: ${milestonesRes.error.message}`);
    if (teamRes.error) throw new Error(`Failed to load project team members: ${teamRes.error.message}`);

    const milestonesByProject: Record<number, any[]> = {};
    (milestonesRes.data || []).forEach((m: any) => {
      const pid = m.active_project_id;
      if (!milestonesByProject[pid]) milestonesByProject[pid] = [];
      milestonesByProject[pid].push(m);
    });
    const teamByProject: Record<number, any[]> = {};
    (teamRes.data || []).forEach((t: any) => {
      const pid = t.active_project_id;
      if (!teamByProject[pid]) teamByProject[pid] = [];
      teamByProject[pid].push(t);
    });

    return projects.map((ap: any) => {
      const milestones = milestonesByProject[ap.id] || [];
      const team = teamByProject[ap.id] || [];
      const completed = milestones.filter((m: any) => m.status === 'completed').length;
      const funding = Number(ap.funding_allocated) || 0;
      const utilized = Number(ap.budget_utilized) || 0;
      const budget_utilization_percent = funding ? Math.round((utilized / funding) * 10000) / 100 : 0;

      return {
        id: ap.id,
        project_name: ap.project_name,
        description: ap.description,
        funding_allocated: funding,
        budget_utilized: utilized,
        start_date: ap.start_date,
        end_date: ap.end_date,
        status: ap.status,
        budget_utilization_percent,
        total_milestones: milestones.length,
        completed_milestones: completed,
        team_size: team.length,
      };
    });
  } catch (err: any) {
    console.error('Error in loadActiveProjects:', err);
    throw err;
  }
}
