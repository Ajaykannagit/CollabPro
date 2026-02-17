import { supabase } from '@/lib/supabase';

export interface LoadMatchmakingScoresParams {
  minScore?: number;
}

export default async function loadMatchmakingScores(params?: LoadMatchmakingScoresParams) {
  const minScore = typeof params?.minScore === 'number' ? params.minScore : 0;

  const { data, error } = await supabase
    .from('matchmaking_scores')
    .select(`
      id,
      compatibility_score,
      reasoning,
      research_projects (
        id,
        title,
        description,
        trl_level,
        colleges (
          name
        )
      ),
      industry_challenges (
        id,
        title,
        description,
        corporate_partners (
          name
        )
      )
    `)
    .gte('compatibility_score', minScore)
    .order('compatibility_score', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Failed to load matchmaking scores: ${error.message}`);
  }

  return (data || []).map((row: any) => {
    const rp = row.research_projects;
    const ic = row.industry_challenges;
    return {
      id: row.id,
      compatibility_score: Number(row.compatibility_score) || 0,
      reasoning: row.reasoning ?? '',
      project_id: rp?.id,
      project_title: rp?.title ?? '',
      project_description: rp?.description ?? '',
      trl_level: rp?.trl_level ?? 0,
      College_name: rp?.colleges?.name ?? '',
      challenge_id: ic?.id,
      challenge_title: ic?.title ?? '',
      challenge_description: ic?.description ?? '',
      company_name: ic?.corporate_partners?.name ?? '',
      project_expertise: [], // can be filled later from expertise tables
      challenge_expertise: [],
    };
  });
}

