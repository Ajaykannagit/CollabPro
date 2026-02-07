import { action } from '@/lib/data-actions';

function loadProjectIPDisclosures() {
    return action('loadProjectIPDisclosures', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        id.id,
        id.title,
        id.submission_date,
        id.status,
        id.category,
        id.description
      FROM ip_disclosures id
      WHERE id.research_project_id = {{params.projectId}}::int
      ORDER BY id.submission_date DESC;
    `,
    });
}

export default loadProjectIPDisclosures;
