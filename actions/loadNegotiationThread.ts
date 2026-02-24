import { supabase } from '@/lib/supabase';

export interface LoadNegotiationThreadParams {
  collaborationRequestId: number;
}

export default async function loadNegotiationThread(params: LoadNegotiationThreadParams) {
  const collaborationRequestId = params?.collaborationRequestId;
  if (!collaborationRequestId) return null;

  const { data: request, error: crError } = await supabase
    .from('collaboration_requests')
    .select('id, project_brief')
    .eq('id', collaborationRequestId)
    .maybeSingle();

  if (crError) {
    throw new Error(`Failed to load collaboration request for negotiation: ${crError.message}`);
  }

  if (!request) {
    return null;
  }

  const { data: messages, error: msgError } = await supabase
    .from('negotiation_messages')
    .select('id, sender_name, sender_organization, message_type, content, created_at')
    .eq('collaboration_request_id', collaborationRequestId)
    .order('created_at', { ascending: true });

  if (msgError) {
    throw new Error(`Failed to load negotiation messages: ${msgError.message}`);
  }

  const { data: scopes, error: scopeError } = await supabase
    .from('project_scopes')
    .select('id, version_number, scope_description, deliverables, timeline, budget, created_by')
    .eq('collaboration_request_id', collaborationRequestId)
    .order('version_number', { ascending: false })
    .limit(1);

  if (scopeError) {
    throw new Error(`Failed to load project scopes: ${scopeError.message}`);
  }

  const current_scope = scopes && scopes.length > 0 ? scopes[0] : null;

  return {
    thread_id: collaborationRequestId,
    collaboration_request_id: collaborationRequestId,
    project_brief: request.project_brief,
    messages: messages || [],
    current_scope,
  };
}

