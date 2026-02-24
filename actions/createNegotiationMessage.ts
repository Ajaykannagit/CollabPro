import { supabase } from '@/lib/supabase';

type CreateNegotiationMessageParams = {
  collaborationRequestId: number;
  senderName: string;
  senderOrganization: string;
  messageType: string;
  content: string;
};

export default async function createNegotiationMessage(params: CreateNegotiationMessageParams) {
  const { collaborationRequestId, senderName, senderOrganization, messageType, content } = params;

  const { data, error } = await supabase
    .from('negotiation_messages')
    .insert([{
      collaboration_request_id: collaborationRequestId,
      sender_name: senderName,
      sender_organization: senderOrganization,
      message_type: messageType,
      content,
    }])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to send negotiation message: ${error.message}`);
  }

  return data;
}

