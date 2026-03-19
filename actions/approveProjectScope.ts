'use server';

import { supabase } from '@/lib/supabase';

export default async function approveProjectScope({ scopeId, approvedBy }: { scopeId: number, approvedBy: string }) {
    const { data, error } = await supabase
        .from('project_scopes')
        .update({ status: 'approved' })
        .eq('id', scopeId)
        .select();

    if (error) {
        throw new Error(`Failed to approve scope: ${error.message}`);
    }

    // Fetch the scope to get the collaboration_request_id for the system message
    if (data && data.length > 0) {
        await supabase.from('negotiation_messages').insert([{
            collaboration_request_id: data[0].collaboration_request_id,
            sender_name: 'System',
            sender_organization: 'System',
            message_type: 'text', // Simple text for approval notification
            content: `Scope v${data[0].version_number} approved by ${approvedBy}. Project is ready to proceed.`,
            is_system_message: true
        }]);
    }

    return data;
}
