
      INSERT INTO industry_challenges (
        corporate_partner_id,
        title,
        description,
        budget_min,
        budget_max,
        timeline_months,
        status
      ) VALUES (
        {{params.corporatePartnerId}}::int,
        {{params.title}},
        {{params.description}},
        {{params.budgetMin}}::numeric,
        {{params.budgetMax}}::numeric,
        {{params.timelineMonths}}::int,
        'open'
      ) RETURNING id;
    