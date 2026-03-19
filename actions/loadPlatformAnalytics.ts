export interface LoadPlatformAnalyticsParams {
  category?: string | null;
}

/**
 * Loads platform analytics from hardcoded dummy data.
 * Reverted to dummy data to bypass Supabase fetch errors.
 */
export default async function loadPlatformAnalytics(params?: LoadPlatformAnalyticsParams) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const metrics = [
    {
      metric_name: 'Active Research Projects',
      metric_value: 24,
      metric_category: 'projects',
      time_period: 'all-time',
    },
    {
      metric_name: 'Open Industry Challenges',
      metric_value: 12,
      metric_category: 'challenges',
      time_period: 'all-time',
    },
    {
      metric_name: 'Collaboration Requests',
      metric_value: 156,
      metric_category: 'requests',
      time_period: 'all-time',
    },
    {
      metric_name: 'Signed Agreements',
      metric_value: 42,
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

