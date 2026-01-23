// Secure project workspace with tabs for different aspects

import { useState } from 'react';
import { useLoadAction } from '@uibakery/data';
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

export function ProjectWorkspace() {
  const [selectedProjectId] = useState(1);
  const [project, loading] = useLoadAction(
    loadProjectDetailsAction,
    [],
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              <p className="text-xs text-gray-600">Team Members</p>
            </CardContent>
          </Card>

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
        </div>
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

        <TabsContent value="overview">
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
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Document management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip">
          <Card>
            <CardHeader>
              <CardTitle>IP Disclosures</CardTitle>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">IP disclosure tracking for this project...</p>
              <Button className="mt-4">Submit IP Disclosure</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
