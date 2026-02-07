import { action } from '@/lib/data-actions';

function loadExpertiseDistribution() {
    return action('loadExpertiseDistribution', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        expertise_area,
        project_count,
        collaboration_count,
        ROUND(total_funding::numeric, 0) as total_funding
      FROM expertise_area_distribution
      ORDER BY project_count DESC;
    `,
    });
}

export default loadExpertiseDistribution;
