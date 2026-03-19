import { DUMMY_PROJECTS } from '@/lib/seedData';

export interface LoadResearchProjectsParams {
  searchQuery?: string | null;
}

/**
 * Loads research projects from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadResearchProjects(params?: LoadResearchProjectsParams): Promise<any[]> {
  const searchQuery = params?.searchQuery?.trim().toLowerCase() || '';

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...DUMMY_PROJECTS];

  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  return filtered.map(p => ({
    ...p,
    id: (p as any).id || Math.floor(Math.random() * 10000),
    College_name: p.college_name,
    College_location: p.college_location,
  }));
}
