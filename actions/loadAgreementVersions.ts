import { supabase } from '@/lib/supabase';

export interface LoadAgreementVersionsParams {
  agreementId: number;
}

export default async function loadAgreementVersions(params: LoadAgreementVersionsParams): Promise<any[]> {
  const agreementId = params?.agreementId;
  if (!agreementId) return [];

  const { data, error } = await supabase
    .from('agreement_versions')
    .select('id, agreement_id, version_number, created_at, created_by, change_summary')
    .eq('agreement_id', agreementId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
