'use server';

import { supabase } from '@/lib/supabase';

type InterviewRequestData = {
    studentProfileId: number;
    requesterName: string;
    requesterEmail: string;
    requesterOrganization: string;
    message?: string;
};

export default async function createInterviewRequest(requestData: InterviewRequestData) {
    const { data, error } = await supabase
        .from('interview_requests')
        .insert([{
            student_profile_id: requestData.studentProfileId,
            requester_name: requestData.requesterName,
            requester_email: requestData.requesterEmail,
            requester_organization: requestData.requesterOrganization,
            message: requestData.message || 'I would like to request an interview regarding your project portfolio.',
            status: 'pending'
        }])
        .select();

    if (error) {
        throw new Error(`Failed to request interview: ${error.message}`);
    }

    return data;
}
