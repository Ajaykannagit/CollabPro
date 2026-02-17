
import { supabase } from '@/lib/supabase';

export default async function approveAgreement({ agreementId, role }: { agreementId: number, role: 'college' | 'corporate' }) {
    const updateData = role === 'college'
        ? { college_approval_status: true }
        : { corporate_approval_status: true };

    const { data, error } = await supabase
        .from('agreements')
        .update(updateData)
        .eq('id', agreementId)
        .select();

    if (error) {
        throw new Error(`Failed to grant approval: ${error.message}`);
    }

    return data;
}
