import { action } from '@/lib/data-actions';

function loadCorporatePartners() {
  return action('loadCorporatePartners', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        id,
        name,
        industry,
        location,
        website,
        company_size
      FROM corporate_partners
      ORDER BY name ASC;
    `,
  });
}

export default loadCorporatePartners;
