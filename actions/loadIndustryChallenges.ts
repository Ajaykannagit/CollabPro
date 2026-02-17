import { supabase } from '@/lib/supabase';

export interface LoadIndustryChallengesParams {
  searchQuery?: string | null;
}

export default async function loadIndustryChallenges(params?: LoadIndustryChallengesParams): Promise<any[]> {
  const searchQuery = params?.searchQuery?.trim() || '';

  let query = supabase
    .from('industry_challenges')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  const { data: rows, error } = await query;

  if (error) throw error;

  return (rows || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    budget_min: r.budget_min == null ? 0 : Number(r.budget_min),
    budget_max: r.budget_max == null ? 0 : Number(r.budget_max),
    timeline_months: r.timeline_months ?? 0,
    status: r.status ?? 'open',
    company_name: r.company_name ?? '',
    industry: r.industry ?? '',
    company_location: r.company_location ?? '',
    required_expertise: [], // SUPABASE_FINAL has no industry_challenge_expertise; add later if needed
    created_at: r.created_at,
  }));
}
