
      INSERT INTO industry_challenges (
        corporate_partner_id,
        title,
        description,
        budget_min,
        budget_max,
        timeline_months,
        status
      ) VALUES (
        :param0::int,
        :param1,
        :param2,
        :param3::numeric,
        :param4::numeric,
        :param5::int,
        'open'
      ) RETURNING id;
    