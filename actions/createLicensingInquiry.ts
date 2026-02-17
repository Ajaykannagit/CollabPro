
import { supabase } from '@/lib/supabase';

type LicensingInquiryData = {
    licensing_opportunity_id: number;
    inquirer_name: string;
    inquirer_email: string;
    inquirer_organization: string;
    message: string;
};

export default async function createLicensingInquiry(inquiryData: LicensingInquiryData) {
    const { data, error } = await supabase
        .from('licensing_inquiries')
        .insert([inquiryData])
        .select();

    if (error) {
        throw new Error(`Failed to express interest: ${error.message}`);
    }

    return data;
}
