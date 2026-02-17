import { supabase } from '@/lib/supabase';

export default async function loadExpertiseDistribution() {
  const { data: expertise, error } = await supabase
    .from('expertise_areas')
    .select('id, name');

  if (error) {
    throw new Error(`Failed to load expertise distribution: ${error.message}`);
  }

  const { data: projectLinks } = await supabase
    .from('research_project_expertise')
    .select('research_project_id, expertise_area_id');

  const { data: projects } = await supabase
    .from('research_projects')
    .select('id, funding_needed');

  const fundingByProject: Record<number, number> = {};
  (projects || []).forEach((p: any) => {
    fundingByProject[p.id] = Number(p.funding_needed) || 0;
  });

  const stats: Record<number, { project_count: number; total_funding: number }> = {};
  (projectLinks || []).forEach((link: any) => {
    const eid = link.expertise_area_id;
    if (!stats[eid]) {
      stats[eid] = { project_count: 0, total_funding: 0 };
    }
    stats[eid].project_count += 1;
    stats[eid].total_funding += fundingByProject[link.research_project_id] || 0;
  });

  return (expertise || []).map((ea: any) => ({
    expertise_area: ea.name,
    project_count: stats[ea.id]?.project_count || 0,
    collaboration_count: stats[ea.id]?.project_count || 0,
    total_funding: Math.round(stats[ea.id]?.total_funding || 0),
  }));
}

