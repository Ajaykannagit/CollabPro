import { action } from '@/lib/data-actions';

function loadChecklistItems() {
    return action('loadChecklistItems', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        id,
        agreement_id,
        item_label,
        item_key,
        is_checked,
        display_order
      FROM agreement_checklist_items
      WHERE agreement_id = {{params.agreementId}}::int
      ORDER BY display_order ASC;
    `,
    });
}

export default loadChecklistItems;
