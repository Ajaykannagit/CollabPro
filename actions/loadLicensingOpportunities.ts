import { DUMMY_LICENSING } from '@/lib/seedData';

export interface LoadLicensingOpportunitiesParams {
  industrySector?: string | null;
}

/**
 * Loads licensing opportunities from the dummy data set.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadLicensingOpportunities(params?: LoadLicensingOpportunitiesParams) {
  const industrySector = params?.industrySector?.trim().toLowerCase() || '';

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...DUMMY_LICENSING];

  if (industrySector) {
    filtered = filtered.filter((lo: any) =>
      (lo.industry_sectors ?? '').toLowerCase().includes(industrySector)
    );
  }

  return filtered.map((lo: any) => ({
    ...lo,
    id: lo.id || Math.floor(Math.random() * 10000),
    ip_status: lo.status || 'available',
  }));
}

