

import { useState } from 'react';
import { useLoadAction, useMutateAction } from '@/lib/data-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import loadCollaborationRequestsAction from '@/actions/loadCollaborationRequests';
import loadResearchProjectsAction from '@/actions/loadResearchProjects';
import loadIndustryChallengesAction from '@/actions/loadIndustryChallenges';
import createResearchProjectAction from '@/actions/createResearchProject';
import { TrendingUp, Briefcase, Target, Users, ArrowRight, Sparkles, Activity, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Counter, ShinyButton } from '@/components/ui/animated-primitives';
import { useAppStore } from '@/lib/store';
import { CollaborationRequest, ResearchProject, IndustryChallenge } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { StaggerContainer, FadeInUp, SpringPress } from '@/components/ui/animation-wrapper';

type DashboardOverviewProps = {
  onNavigate?: (section: any) => void;
  onProjectSelect?: (projectId: number) => void;
};

export function DashboardOverview({ onNavigate, onProjectSelect }: DashboardOverviewProps) {
  const { toast } = useToast();
  const { metrics, chartData } = useAppStore((state) => state.testData);
  const [requests] = useLoadAction<CollaborationRequest[]>(loadCollaborationRequestsAction, [], { status: null });
  const [projects] = useLoadAction<ResearchProject[]>(loadResearchProjectsAction, [], { searchQuery: null });
  const [challenges] = useLoadAction<IndustryChallenge[]>(loadIndustryChallengesAction, [], { searchQuery: null });

  const [createProject, creatingProject] = useMutateAction(createResearchProjectAction);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    fundingAllocated: 500000
  });

  const safeRequests = requests || [];
  const safeProjects = projects || [];
  const safeChallenges = challenges || [];
  const recentActivity = safeProjects.slice(0, 5);

  const pendingRequests = safeRequests.filter((r: CollaborationRequest) => r.status === 'pending').length;

  const handleCreateProject = async () => {
    try {
      if (!newProject.title || !newProject.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const result = await createProject({
        title: newProject.title,
        description: newProject.description,
        collegeId: 1, // Hardcoded for demo/MVP - assuming current user's college
        fundingAllocated: newProject.fundingAllocated
      });

      toast({
        title: "Project Created",
        description: "Research initiative initiated successfully.",
      });

      setIsDialogOpen(false);
      setNewProject({ title: '', description: '', fundingAllocated: 500000 });

      // Navigate to the new project if we have an ID and handler
      // result is likely an array from the SQL action
      const createdId = Array.isArray(result) && result.length > 0 ? result[0].id : (result as any)?.id;

      if (createdId && onProjectSelect) {
        onProjectSelect(createdId);
      } else if (onNavigate) {
        onNavigate('projects');
      }

    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    }
  };

  // Map icons to the metrics from context
  const iconMap: Record<string, React.ElementType> = {
    'Active Projects': Briefcase,
    'Open Challenges': Target,
    'Pending Requests': Users,
    'Success Rate': TrendingUp,
  };

  const displayMetrics = metrics.map(m => ({
    ...m,
    icon: iconMap[m.title] || Briefcase,
    value: m.title === 'Active Projects' ? (safeProjects.length || m.value) :
      m.title === 'Open Challenges' ? (safeChallenges.length || m.value) :
        m.title === 'Pending Requests' ? (pendingRequests || m.value) :
          m.value
  }));

  const currentCount = safeProjects.length || 10;
  const historicChartData = chartData.map((d, i) => ({
    ...d,
    value: Math.max(1, Math.round(currentCount * (0.5 + (i / chartData.length))))
  }));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's your collaboration overview</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            onClick={() => toast({ title: "Filter applied", description: "Showing data for the last 30 days." })}
          >
            <Clock className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <ShinyButton onClick={() => setIsDialogOpen(true)}>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> New Project</span>
          </ShinyButton>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <FadeInUp key={idx}>
              <SpringPress className="h-full">
                <Card className="h-full border-slate-200 bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden relative border cursor-pointer" onClick={() => onNavigate && onNavigate(metric.title === 'Active Projects' ? 'projects' : metric.title === 'Open Challenges' ? 'challenges' : 'collaboration')}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-[0.03] group-hover:opacity-[0.1] rounded-bl-full transition-opacity`} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl ${metric.bg} flex items-center justify-center ring-1 ring-white/10`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        {metric.trend}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {typeof metric.value === 'number' ? <Counter value={metric.value} /> : metric.value}
                      </h3>
                      <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{metric.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </SpringPress>
            </FadeInUp>
          );
        })}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-8">
        <FadeInUp delay={0.3} className="lg:col-span-2">
          <Card className="h-full border-slate-200 bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Activity className="h-5 w-5 text-primary" />
                Engagement Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} cursor={{ stroke: 'rgba(0,0,0,0.05)' }} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.4} className="lg:col-span-1">
          <Card className="h-full border-slate-200 bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Briefcase className="h-5 w-5 text-secondary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="space-y-4">
                {recentActivity.map((project: ResearchProject, i: number) => (
                  <FadeInUp key={project.id || i}>
                    <SpringPress
                      className="group flex items-center justify-between p-3 rotate-0 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 cursor-pointer"
                      onClick={() => {
                        if (project.id && onProjectSelect) {
                          onProjectSelect(project.id);
                        } else if (onNavigate) {
                          onNavigate('projects');
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate group-hover:text-primary transition-colors">
                          {project.title || "New Research Initiative"}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight group-hover:text-slate-600">{project.college_name || "Partner College"}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-slate-100">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </SpringPress>
                  </FadeInUp>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-white/5 mt-2"
                  onClick={() => onNavigate && onNavigate('projects')}
                >
                  View All Activity
                </Button>
              </StaggerContainer>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Start New Research Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-slate-700 font-semibold">Project Title</Label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                placeholder="e.g., Nanotech Water Filtration"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700 font-semibold">Brief Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                placeholder="Describe the research goals..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="funding" className="text-slate-700 font-semibold">Initial Funding Request (INR)</Label>
              <Input
                id="funding"
                type="number"
                value={newProject.fundingAllocated}
                onChange={(e) => setNewProject({ ...newProject, fundingAllocated: parseInt(e.target.value) })}
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
          </div>
          <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 border-t border-slate-200">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50">Cancel</Button>
            <Button onClick={handleCreateProject} disabled={creatingProject} className="bg-primary hover:bg-primary/90 text-white">
              {creatingProject ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
