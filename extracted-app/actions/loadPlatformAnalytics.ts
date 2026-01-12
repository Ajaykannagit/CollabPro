import { action } from '@uibakery/data';

function loadPlatformAnalytics() {
  return action('loadPlatformAnalytics', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        metric_name,
        metric_value,
        metric_category,
        time_period
      FROM platform_analytics
      WHERE 
        COALESCE({{params.category}}, '') = ''
        OR metric_category = {{params.category}}
      ORDER BY recorded_at DESC;
    `,
  });
}

export default loadPlatformAnalytics;
