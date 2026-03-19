import { supabase } from '@/lib/supabase';

export interface LoadProjectDocumentsParams {
  projectId: number;
}

export default async function loadProjectDocuments(params: LoadProjectDocumentsParams): Promise<any[]> {
  const projectId = params?.projectId;
  if (!projectId) return [];

  let researchProjectId = projectId;
  const ap = await supabase.from('active_projects').select('collaboration_request_id').eq('id', projectId).single();
  if (ap.data?.collaboration_request_id) {
    const cr = await supabase.from('collaboration_requests').select('research_project_id').eq('id', ap.data.collaboration_request_id).single();
    if (cr.data?.research_project_id != null) researchProjectId = cr.data.research_project_id;
  }

  const { data, error } = await supabase
    .from('project_documents')
    .select('id, project_id, file_name, file_size, file_type, storage_path, uploaded_by, uploaded_at, version, description')
    .eq('project_id', researchProjectId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
