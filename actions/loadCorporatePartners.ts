import { supabase } from '@/lib/supabase';

export default async function loadCorporatePartners(): Promise<any[]> {
  const { data, error } = await supabase
    .from('corporate_partners')
    .select('id, name, industry, location, website, company_size')
    .order('name');

  if (error) throw error;
  return data || [];
}
