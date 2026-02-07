// Secure project workspace with tabs for different aspects

import { useState } from 'react';
import { useLoadAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import loadProjectDetailsAction from '@/actions/loadProjectDetails';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StaggerContainer, FadeInUp, SpringPress, LayoutTransition } from '@/components/ui/animation-wrapper';
import { AnimatePresence } from 'framer-motion';

type Milestone = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  deliverables: string;
};

type TeamMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  organization: string;
};

type ProjectDetails = {
  id: number;
  project_name: string;
  description: string;
  funding_allocated: number;
  budget_utilized: number;
  start_date: string;
  end_date: string | null;
  status: string;
  milestones: Milestone[];
  team_members: TeamMember[];
};

export function ProjectWorkspace({ projectId = 1 }: { projectId?: number }) {
  const { toast } = useToast();
  const [selectedProjectId] = useState(projectId);
  const [isIPDialogOpen, setIsIPDialogOpen] = useState(false);
  const [project, loading] = useLoadAction(
    loadProjectDetailsAction,
    [] as ProjectDetails[],
    { projectId: selectedProjectId }
  );

  const projectData = project[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !projectData) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  const budgetPercent =
    (projectData.budget_utilized / projectData.funding_allocated) * 100;
  const milestones: Milestone[] = projectData.milestones || [];
  const teamMembers: TeamMember[] = projectData.team_members || [];
  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const milestonePercent = (completedMilestones / milestones.length) * 100;

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {projectData.project_name}
            </h1>
            <p className="text-gray-600">{projectData.description}</p>
          </div>
          <Badge className={getStatusColor(projectData.status)}>
            {projectData.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* KPI Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FadeInUp>
            <SpringPress>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">
                      {budgetPercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(projectData.budget_utilized)}
                  </p>
                  <p className="text-xs text-gray-600">
                    of {formatCurrency(projectData.funding_allocated)}
                  </p>
                  <Progress value={budgetPercent} className="mt-2" />
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>

          <FadeInUp>
            <SpringPress>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-600">
                      {milestonePercent.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedMilestones}/{milestones.length}
                  </p>
                  <p className="text-xs text-gray-600">Milestones Completed</p>
                  <Progress value={milestonePercent} className="mt-2" />
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>

          <FadeInUp>
            <SpringPress>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  <p className="text-xs text-gray-600">Team Members</p>
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>

          <FadeInUp>
            <SpringPress>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(projectData.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600">Started</p>
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>
        </StaggerContainer>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ip">IP Disclosures</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="overview" key="overview">
            <LayoutTransition>
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {projectData.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Start Date</span>
                          <span className="font-medium">
                            {new Date(projectData.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        {projectData.end_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">End Date</span>
                            <span className="font-medium">
                              {new Date(projectData.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Budget</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Allocated</span>
                          <span className="font-medium">
                            {formatCurrency(projectData.funding_allocated)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Utilized</span>
                          <span className="font-medium">
                            {formatCurrency(projectData.budget_utilized)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(
                              projectData.funding_allocated - projectData.budget_utilized
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LayoutTransition>
          </TabsContent>

          <TabsContent value="milestones" key="milestones">
            <LayoutTransition>
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerContainer className="space-y-4">
                    {milestones.map((milestone) => (
                      <FadeInUp
                        key={milestone.id}
                      >
                        <SpringPress className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="mt-1">
                                {milestone.status === 'completed' ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                                ) : (
                                  <Clock className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {milestone.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {milestone.description}
                                </p>
                                {milestone.deliverables && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Deliverables:
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {milestone.deliverables}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 ml-9">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Due: {new Date(milestone.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </SpringPress>
                      </FadeInUp>
                    ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </LayoutTransition>
          </TabsContent>

          <TabsContent value="team" key="team">
            <LayoutTransition>
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerContainer className="grid md:grid-cols-2 gap-4">
                    {teamMembers.map((member) => (
                      <FadeInUp
                        key={member.id}
                      >
                        <SpringPress className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-xs text-gray-500 mt-1">{member.organization}</p>
                              {member.email && (
                                <p className="text-xs text-blue-600 mt-1">{member.email}</p>
                              )}
                            </div>
                          </div>
                        </SpringPress>
                      </FadeInUp>
                    ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </LayoutTransition>
          </TabsContent>

          <TabsContent value="documents" key="documents">
            <LayoutTransition>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Documents</CardTitle>
                  <Button size="sm" onClick={() => toast({ title: "Upload", description: "Upload dialog coming soon..." })}>
                    <PlusIcon className="h-4 w-4 mr-2" /> Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  <StaggerContainer className="space-y-3">
                    {[
                      { name: 'Research_Proposal.pdf', size: '2.4 MB', type: 'PDF', date: '2024-01-15' },
                      { name: 'Budget_Overview.xlsx', size: '1.1 MB', type: 'Excel', date: '2024-01-18' },
                      { name: 'Lab_Safety_Protocol.docx', size: '850 KB', type: 'Word', date: '2024-01-20' },
                    ].map((doc, i) => (
                      <FadeInUp key={i}>
                        <SpringPress className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size} • Uploaded on {doc.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toast({ title: "Download", description: `Downloading ${doc.name}...` })}>
                            Download
                          </Button>
                        </SpringPress>
                      </FadeInUp>
                    ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </LayoutTransition>
          </TabsContent>

          <TabsContent value="ip" key="ip">
            <LayoutTransition>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>IP Disclosures</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsIPDialogOpen(true);
                    }}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" /> Submit Disclosure
                  </Button>
                </CardHeader>
                <CardContent>
                  <StaggerContainer className="space-y-4">
                    {[
                      { title: 'Novel Catalyst for Hydrogen Production', date: '2024-02-01', status: 'Under Review' },
                      { title: 'High-Efficiency Photovoltaic Cell Design', date: '2024-01-10', status: 'Patent Pending' }
                    ].map((ip, i) => (
                      <FadeInUp key={i}>
                        <SpringPress className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                          <div>
                            <h4 className="font-semibold text-gray-900">{ip.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">Submitted on {ip.date}</p>
                          </div>
                          <Badge variant={ip.status === 'Under Review' ? 'secondary' : 'outline'} className={ip.status === 'Patent Pending' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}>
                            {ip.status}
                          </Badge>
                        </SpringPress>
                      </FadeInUp>
                    ))}
                    <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50/20">
                      <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Document new inventions or software created during this project</p>
                    </div>
                  </StaggerContainer>
                </CardContent>
              </Card>
            </LayoutTransition>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <Dialog open={isIPDialogOpen} onOpenChange={setIsIPDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Submit IP Disclosure</DialogTitle>
            <DialogDescription>
              Document a new invention or software for project "{project?.[0]?.project_name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Invention Title</Label>
              <Input id="title" placeholder="e.g., Novel Battery Chemistry" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Brief Description</Label>
              <Textarea id="description" placeholder="Describe the core innovation..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIPDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsIPDialogOpen(false);
              toast({ title: "Success", description: "IP Disclosure submitted for legal review." });
            }}>Submit Disclosure</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Re-using local Plus icon
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

