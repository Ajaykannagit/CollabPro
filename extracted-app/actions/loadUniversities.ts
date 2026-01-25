import { action } from '@uibakery/data';

function loadColleges() {
  return action('loadColleges', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        u.id,
        u.name,
        u.location,
        u.website,
        u.research_strengths,
        u.available_resources,
        u.success_rate,
        u.past_partnerships_count,
        COUNT(DISTINCT rp.id) as active_projects_count
      FROM Colleges u
      LEFT JOIN research_projects rp ON u.id = rp.College_id AND rp.status = 'active'
      WHERE COALESCE({{params.searchQuery}}, '') = '' OR u.name ILIKE {{ '%' + params.searchQuery + '%' }}
      GROUP BY u.id
      ORDER BY u.success_rate DESC;
    `,
  });
}

export default loadColleges;
