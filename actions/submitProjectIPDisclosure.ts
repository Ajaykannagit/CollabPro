'use server';

import { supabase } from '@/lib/supabase';

type IPDisclosureData = {
  projectId: number;
  title: string;
  description: string;
};

export default async function submitProjectIPDisclosure(data: IPDisclosureData) {
  const { projectId, title, description } = data;

  if (!projectId || !title || !description) {
    throw new Error("Missing required fields");
  }

  // Map projectId (active_project id) to research_project_id
  let researchProjectId = projectId;
  const ap = await supabase.from('active_projects').select('collaboration_request_id').eq('id', projectId).single();
  if (ap.data?.collaboration_request_id) {
    const cr = await supabase.from('collaboration_requests').select('research_project_id').eq('id', ap.data.collaboration_request_id).single();
    if (cr.data?.research_project_id != null) researchProjectId = cr.data.research_project_id;
  }

  const { data: result, error } = await supabase
    .from('ip_disclosures')
    .insert([
      {
        research_project_id: researchProjectId,
        title: title,
        description: description,
        status: 'Under Review',
        submission_date: new Date().toISOString(),
        category: 'Invention' // Default category
      }
    ])
    .select();

  if (error) {
    throw new Error(`Failed to submit IP disclosure: ${error.message}`);
  }

  return result;
}
