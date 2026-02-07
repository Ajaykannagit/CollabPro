import { action } from '@/lib/data-actions';

function loadMonthlyTrends() {
    return action('loadMonthlyTrends', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        TO_CHAR(month, 'Mon YYYY') as month_label,
        EXTRACT(EPOCH FROM month) * 1000 as timestamp,
        total_requests,
        approved_requests,
        signed_agreements,
        ROUND(avg_budget::numeric, 0) as avg_budget
      FROM monthly_collaboration_trends
      ORDER BY month ASC;
    `,
    });
}

export default loadMonthlyTrends;
