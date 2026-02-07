import { action } from '@/lib/data-actions';

function createNegotiationMessage() {
  return action('createNegotiationMessage', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      INSERT INTO negotiation_messages (
        negotiation_thread_id,
        sender_name,
        sender_organization,
        message_type,
        content
      ) VALUES (
        {{params.threadId}}::int,
        {{params.senderName}},
        {{params.senderOrganization}},
        {{params.messageType}},
        {{params.content}}
      ) RETURNING id;
    `,
  });
}

export default createNegotiationMessage;
