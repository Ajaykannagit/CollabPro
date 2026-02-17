import { action } from '@/lib/data-actions';

function updateChecklistItem() {
    return action('updateChecklistItem', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      UPDATE agreement_checklist_items
      SET 
        is_checked = {{params.isChecked}}::boolean,
        updated_at = NOW()
      WHERE agreement_id = {{params.agreementId}}::int
        AND item_key = {{params.itemKey}}
      RETURNING *;
    `,
    });
}

export default updateChecklistItem;
