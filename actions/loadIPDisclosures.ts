import { DUMMY_IP_DISCLOSURES } from '@/lib/seedData';

export interface LoadIPDisclosuresParams {
  status?: string;
  projectId?: number;
}

/**
 * Loads IP disclosures from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadIPDisclosures(params?: LoadIPDisclosuresParams) {
  const { status, projectId } = params || {};
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...DUMMY_IP_DISCLOSURES];

  if (status && status !== 'all') {
    filtered = filtered.filter(d => d.status === status);
  }

  if (projectId) {
    filtered = filtered.filter(d => d.active_project_id === projectId);
  }

  return filtered.map(ip => ({
    ...ip,
    id: ip.id || Math.floor(Math.random() * 10000),
  }));
}

