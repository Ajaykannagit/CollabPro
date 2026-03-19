import { supabase } from '@/lib/supabase';

export default async function loadAgreementTemplates(): Promise<any[]> {
  const { data, error } = await supabase
    .from('agreement_templates')
    .select('id, name, description, agreement_type, ip_ownership_split, revenue_sharing_model, confidentiality_terms, termination_clauses, compliance_requirements')
    .order('name');

  if (error) throw error;
  return data || [];
}
