import { action } from '@/lib/data-actions';

function loadAgreementVersions() {
  return action('loadAgreementVersions', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        av.id,
        av.agreement_id,
        av.version_number,
        av.created_at,
        av.created_by,
        av.change_summary
      FROM agreement_versions av
      WHERE av.agreement_id = {{params.agreementId}}::int
      ORDER BY av.created_at ASC;
    `,
  });
}

export default loadAgreementVersions;
