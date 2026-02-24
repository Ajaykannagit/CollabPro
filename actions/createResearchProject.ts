
import { supabase } from '@/lib/supabase';

type CreateResearchProjectParams = {
    title: string;
    description: string;
    collegeId: number;
    fundingAllocated: number;
};

export default async function createResearchProject(params: CreateResearchProjectParams) {
    const { title, description, collegeId, fundingAllocated } = params;

    const { data, error } = await supabase
        .from('research_projects')
        .insert([
            {
                title,
                description,
                college_id: collegeId,
                status: 'active',
                funding_allocated: fundingAllocated,
                budget_utilized: 0,
                start_date: new Date().toISOString().slice(0, 10),
            },
        ])
        .select('id')
        .single();

    if (error) {
        throw new Error(`Failed to create research project: ${error.message}`);
    }

    return data;
}

