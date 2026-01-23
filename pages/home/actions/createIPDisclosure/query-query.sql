
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
        {{params.activeProjectId}}::int,
        {{params.title}},
        {{params.description}},
        {{params.inventionCategory}},
        {{params.potentialApplications}},
        {{params.priorArtReferences}},
        {{params.commercialPotential}},
        'disclosed'
      ) RETURNING id;
    