import { action } from '@/lib/data-actions';

function loadAgreementDetails() {
  return action('loadAgreementDetails', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        ca.*,
        cr.project_brief,
        rp.title as project_title,
        u.name as College_name,
        cp.name as company_name
      FROM agreements ca
      JOIN collaboration_requests cr ON ca.collaboration_request_id = cr.id
      LEFT JOIN research_projects rp ON cr.research_project_id = rp.id
      LEFT JOIN colleges u ON rp.college_id = u.id
      JOIN corporate_partners cp ON cr.corporate_partner_id = cp.id
      WHERE ca.collaboration_request_id = {{params.collaborationRequestId}}::int;
    `,
  });
}

export default loadAgreementDetails;
