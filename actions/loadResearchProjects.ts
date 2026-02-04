import { action } from '@/lib/data-actions';

function loadResearchProjects() {
  return action('loadResearchProjects', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        rp.id,
        rp.title,
        rp.description,
        rp.funding_needed,
        rp.trl_level,
        rp.status,
        rp.team_lead,
        rp.team_size,
        rp.publications_count,
        u.name as College_name,
        u.location as College_location,
        ARRAY_AGG(ea.name) as expertise_areas
      FROM Pretablename_research_projects rp
      JOIN Pretablename_Colleges u ON rp.College_id = u.id
      LEFT JOIN Pretablename_research_project_expertise rpe ON rp.id = rpe.research_project_id
      LEFT JOIN Pretablename_expertise_areas ea ON rpe.expertise_area_id = ea.id
      WHERE 
        rp.status = 'active'
        AND (COALESCE({{params.searchQuery}}, '') = '' OR rp.title ILIKE {{ '%' + params.searchQuery + '%' }})
      GROUP BY rp.id, u.name, u.location
      ORDER BY rp.created_at DESC;
    `,
  });
}

export default loadResearchProjects;
