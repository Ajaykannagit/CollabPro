import { supabase } from '@/lib/supabase';

export interface LoadProjectIPDisclosuresParams {
  projectId: number;
}

export default async function loadProjectIPDisclosures(params: LoadProjectIPDisclosuresParams): Promise<any[]> {
  try {
    const projectId = params?.projectId;
    if (!projectId) return [];

    let researchProjectId: number | null = projectId;
    const { data: ap } = await supabase.from('active_projects').select('collaboration_request_id').eq('id', projectId).maybeSingle();

    if (ap?.collaboration_request_id) {
      const { data: cr } = await supabase.from('collaboration_requests').select('research_project_id').eq('id', ap.collaboration_request_id).maybeSingle();
      if (cr?.research_project_id != null) {
        researchProjectId = cr.research_project_id;
      }
    }

    if (!researchProjectId) return [];

    const { data, error } = await supabase
      .from('ip_disclosures')
      .select('id, title, description, invention_category, status, filing_date, patent_number, created_at')
      .eq('research_project_id', researchProjectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description ?? '',
      submission_date: r.filing_date ?? r.created_at,
      status: r.status ?? 'draft',
      category: r.invention_category ?? '',
    }));
  } catch (err) {
    console.error('Error loading IP disclosures:', err);
    return [];
  }
}
