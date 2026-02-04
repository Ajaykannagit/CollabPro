import { action } from '@/lib/data-actions';

function loadMatchmakingScores() {
  return action('loadMatchmakingScores', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        ms.id,
        ms.compatibility_score,
        ms.reasoning,
        rp.id as project_id,
        rp.title as project_title,
        rp.description as project_description,
        rp.trl_level,
        u.name as College_name,
        ic.id as challenge_id,
        ic.title as challenge_title,
        ic.description as challenge_description,
        cp.name as company_name,
        ARRAY_AGG(DISTINCT ea1.name) as project_expertise,
        ARRAY_AGG(DISTINCT ea2.name) as challenge_expertise
      FROM matchmaking_scores ms
      JOIN Pretablename_research_projects rp ON ms.research_project_id = rp.id
      JOIN Pretablename_Colleges u ON rp.College_id = u.id
      JOIN Pretablename_industry_challenges ic ON ms.industry_challenge_id = ic.id
      JOIN Pretablename_corporate_partners cp ON ic.corporate_partner_id = cp.id
      LEFT JOIN Pretablename_research_project_expertise rpe ON rp.id = rpe.research_project_id
      LEFT JOIN Pretablename_expertise_areas ea1 ON rpe.expertise_area_id = ea1.id
      LEFT JOIN industry_challenge_expertise ice ON ic.id = ice.industry_challenge_id
      LEFT JOIN Pretablename_expertise_areas ea2 ON ice.expertise_area_id = ea2.id
      WHERE ms.compatibility_score >= {{params.minScore}}::numeric
      GROUP BY ms.id, rp.id, u.name, ic.id, cp.name
      ORDER BY ms.compatibility_score DESC
      LIMIT 20;
    `,
  });
}

export default loadMatchmakingScores;
