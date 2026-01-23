import { action } from '@uibakery/data';

function loadIndustryChallenges() {
  return action('loadIndustryChallenges', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        ic.id,
        ic.title,
        ic.description,
        ic.budget_min,
        ic.budget_max,
        ic.timeline_months,
        ic.status,
        ic.created_at,
        cp.name as company_name,
        cp.industry,
        cp.location as company_location,
        ARRAY_AGG(ea.name) as required_expertise
      FROM industry_challenges ic
      JOIN corporate_partners cp ON ic.corporate_partner_id = cp.id
      LEFT JOIN industry_challenge_expertise ice ON ic.id = ice.industry_challenge_id
      LEFT JOIN expertise_areas ea ON ice.expertise_area_id = ea.id
      WHERE 
        ic.status = 'open'
        AND (COALESCE({{params.searchQuery}}, '') = '' OR ic.title ILIKE {{ '%' + params.searchQuery + '%' }})
      GROUP BY ic.id, cp.name, cp.industry, cp.location
      ORDER BY ic.created_at DESC;
    `,
  });
}

export default loadIndustryChallenges;
