
      SELECT 
        ip.id,
        ip.title,
        ip.description,
        ip.invention_category,
        ip.potential_applications,
        ip.commercial_potential,
        ip.status,
        ip.filing_date,
        ip.patent_number,
        ip.created_at,
        ap.project_name,
        ARRAY_AGG(jsonb_build_object(
          'name', ipc.contributor_name,
          'organization', ipc.organization,
          'ownership_percentage', ipc.ownership_percentage,
          'role', ipc.role
        )) as contributors
      FROM ip_disclosures ip
      JOIN active_projects ap ON ip.active_project_id = ap.id
      LEFT JOIN ip_contributors ipc ON ip.id = ipc.ip_disclosure_id
      WHERE 
        COALESCE(:param0, '') = ''
        OR ip.status = :param1
      GROUP BY ip.id, ap.project_name
      ORDER BY ip.created_at DESC;
    