import { supabase } from '@/lib/supabase';

export default async function signAgreement(agreementId: number, signatoryName: string, role: 'college' | 'corporate') {
    const timestamp = new Date().toISOString();

    const updateData = role === 'college'
        ? { college_signed_at: timestamp, college_signatory: signatoryName }
        : { corporate_signed_at: timestamp, corporate_signatory: signatoryName };

    const { data, error } = await supabase
        .from('agreements')
        .update(updateData)
        .eq('id', agreementId)
        .select();

    if (error) {
        throw new Error(`Failed to sign agreement: ${error.message}`);
    }

    return data;
}
