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

  const { data: result, error } = await supabase
    .from('ip_disclosures')
    .insert([
      {
        research_project_id: projectId,
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
