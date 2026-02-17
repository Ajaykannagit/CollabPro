import { supabase } from '@/lib/supabase';

export interface LoadChecklistItemsParams {
  agreementId: number;
}

export default async function loadChecklistItems(params: LoadChecklistItemsParams): Promise<any[]> {
  const agreementId = params?.agreementId;
  if (!agreementId) return [];

  const { data, error } = await supabase
    .from('agreement_checklist_items')
    .select('id, agreement_id, item_label, item_key, is_checked, display_order')
    .eq('agreement_id', agreementId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}
