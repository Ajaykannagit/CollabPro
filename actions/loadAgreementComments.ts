import { supabase } from '@/lib/supabase';

export interface LoadAgreementCommentsParams {
  agreementId: number;
}

export default async function loadAgreementComments(params: LoadAgreementCommentsParams): Promise<any[]> {
  const agreementId = params?.agreementId;
  if (!agreementId) return [];

  const { data, error } = await supabase
    .from('agreement_comments')
    .select('id, agreement_id, section_id, author, comment_text, created_at')
    .eq('agreement_id', agreementId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((r: any) => ({
    ...r,
    comment_text: r.comment_text,
    timestamp: r.created_at,
  }));
}
