import { supabase } from '@/lib/supabase';

type CreateIPDisclosureParams = {
  researchProjectId: number;
  title: string;
  description: string;
  inventionCategory: string;
  potentialApplications: string;
  priorArtReferences: string;
  commercialPotential: string;
};

export default async function createIPDisclosure(params: CreateIPDisclosureParams) {
  const {
    researchProjectId,
    title,
    description,
    inventionCategory,
    potentialApplications,
    priorArtReferences,
    commercialPotential,
  } = params;

  const { data, error } = await supabase
    .from('ip_disclosures')
    .insert([{
      research_project_id: researchProjectId,
      title,
      description,
      invention_category: inventionCategory,
      potential_applications: potentialApplications,
      prior_art_references: priorArtReferences,
      commercial_potential: commercialPotential,
      status: 'disclosed',
    }])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create IP disclosure: ${error.message}`);
  }

  return data;
}

