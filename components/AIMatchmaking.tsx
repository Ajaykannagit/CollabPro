// AI-powered matchmaking view showing scored matches


import { useState } from 'react';
import { useLoadAction, useMutateAction } from '@/lib/data-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import loadMatchmakingScoresAction from '@/actions/loadMatchmakingScores';
import createCollaborationRequestAction from '@/actions/createCollaborationRequest';
import { Sparkles, TrendingUp, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type MatchmakingScore = {
  id: number;
  compatibility_score: number;
  reasoning: string;
  project_id: number;
  project_title: string;
  project_description: string;
  trl_level: number;
  College_name: string;
  challenge_id: number;
  challenge_title: string;
  challenge_description: string;
  company_name: string;
  project_expertise: string[];
  challenge_expertise: string[];
  strategic_fit: string;
  technical_overlap: string[];
  alignment_pillars: {
    technical: number;
    trl: number;
    strategic: number;
    resource: number;
  };
};

export function AIMatchmaking() {
  const { toast } = useToast();
  const [minScore, setMinScore] = useState(70);
  const [matches, loading, error] = useLoadAction(
    loadMatchmakingScoresAction,
    [],
    { minScore }
  );

  const [initiateCollaboration, initiating] = useMutateAction(createCollaborationRequestAction);

  const handleInitiateCollaboration = async (match: MatchmakingScore) => {
    try {
      await initiateCollaboration({
        corporatePartnerId: 1, // Hardcoded for demo - usually from session
        researchProjectId: match.project_id,
        industryChallengeId: match.challenge_id,
        projectBrief: match.reasoning, // Use AI reasoning as initial brief
        budgetProposed: 1000000, // Default placeholder
        timelineProposed: '6 months' // Default placeholder
      });

      toast({
        title: "Collaboration Initiated",
        description: `Request sent to ${match.College_name} for ${match.project_title}`,
      });
    } catch (err: any) {
      toast({
        title: "Initiation Failed",
        description: err.message || "Failed to send collaboration request",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-8">
      {/* ... (Header and Score Filter remain unchanged) ... */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Matchmaking</h1>
        </div>
        <p className="text-gray-600">
          Intelligent matching between research projects and industry challenges
        </p>
      </div>

      {/* Score Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                Minimum Compatibility Score: {minScore}%
              </Label>
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
              <p className="text-sm text-gray-600">Matches Found</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matches List */}
      {loading && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Analyzing matches...</p>
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {matches.map((match: MatchmakingScore) => (
            <Card key={match.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(match.compatibility_score)}`}
                    >
                      {match.compatibility_score}%
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Compatibility Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={match.compatibility_score} className="w-32" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="text-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Matched
                    </Badge>
                    <Badge variant="outline" className={`font-bold ${match.strategic_fit === 'Transformative' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                      match.strategic_fit === 'Experimental' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                        'border-blue-500 text-blue-700 bg-blue-50'
                      }`}>
                      {match.strategic_fit} Synergy
                    </Badge>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            AI Reasoning
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {match.reasoning}
                          </p>
                        </div>
                      </div>
                      {match.technical_overlap && match.technical_overlap.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-2">Core Synergies</p>
                          <div className="flex flex-wrap gap-1">
                            {match.technical_overlap.map((skill, i) => (
                              <Badge key={i} className="bg-purple-600/10 text-purple-700 border-none text-[10px] h-5">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-64 border-l pl-6 border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Strategic Alignment</p>
                      <div className="space-y-3">
                        {[
                          { label: 'Technical Overlap', value: match.alignment_pillars.technical, color: 'bg-blue-500' },
                          { label: 'TRL Synergy', value: match.alignment_pillars.trl, color: 'bg-emerald-500' },
                          { label: 'Strategic Fit', value: match.alignment_pillars.strategic, color: 'bg-purple-500' },
                          { label: 'Resource Resilience', value: match.alignment_pillars.resource, color: 'bg-amber-500' },
                        ].map((pillar) => (
                          <div key={pillar.label} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-tight text-slate-600">
                              <span>{pillar.label}</span>
                              <span>{Math.round(pillar.value)}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${pillar.color} transition-all duration-1000`}
                                style={{ width: `${pillar.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Research Project */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-blue-600 rounded" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        Research Project
                      </h3>
                    </div>
                    <div className="pl-4 space-y-2">
                      <h4 className="font-semibold text-blue-900">{match.project_title}</h4>
                      <p className="text-sm text-gray-700">{match.College_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {match.project_description}
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-600">TRL {match.trl_level}/9</span>
                      </div>
                      {match.project_expertise && match.project_expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {match.project_expertise.slice(0, 3).map((exp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Industry Challenge */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-green-600 rounded" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        Industry Challenge
                      </h3>
                    </div>
                    <div className="pl-4 space-y-2">
                      <h4 className="font-semibold text-green-900">
                        {match.challenge_title}
                      </h4>
                      <p className="text-sm text-gray-700">{match.company_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {match.challenge_description}
                      </p>
                      {match.challenge_expertise && match.challenge_expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {match.challenge_expertise.slice(0, 3).map((exp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleInitiateCollaboration(match)}
                    disabled={initiating}
                  >
                    {initiating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    {initiating ? 'Initiating...' : 'Initiate Collaboration'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Viewing Match Details",
                        description: "Opening detailed match analysis...",
                      });
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600">
              Try adjusting the minimum compatibility score
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


