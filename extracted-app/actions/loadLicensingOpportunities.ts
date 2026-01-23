import { action } from '@uibakery/data';

function loadLicensingOpportunities() {
  return action('loadLicensingOpportunities', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        lo.id,
        lo.anonymized_title,
        lo.anonymized_description,
        lo.licensing_type,
        lo.asking_price,
        lo.industry_sectors,
        lo.inquiries_count,
        lo.created_at,
        ip.invention_category,
        ip.status as ip_status
      FROM licensing_opportunities lo
      JOIN ip_disclosures ip ON lo.ip_disclosure_id = ip.id
      WHERE 
        lo.visibility = 'public'
        AND (COALESCE({{params.industrySector}}, '') = '' OR lo.industry_sectors ILIKE {{ '%' + params.industrySector + '%' }})
      ORDER BY lo.created_at DESC;
    `,
  });
}

export default loadLicensingOpportunities;
