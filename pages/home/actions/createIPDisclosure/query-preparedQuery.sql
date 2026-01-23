
      INSERT INTO ip_disclosures (
        active_project_id,
        title,
        description,
        invention_category,
        potential_applications,
        prior_art_references,
        commercial_potential,
        status
      ) VALUES (
        :param0::int,
        :param1,
        :param2,
        :param3,
        :param4,
        :param5,
        :param6,
        'disclosed'
      ) RETURNING id;
    