import { action } from '@/lib/data-actions';

function addAgreementComment() {
    return action('addAgreementComment', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      INSERT INTO agreement_comments (agreement_id, section_id, author, comment_text)
      VALUES (
        {{params.agreementId}}::int,
        {{params.sectionId}},
        {{params.author}},
        {{params.commentText}}
      )
      RETURNING id, agreement_id, section_id, author, comment_text, created_at;
    `,
    });
}

export default addAgreementComment;
