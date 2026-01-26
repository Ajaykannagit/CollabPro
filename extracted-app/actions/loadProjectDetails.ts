import { action } from '@/lib/data-actions';

function loadProjectDetails() {
  return action('loadProjectDetails', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        ap.id,
        ap.project_name,
        ap.description,
        ap.funding_allocated,
        ap.budget_utilized,
        ap.start_date,
        ap.end_date,
        ap.status,
        ARRAY_AGG(DISTINCT jsonb_build_object(
          'id', pm.id,
          'title', pm.title,
          'description', pm.description,
          'due_date', pm.due_date,
          'status', pm.status,
          'deliverables', pm.deliverables
        )) FILTER (WHERE pm.id IS NOT NULL) as milestones,
        ARRAY_AGG(DISTINCT jsonb_build_object(
          'id', ptm.id,
          'name', ptm.name,
          'role', ptm.role,
          'email', ptm.email,
          'organization', ptm.organization
        )) FILTER (WHERE ptm.id IS NOT NULL) as team_members
      FROM active_projects ap
      LEFT JOIN project_milestones pm ON ap.id = pm.active_project_id
      LEFT JOIN project_team_members ptm ON ap.id = ptm.active_project_id
      WHERE ap.id = {{params.projectId}}::int
      GROUP BY ap.id;
    `,
  });
}

export default loadProjectDetails;
