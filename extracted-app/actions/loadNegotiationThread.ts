import { action } from '@/lib/data-actions';

function loadNegotiationThread() {
  return action('loadNegotiationThread', 'SQL', {
    datasourceName: 'collabsync_pro_db',
    query: `
      SELECT 
        nt.id as thread_id,
        nt.collaboration_request_id,
        cr.project_brief,
        ARRAY_AGG(
          jsonb_build_object(
            'id', nm.id,
            'sender_name', nm.sender_name,
            'sender_organization', nm.sender_organization,
            'message_type', nm.message_type,
            'content', nm.content,
            'created_at', nm.created_at
          ) ORDER BY nm.created_at ASC
        ) FILTER (WHERE nm.id IS NOT NULL) as messages,
        (
          SELECT jsonb_build_object(
            'id', psv.id,
            'version_number', psv.version_number,
            'scope_description', psv.scope_description,
            'deliverables', psv.deliverables,
            'timeline', psv.timeline,
            'budget', psv.budget,
            'created_by', psv.created_by
          )
          FROM project_scope_versions psv
          WHERE psv.negotiation_thread_id = nt.id
          ORDER BY psv.version_number DESC
          LIMIT 1
        ) as current_scope
      FROM negotiation_threads nt
      JOIN Pretablename_collaboration_requests cr ON nt.collaboration_request_id = cr.id
      LEFT JOIN Pretablename_negotiation_messages nm ON nt.id = nm.negotiation_thread_id
      WHERE nt.collaboration_request_id = {{params.collaborationRequestId}}::int
      GROUP BY nt.id, cr.project_brief;
    `,
  });
}

export default loadNegotiationThread;
