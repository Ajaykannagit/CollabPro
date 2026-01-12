
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
      FROM universities u
      LEFT JOIN research_projects rp ON u.id = rp.university_id AND rp.status = 'active'
      WHERE COALESCE({{params.searchQuery}}, '') = '' OR u.name ILIKE {{ '%' + params.searchQuery + '%' }}
      GROUP BY u.id
      ORDER BY u.success_rate DESC;
    