
      SELECT 
        ap.id,
        ap.project_name,
        ap.description,
        ap.funding_allocated,
        ap.budget_utilized,
        ap.start_date,
        ap.end_date,
        ap.status,
        ROUND((ap.budget_utilized / NULLIF(ap.funding_allocated, 0) * 100), 2) as budget_utilization_percent,
        COUNT(DISTINCT pm.id) as total_milestones,
        COUNT(DISTINCT CASE WHEN pm.status = 'completed' THEN pm.id END) as completed_milestones,
        COUNT(DISTINCT ptm.id) as team_size
      FROM active_projects ap
      LEFT JOIN project_milestones pm ON ap.id = pm.active_project_id
      LEFT JOIN project_team_members ptm ON ap.id = ptm.active_project_id
      WHERE 
        COALESCE(:param0, '') = ''
        OR ap.status = :param1
      GROUP BY ap.id
      ORDER BY ap.created_at DESC;
    