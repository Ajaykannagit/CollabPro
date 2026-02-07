import { action } from '@/lib/data-actions';

function loadExpertiseAreas() {
  return action('loadExpertiseAreas', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT id, name, description
      FROM expertise_areas
      ORDER BY name ASC;
    `,
  });
}

export default loadExpertiseAreas;
