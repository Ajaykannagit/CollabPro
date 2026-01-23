
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
        u.name as university_name,
        u.location as university_location,
        ARRAY_AGG(ea.name) as expertise_areas
      FROM research_projects rp
      JOIN universities u ON rp.university_id = u.id
      LEFT JOIN research_project_expertise rpe ON rp.id = rpe.research_project_id
      LEFT JOIN expertise_areas ea ON rpe.expertise_area_id = ea.id
      WHERE 
        rp.status = 'active'
        AND (COALESCE({{params.searchQuery}}, '') = '' OR rp.title ILIKE {{ '%' + params.searchQuery + '%' }})
      GROUP BY rp.id, u.name, u.location
      ORDER BY rp.created_at DESC;
    