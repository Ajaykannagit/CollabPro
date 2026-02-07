import { action } from '@/lib/data-actions';

function loadProjectDocuments() {
    return action('loadProjectDocuments', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        id,
        project_id,
        file_name,
        file_size,
        file_type,
        storage_path,
        uploaded_by,
        uploaded_at,
        version,
        description
      FROM project_documents
      WHERE project_id = {{params.projectId}}::int
      ORDER BY uploaded_at DESC;
    `,
    });
}

export default loadProjectDocuments;
