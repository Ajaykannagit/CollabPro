import { supabase } from '@/lib/supabase';

export interface LoadIPDisclosuresParams {
  status?: string | null;
}

export default async function loadIPDisclosures(params?: LoadIPDisclosuresParams) {
  const status = params?.status?.trim();

  const query = supabase
    .from('ip_disclosures')
    .select(`
      id,
      title,
      description,
      invention_category,
      potential_applications,
      commercial_potential,
      status,
      filing_date,
      patent_number,
      created_at,
      research_projects (
        title
      ),
      ip_contributors (
        contributor_name,
        organization,
        ownership_percentage,
        role
      )
    `)
    .order('created_at', { ascending: false });

  const { data, error } = status
    ? await query.eq('status', status)
    : await query;

  if (error) {
    throw new Error(`Failed to load IP disclosures: ${error.message}`);
  }

  return (data || []).map((ip: any) => ({
    id: ip.id,
    title: ip.title,
    description: ip.description ?? '',
    invention_category: ip.invention_category ?? '',
    potential_applications: ip.potential_applications ?? '',
    commercial_potential: ip.commercial_potential ?? '',
    status: ip.status ?? 'disclosed',
    filing_date: ip.filing_date,
    patent_number: ip.patent_number ?? '',
    created_at: ip.created_at,
    project_name: ip.research_projects?.title ?? 'Unlinked Project',
    contributors: (ip.ip_contributors || []).map((c: any) => ({
      name: c.contributor_name,
      organization: c.organization,
      ownership_percentage: Number(c.ownership_percentage) || 0,
      role: c.role ?? '',
    })),
  }));
}

