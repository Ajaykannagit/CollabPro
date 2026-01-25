// AI-powered matchmaking - simplified working version

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
import { useProjects, useChallenges } from '@/hooks/useDatabase';

export function AIMatchmaking() {
  const [minScore, setMinScore] = useState(70);
  const { data: projects } = useProjects();
  const { data: challenges } = useChallenges();

  // Calculate match scores based on expertise overlap
  const matches = useMemo(() => {
    if (!projects || !challenges) return [];

    const matchList: any[] = [];
    projects.forEach(project => {
      challenges.forEach(challenge => {
        const projectExp = new Set(project.expertise_areas || []);
        const challengeExp = new Set(challenge.required_expertise || []);
        const overlap = [...projectExp].filter(x => challengeExp.has(x)).length;
        const total = new Set([...projectExp, ...challengeExp]).size;
        const score = total > 0 ? Math.round((overlap / total) * 100) : 0;

        if (score >= minScore) {
          matchList.push({
            id: `${project.id}-${challenge.id}`,
            compatibility_score: score,
            reasoning: `${overlap} matching expertise areas out of ${total} total areas`,
            project_title: project.title,
            project_description: project.description,
            college_name: project.college_name,
            trl_level: project.trl_level,
            project_expertise: project.expertise_areas,
            challenge_title: challenge.title,
            challenge_description: challenge.description,
            company_name: challenge.company_name,
            challenge_expertise: challenge.required_expertise,
          });
        }
      });
    });

    return matchList.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }, [projects, challenges, minScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-100">AI-Powered Matchmaking</h1>
        </div>
        <p className="text-slate-400">
          Intelligent matching between research projects and industry challenges
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block text-slate-200">
                Minimum Compatibility Score: {minScore}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{matches.length}</p>
              <p className="text-sm text-slate-400">Matches Found</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {matches.map((match: any) => (
          <Card key={match.id} className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(match.compatibility_score)}`}>
                    {match.compatibility_score}%
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Compatibility Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={match.compatibility_score} className="w-32" />
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Matched
                </Badge>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">AI Reasoning</p>
                    <p className="text-sm text-gray-700">{match.reasoning}</p>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-blue-600 rounded" />
                    <h3 className="font-semibold text-lg text-slate-100">Research Project</h3>
                  </div>
                  <div className="pl-4 space-y-2">
                    <h4 className="font-semibold text-blue-400">{match.project_title}</h4>
                    <p className="text-sm text-slate-300">{match.college_name}</p>
                    <p className="text-sm text-slate-400 line-clamp-3">{match.project_description}</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-slate-500" />
                      <span className="text-sm text-slate-400">TRL {match.trl_level}/9</span>
                    </div>
                    {match.project_expertise && match.project_expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {match.project_expertise.slice(0, 3).map((exp: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{exp}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-green-600 rounded" />
                    <h3 className="font-semibold text-lg text-slate-100">Industry Challenge</h3>
                  </div>
                  <div className="pl-4 space-y-2">
                    <h4 className="font-semibold text-green-400">{match.challenge_title}</h4>
                    <p className="text-sm text-slate-300">{match.company_name}</p>
                    <p className="text-sm text-slate-400 line-clamp-3">{match.challenge_description}</p>
                    {match.challenge_expertise && match.challenge_expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {match.challenge_expertise.slice(0, 3).map((exp: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{exp}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t flex gap-3">
                <Button className="flex-1">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Initiate Collaboration
                </Button>
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">No matches found</h3>
            <p className="text-slate-400">Try adjusting the minimum compatibility score</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
