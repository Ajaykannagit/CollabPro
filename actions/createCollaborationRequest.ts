import { supabase } from '@/lib/supabase';

type CreateCollaborationRequestParams = {
  corporatePartnerId: number;
  researchProjectId: number;
  industryChallengeId?: number | null;
  projectBrief: string;
  budgetProposed: number;
  timelineProposed: string;
};

export default async function createCollaborationRequest(params: CreateCollaborationRequestParams) {
  const {
    corporatePartnerId,
    researchProjectId,
    industryChallengeId,
    projectBrief,
    budgetProposed,
    timelineProposed,
  } = params;

  const { data, error } = await supabase
    .from('collaboration_requests')
    .insert([{
      corporate_partner_id: corporatePartnerId,
      research_project_id: researchProjectId,
      industry_challenge_id: industryChallengeId ?? null,
      project_brief: projectBrief,
      budget_proposed: budgetProposed,
      timeline_proposed: timelineProposed,
      status: 'pending',
    }])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create collaboration request: ${error.message}`);
  }

  return data;
}

