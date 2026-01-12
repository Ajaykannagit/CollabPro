
      INSERT INTO saved_candidates (
        corporate_partner_id,
        student_profile_id,
        notes,
        interest_level
      ) VALUES (
        :param0::int,
        :param1::int,
        :param2,
        :param3
      )
      ON CONFLICT (corporate_partner_id, student_profile_id)
      DO UPDATE SET
        notes = :param4,
        interest_level = :param5;
    