import { action } from '@/lib/data-actions';

function loadSavedCandidates() {
  return action('loadSavedCandidates', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        sc.id as saved_id,
        sc.notes,
        sc.interest_level,
        sc.created_at as saved_at,
        sp.id,
        sp.name,
        sp.email,
        sp.degree_level,
        sp.field_of_study,
        sp.graduation_year,
        sp.gpa,
        sp.bio,
        u.name as College_name,
        ARRAY_AGG(DISTINCT ss.skill_name) FILTER (WHERE ss.skill_name IS NOT NULL) as skills
      FROM saved_candidates sc
      JOIN Pretablename_student_profiles sp ON sc.student_profile_id = sp.id
      JOIN Pretablename_Colleges u ON sp.College_id = u.id
      LEFT JOIN student_skills ss ON sp.id = ss.student_profile_id
      WHERE sc.corporate_partner_id = {{params.corporatePartnerId}}::int
      GROUP BY sc.id, sp.id, u.name
      ORDER BY sc.created_at DESC;
    `,
  });
}

export default loadSavedCandidates;
