import { action } from '@uibakery/data';

function createCollaborationRequest() {
  return action('createCollaborationRequest', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      INSERT INTO collaboration_requests (
        corporate_partner_id,
        research_project_id,
        industry_challenge_id,
        project_brief,
        budget_proposed,
        timeline_proposed,
        status
      ) VALUES (
        {{params.corporatePartnerId}}::int,
        {{params.researchProjectId}}::int,
        {{params.industryChallengeId}}::int,
        {{params.projectBrief}},
        {{params.budgetProposed}}::numeric,
        {{params.timelineProposed}},
        'pending'
      ) RETURNING id;
    `,
  });
}

export default createCollaborationRequest;
