import { action } from '@/lib/data-actions';

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
        u.name as College_name,
        ic.title as challenge_title
      FROM Pretablename_collaboration_requests cr
      JOIN Pretablename_corporate_partners cp ON cr.corporate_partner_id = cp.id
      LEFT JOIN Pretablename_research_projects rp ON cr.research_project_id = rp.id
      LEFT JOIN Pretablename_Colleges u ON rp.College_id = u.id
      LEFT JOIN Pretablename_industry_challenges ic ON cr.industry_challenge_id = ic.id
      WHERE 
        COALESCE({{params.status}}, '') = ''
        OR cr.status = {{params.status}}
      ORDER BY cr.created_at DESC;
    `,
  });
}

export default loadCollaborationRequests;
