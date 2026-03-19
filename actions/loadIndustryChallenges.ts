import { DUMMY_CHALLENGES } from '@/lib/seedData';

export interface LoadIndustryChallengesParams {
  searchQuery?: string | null;
}

/**
 * Loads industry challenges from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadIndustryChallenges(params?: LoadIndustryChallengesParams): Promise<any[]> {
  const searchQuery = params?.searchQuery?.trim().toLowerCase() || '';

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...DUMMY_CHALLENGES];

  if (searchQuery) {
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(searchQuery) || 
      c.description.toLowerCase().includes(searchQuery)
    );
  }

  return filtered.map(c => ({
    ...c,
    id: (c as any).id || Math.floor(Math.random() * 10000),
  }));
}
