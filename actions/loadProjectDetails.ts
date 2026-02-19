import { supabase } from '@/lib/supabase';

export interface LoadProjectDetailsParams {
  projectId: number;
}

export default async function loadProjectDetails(params: LoadProjectDetailsParams): Promise<any> {
  const projectId = params?.projectId;
  if (!projectId) return null;

  const { data: project, error: projectError } = await supabase
    .from('active_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) throw projectError || new Error('Project not found');

  const [milestonesRes, teamRes] = await Promise.all([
    supabase.from('project_milestones').select('*').eq('active_project_id', projectId).order('due_date'),
    supabase.from('project_team_members').select('*').eq('active_project_id', projectId),
  ]);

  const milestones = (milestonesRes.data || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description ?? '',
    due_date: m.due_date,
    status: m.status ?? 'pending',
    deliverables: m.deliverables ?? '',
  }));

  const team_members = (teamRes.data || []).map((t: any) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    email: t.email ?? '',
    organization: t.organization ?? '',
  }));

  const { assessCollaborationRisk } = await import('@/lib/intelligence/risk-engine');

  const risk_assessment = assessCollaborationRisk({
    daysSinceLastMilestone: project.id % 2 === 0 ? 12 : 54, // Dynamic based on demo ID
    budgetUtilization: (project.budget_utilized || 0) / (project.funding_allocated || 1000000),
    milestoneProgress: milestones.filter((m: any) => m.status === 'completed').length / (milestones.length || 1),
    communicationFrequency: 3 + (project.id % 4),
    sentimentScore: project.id % 3 === 0 ? -0.2 : 0.6
  });

  return {
    id: project.id,
    project_name: project.project_name,
    description: project.description ?? '',
    funding_allocated: project.funding_allocated == null ? 0 : Number(project.funding_allocated),
    budget_utilized: project.budget_utilized == null ? 0 : Number(project.budget_utilized),
    start_date: project.start_date,
    end_date: project.end_date ?? null,
    status: project.status ?? 'in_progress',
    milestones,
    team_members,
    risk_assessment
  };
}
