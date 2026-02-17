import { supabase } from '@/lib/supabase';

export interface LoadLicensingOpportunitiesParams {
  industrySector?: string | null;
}

export default async function loadLicensingOpportunities(params?: LoadLicensingOpportunitiesParams) {
  const industrySector = params?.industrySector?.trim();

  const query = supabase
    .from('licensing_opportunities')
    .select(`
      id,
      anonymized_title,
      anonymized_description,
      licensing_type,
      asking_price,
      industry_sectors,
      inquiries_count,
      created_at,
      status,
      ip_disclosures (
        invention_category,
        status
      )
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load licensing opportunities: ${error.message}`);
  }

  let result = data || [];

  if (industrySector) {
    const sector = industrySector.toLowerCase();
    result = result.filter((lo: any) =>
      (lo.industry_sectors ?? '').toLowerCase().includes(sector)
    );
  }

  return result.map((lo: any) => ({
    id: lo.id,
    anonymized_title: lo.anonymized_title,
    anonymized_description: lo.anonymized_description ?? '',
    licensing_type: lo.licensing_type ?? '',
    asking_price: Number(lo.asking_price) || 0,
    industry_sectors: lo.industry_sectors ?? '',
    inquiries_count: lo.inquiries_count ?? 0,
    created_at: lo.created_at,
    invention_category: lo.ip_disclosures?.invention_category ?? '',
    ip_status: lo.ip_disclosures?.status ?? lo.status ?? 'available',
  }));
}

