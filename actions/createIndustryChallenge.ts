import { supabase } from '@/lib/supabase';

type CreateIndustryChallengeParams = {
  corporatePartnerId: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  timelineMonths: number;
};

export default async function createIndustryChallenge(params: CreateIndustryChallengeParams) {
  const { corporatePartnerId, title, description, budgetMin, budgetMax, timelineMonths } = params;

  const { data, error } = await supabase
    .from('industry_challenges')
    .insert([{
      corporate_partner_id: corporatePartnerId,
      title,
      description,
      budget_min: budgetMin,
      budget_max: budgetMax,
      timeline_months: timelineMonths,
      status: 'open',
    }])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create industry challenge: ${error.message}`);
  }

  return data;
}

