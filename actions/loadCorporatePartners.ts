import { DUMMY_CORPORATES } from '@/lib/seedData';

/**
 * Loads corporate partners from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadCorporatePartners(): Promise<any[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return DUMMY_CORPORATES.map((c, i) => ({
    ...c,
    id: (c as any).id || i + 1,
  }));
}
