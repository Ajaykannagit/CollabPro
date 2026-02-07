import { action } from '@/lib/data-actions';

function loadAgreementComments() {
    return action('loadAgreementComments', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        ac.id,
        ac.agreement_id,
        ac.section_id,
        ac.author,
        ac.comment_text,
        ac.created_at
      FROM agreement_comments ac
      WHERE ac.agreement_id = {{params.agreementId}}::int
      ORDER BY ac.created_at ASC;
    `,
    });
}

export default loadAgreementComments;
