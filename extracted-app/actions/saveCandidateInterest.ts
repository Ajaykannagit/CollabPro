import { action } from '@/lib/data-actions';

function saveCandidateInterest() {
  return action('saveCandidateInterest', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      INSERT INTO saved_candidates (
        corporate_partner_id,
        student_profile_id,
        notes,
        interest_level
      ) VALUES (
        {{params.corporatePartnerId}}::int,
        {{params.studentProfileId}}::int,
        {{params.notes}},
        {{params.interestLevel}}
      )
      ON CONFLICT (corporate_partner_id, student_profile_id)
      DO UPDATE SET
        notes = {{params.notes}},
        interest_level = {{params.interestLevel}};
    `,
  });
}

export default saveCandidateInterest;
