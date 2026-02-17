'use server';

import { supabase } from '@/lib/supabase';

type CreateScopeData = {
    collaborationRequestId: number;
    versionNumber: number;
    scopeDescription: string;
    deliverables: string;
    timeline: string;
    budget: number;
    createdBy: string;
};

export default async function createProjectScope(scopeData: CreateScopeData) {
    const { data, error } = await supabase
        .from('project_scopes')
        .insert([{
            collaboration_request_id: scopeData.collaborationRequestId,
            version_number: scopeData.versionNumber,
            scope_description: scopeData.scopeDescription,
            deliverables: scopeData.deliverables,
            timeline: scopeData.timeline,
            budget: scopeData.budget,
            created_by: scopeData.createdBy,
            status: 'proposed'
        }])
        .select();

    if (error) {
        throw new Error(`Failed to create project scope: ${error.message}`);
    }

    // Also create a system message in the thread
    await supabase.from('negotiation_messages').insert([{
        collaboration_request_id: scopeData.collaborationRequestId,
        sender_name: 'System',
        sender_organization: 'System',
        message_type: 'proposal',
        content: `New Scope Proposal (v${scopeData.versionNumber}) created by ${scopeData.createdBy}.`,
        is_system_message: true
    }]);

    return data;
}
