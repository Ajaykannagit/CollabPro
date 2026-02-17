import { supabase } from '@/lib/supabase';

export interface LoadAgreementSectionsParams {
  versionId: number;
}

export default async function loadAgreementSections(params: LoadAgreementSectionsParams): Promise<any[]> {
  const versionId = params?.versionId;
  if (!versionId) return [];

  const { data, error } = await supabase
    .from('agreement_sections')
    .select('id, agreement_version_id, section_id, title, content, display_order')
    .eq('agreement_version_id', versionId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}
