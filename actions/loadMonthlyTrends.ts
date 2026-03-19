import { supabase } from '@/lib/supabase';

export default async function loadMonthlyTrends() {
  const { data: requests, error } = await supabase
    .from('collaboration_requests')
    .select('id, status, budget_proposed, created_at');

  if (error) {
    throw new Error(`Failed to load monthly trends: ${error.message}`);
  }

  const byMonth: Record<string, { total_requests: number; approved_requests: number; signed_agreements: number; total_budget: number }> = {};

  (requests || []).forEach((cr: any) => {
    const created = cr.created_at ? new Date(cr.created_at) : new Date();
    const monthKey = `${created.getFullYear()}-${created.getMonth() + 1}-01`;
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = {
        total_requests: 0,
        approved_requests: 0,
        signed_agreements: 0,
        total_budget: 0,
      };
    }
    const bucket = byMonth[monthKey];
    bucket.total_requests += 1;
    if (cr.status === 'accepted' || cr.status === 'approved') {
      bucket.approved_requests += 1;
    }
    const budget = Number(cr.budget_proposed) || 0;
    bucket.total_budget += budget;
  });

  const months = Object.keys(byMonth)
    .map((k) => new Date(k))
    .sort((a, b) => a.getTime() - b.getTime());

  return months.map((d) => {
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-01`;
    const bucket = byMonth[key];
    const avg_budget = bucket.total_requests ? Math.round(bucket.total_budget / bucket.total_requests) : 0;
    return {
      month_label: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
      timestamp: d.getTime(),
      total_requests: bucket.total_requests,
      approved_requests: bucket.approved_requests,
      signed_agreements: bucket.signed_agreements,
      avg_budget,
    };
  });
}

