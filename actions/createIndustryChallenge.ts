import { action } from '@/lib/data-actions';

function createIndustryChallenge() {
  return action('createIndustryChallenge', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      INSERT INTO industry_challenges (
        corporate_partner_id,
        title,
        description,
        budget_min,
        budget_max,
        timeline_months,
        status
      ) VALUES (
        {{params.corporatePartnerId}}::int,
        {{params.title}},
        {{params.description}},
        {{params.budgetMin}}::numeric,
        {{params.budgetMax}}::numeric,
        {{params.timelineMonths}}::int,
        'open'
      ) RETURNING id;
    `,
  });
}

export default createIndustryChallenge;
