import { action } from '@/lib/data-actions';

function loadAgreementSections() {
    return action('loadAgreementSections', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        asec.id,
        asec.agreement_version_id,
        asec.section_id,
        asec.title,
        asec.content,
        asec.display_order
      FROM agreement_sections asec
      WHERE asec.agreement_version_id = {{params.versionId}}::int
      ORDER BY asec.display_order ASC;
    `,
    });
}

export default loadAgreementSections;
