import { DUMMY_STUDENTS } from '@/lib/seedData';

export interface LoadStudentProfilesParams {
  searchQuery?: string | null;
  degreeLevel?: string | null;
}

/**
 * Loads student profiles from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadStudentProfiles(params?: LoadStudentProfilesParams) {
  const searchQuery = params?.searchQuery?.trim().toLowerCase() || '';
  const degreeLevel = params?.degreeLevel?.trim();

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...DUMMY_STUDENTS];

  if (searchQuery) {
    filtered = filtered.filter((sp: any) => sp.name?.toLowerCase().includes(searchQuery));
  }

  if (degreeLevel) {
    filtered = filtered.filter((sp: any) => sp.degree === degreeLevel);
  }

  return filtered.map((sp: any, i: number) => ({
    ...sp,
    id: sp.id || i + 1,
    College_name: sp.college || '',
    project_count: (sp.projects || []).length,
  }));
}

