import { action } from '@/lib/data-actions';

function createAgreementVersion() {
    return action('createAgreementVersion', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      WITH new_version AS (
        INSERT INTO agreement_versions (agreement_id, version_number, created_by, change_summary)
        VALUES (
          {{params.agreementId}}::int,
          {{params.versionNumber}},
          {{params.createdBy}},
          {{params.changeSummary}}
        )
        RETURNING id, agreement_id, version_number, created_at, created_by
      ),
      copied_sections AS (
        INSERT INTO agreement_sections (agreement_version_id, section_id, title, content, display_order)
        SELECT 
          nv.id,
          asec.section_id,
          asec.title,
          asec.content,
          asec.display_order
        FROM new_version nv
        CROSS JOIN agreement_sections asec
        WHERE asec.agreement_version_id = {{params.sourceVersionId}}::int
        RETURNING id
      )
      SELECT * FROM new_version;
    `,
    });
}

export default createAgreementVersion;
