import { DUMMY_COLLABORATIONS } from '@/lib/seedData';

export interface LoadCollaborationRequestsParams {
  status?: string | null;
}

/**
 * Loads collaboration requests from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadCollaborationRequests(params?: LoadCollaborationRequestsParams): Promise<any[]> {
  const status = params?.status?.trim();

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...DUMMY_COLLABORATIONS];

  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }

  return filtered.map(r => ({
    ...r,
    id: r.id || Math.floor(Math.random() * 10000),
  }));
}
