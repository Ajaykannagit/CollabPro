
      SELECT 
        sp.id,
        sp.name,
        sp.email,
        sp.degree_level,
        sp.field_of_study,
        sp.graduation_year,
        sp.gpa,
        sp.bio,
        sp.availability_status,
        u.name as university_name,
        ARRAY_AGG(DISTINCT ss.skill_name) FILTER (WHERE ss.skill_name IS NOT NULL) as skills,
        COUNT(DISTINCT spi.id) as project_count
      FROM student_profiles sp
      JOIN universities u ON sp.university_id = u.id
      LEFT JOIN student_skills ss ON sp.id = ss.student_profile_id
      LEFT JOIN student_project_involvement spi ON sp.id = spi.student_profile_id
      WHERE 
        (COALESCE(:param0, '') = '' OR sp.name ILIKE :param1)
        AND (COALESCE(:param2, '') = '' OR sp.degree_level = :param3)
      GROUP BY sp.id, u.name
      ORDER BY sp.gpa DESC;
    