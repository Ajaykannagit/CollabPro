import { supabase } from '@/lib/supabase';

export interface LoadSavedCandidatesParams {
  corporatePartnerId: number;
}

export default async function loadSavedCandidates(params: LoadSavedCandidatesParams) {
  const corporatePartnerId = params?.corporatePartnerId;
  if (!corporatePartnerId) return [];

  const { data, error } = await supabase
    .from('saved_candidates')
    .select(`
      id,
      notes,
      interest_level,
      created_at,
      student_profiles (
        id,
        name,
        email,
        degree_level,
        field_of_study,
        graduation_year,
        gpa,
        bio,
        colleges (
          name
        ),
        student_skills (
          skill_name
        )
      )
    `)
    .eq('corporate_partner_id', corporatePartnerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load saved candidates: ${error.message}`);
  }

  return (data || []).map((row: any) => {
    const sp = row.student_profiles;
    return {
      saved_id: row.id,
      notes: row.notes ?? '',
      interest_level: row.interest_level ?? 'medium',
      saved_at: row.created_at,
      id: sp?.id,
      name: sp?.name,
      email: sp?.email,
      degree_level: sp?.degree_level,
      field_of_study: sp?.field_of_study,
      graduation_year: sp?.graduation_year,
      gpa: sp?.gpa,
      bio: sp?.bio ?? '',
      College_name: sp?.colleges?.name ?? '',
      skills: (sp?.student_skills || []).map((s: any) => s.skill_name),
    };
  });
}

