import { supabase } from '@/lib/supabase';

export interface LoadCollaborationRequestsParams {
  status?: string | null;
}

export default async function loadCollaborationRequests(params?: LoadCollaborationRequestsParams): Promise<any[]> {
  let query = supabase
    .from('collaboration_requests')
    .select(`
      id,
      project_brief,
      budget_proposed,
      timeline_proposed,
      status,
      created_at,
      corporate_partner_id,
      research_project_id,
      industry_challenge_id,
      corporate_partners ( name, industry ),
      research_projects ( title, college_id, college_name, colleges ( name, location ) ),
      industry_challenges ( title )
    `)
    .order('created_at', { ascending: false });

  const status = params?.status?.trim();
  if (status) {
    query = query.eq('status', status);
  }

  const { data: rows, error } = await query;

  if (error) throw error;

  return (rows || []).map((r: any) => {
    const rp = r.research_projects;
    const college = rp?.colleges;
    return {
      id: r.id,
      project_brief: r.project_brief ?? '',
      budget_proposed: r.budget_proposed == null ? 0 : Number(r.budget_proposed),
      timeline_proposed: r.timeline_proposed ?? '',
      status: r.status ?? 'pending',
      created_at: r.created_at,
      company_name: r.corporate_partners?.name ?? '',
      industry: r.corporate_partners?.industry ?? '',
      project_title: rp?.title ?? '',
      project_id: r.research_project_id,
      College_name: rp?.college_name ?? college?.name ?? '',
      challenge_title: r.industry_challenges?.title ?? '',
    };
  });
}
