
      INSERT INTO collaboration_requests (
        corporate_partner_id,
        research_project_id,
        industry_challenge_id,
        project_brief,
        budget_proposed,
        timeline_proposed,
        status
      ) VALUES (
        :param0::int,
        :param1::int,
        :param2::int,
        :param3,
        :param4::numeric,
        :param5,
        'pending'
      ) RETURNING id;
    