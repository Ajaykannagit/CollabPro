import { supabase } from '@/lib/supabase';

type SaveCandidateInterestParams = {
  corporatePartnerId: number;
  studentProfileId: number;
  notes: string;
  interestLevel: string;
};

export default async function saveCandidateInterest(params: SaveCandidateInterestParams) {
  const { corporatePartnerId, studentProfileId, notes, interestLevel } = params;

  const { error } = await supabase
    .from('saved_candidates')
    .upsert(
      {
        corporate_partner_id: corporatePartnerId,
        student_profile_id: studentProfileId,
        notes,
        interest_level: interestLevel,
      },
      {
        onConflict: 'corporate_partner_id,student_profile_id',
      }
    );

  if (error) {
    throw new Error(`Failed to save candidate interest: ${error.message}`);
  }

  return { success: true };
}

