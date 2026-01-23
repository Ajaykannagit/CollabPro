// Project Workspace - manage active project

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Folder, Users, DollarSign, Calendar } from 'lucide-react';

export function ProjectWorkspace() {
  const project = {
    name: "Quantum Computing Optimization",
    status: "Active",
    progress: 65,
    budget: 750000,
    spent: 487500,
    team_size: 8,
    deadline: "2025-12-31",
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Project Workspace</h1>
        <p className="text-slate-400">Manage your active project</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <Badge>{project.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-100">{project.team_size}</p>
                  <p className="text-sm text-slate-400">Team Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-100">${(project.spent / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-slate-400">Budget Spent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Folder className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-100">{project.progress}%</p>
                  <p className="text-sm text-slate-400">Progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-100">{project.deadline}</p>
                  <p className="text-sm text-slate-400">Deadline</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Overall Progress</span>
                  <span className="text-sm font-semibold text-slate-100">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Budget Utilization</span>
                  <span className="text-sm font-semibold text-slate-100">
                    {Math.round((project.spent / project.budget) * 100)}%
                  </span>
                </div>
                <Progress value={(project.spent / project.budget) * 100} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button>Update Progress</Button>
              <Button variant="outline">View Milestones</Button>
              <Button variant="outline">Team</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
