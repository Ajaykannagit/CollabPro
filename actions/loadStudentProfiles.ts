import { supabase } from '@/lib/supabase';

export interface LoadStudentProfilesParams {
  searchQuery?: string | null;
  degreeLevel?: string | null;
}

export default async function loadStudentProfiles(params?: LoadStudentProfilesParams) {
  const searchQuery = params?.searchQuery?.trim();
  const degreeLevel = params?.degreeLevel?.trim();

  const { data: profiles, error } = await supabase
    .from('student_profiles')
    .select(`
      id,
      college_id,
      name,
      email,
      degree_level,
      field_of_study,
      graduation_year,
      gpa,
      bio,
      availability_status,
      colleges (
        name
      ),
      student_skills (
        skill_name
      ),
      student_project_involvement (
        id
      )
    `)
    .order('gpa', { ascending: false });

  if (error) {
    throw new Error(`Failed to load student profiles: ${error.message}`);
  }

  let result = profiles || [];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter((sp: any) => sp.name?.toLowerCase().includes(q));
  }

  if (degreeLevel) {
    result = result.filter((sp: any) => sp.degree_level === degreeLevel);
  }

  return result.map((sp: any) => ({
    id: sp.id,
    name: sp.name,
    email: sp.email,
    degree_level: sp.degree_level,
    field_of_study: sp.field_of_study,
    graduation_year: sp.graduation_year,
    gpa: sp.gpa,
    bio: sp.bio ?? '',
    availability_status: sp.availability_status ?? 'available',
    College_name: sp.colleges?.name ?? '',
    skills: (sp.student_skills || []).map((s: any) => s.skill_name),
    project_count: (sp.student_project_involvement || []).length,
  }));
}

