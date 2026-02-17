import { supabase } from '@/lib/supabase';

export interface LoadPlatformAnalyticsParams {
  category?: string | null;
}

export default async function loadPlatformAnalytics(params?: LoadPlatformAnalyticsParams) {
  const { data: projects } = await supabase
    .from('research_projects')
    .select('id, status');

  const { data: challenges } = await supabase
    .from('industry_challenges')
    .select('id, status');

  const { data: requests } = await supabase
    .from('collaboration_requests')
    .select('id, status');

  const { data: agreements } = await supabase
    .from('agreements')
    .select('id, status');

  const metrics = [
    {
      metric_name: 'Active Research Projects',
      metric_value: (projects || []).filter((p: any) => p.status === 'active').length,
      metric_category: 'projects',
      time_period: 'all-time',
    },
    {
      metric_name: 'Open Industry Challenges',
      metric_value: (challenges || []).filter((c: any) => c.status === 'open').length,
      metric_category: 'challenges',
      time_period: 'all-time',
    },
    {
      metric_name: 'Collaboration Requests',
      metric_value: (requests || []).length,
      metric_category: 'requests',
      time_period: 'all-time',
    },
    {
      metric_name: 'Signed Agreements',
      metric_value: (agreements || []).filter((a: any) => a.status === 'signed').length,
      metric_category: 'agreements',
      time_period: 'all-time',
    },
  ];

  const category = params?.category?.trim();
  if (category) {
    return metrics.filter((m) => m.metric_category === category);
  }
  return metrics;
}

