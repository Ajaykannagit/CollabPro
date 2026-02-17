import { supabase } from '@/lib/supabase';

export interface LoadAgreementDetailsParams {
  collaborationRequestId: number;
}

export default async function loadAgreementDetails(params: LoadAgreementDetailsParams): Promise<any[]> {
  const collaborationRequestId = params?.collaborationRequestId;
  if (!collaborationRequestId) return [];

  const { data: agreements, error } = await supabase
    .from('agreements')
    .select(`
      *,
      collaboration_requests (
        project_brief,
        research_project_id,
        corporate_partner_id,
        research_projects ( title, college_id, college_name, colleges ( name ) ),
        corporate_partners ( name )
      )
    `)
    .eq('collaboration_request_id', collaborationRequestId);

  if (error) throw error;
  if (!agreements?.length) return [];

  const cr = agreements[0].collaboration_requests;
  const rp = cr?.research_projects;
  return agreements.map((ca: any) => ({
    ...ca,
    project_brief: cr?.project_brief ?? '',
    project_title: rp?.title ?? '',
    College_name: rp?.college_name ?? rp?.colleges?.name ?? '',
    company_name: cr?.corporate_partners?.name ?? '',
  }));
}
