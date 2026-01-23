import { action } from '@uibakery/data';

function loadCollaborationRequests() {
  return action('loadCollaborationRequests', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        cr.id,
        cr.project_brief,
        cr.budget_proposed,
        cr.timeline_proposed,
        cr.status,
        cr.created_at,
        cp.name as company_name,
        cp.industry,
        rp.title as project_title,
        rp.id as project_id,
        u.name as university_name,
        ic.title as challenge_title
      FROM collaboration_requests cr
      JOIN corporate_partners cp ON cr.corporate_partner_id = cp.id
      LEFT JOIN research_projects rp ON cr.research_project_id = rp.id
      LEFT JOIN universities u ON rp.university_id = u.id
      LEFT JOIN industry_challenges ic ON cr.industry_challenge_id = ic.id
      WHERE 
        COALESCE({{params.status}}, '') = ''
        OR cr.status = {{params.status}}
      ORDER BY cr.created_at DESC;
    `,
  });
}

export default loadCollaborationRequests;
