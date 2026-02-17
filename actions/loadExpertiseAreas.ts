import { supabase } from '@/lib/supabase';

export default async function loadExpertiseAreas(): Promise<any[]> {
  const { data, error } = await supabase
    .from('expertise_areas')
    .select('id, name, description')
    .order('name');

  if (error) throw error;
  return data || [];
}
