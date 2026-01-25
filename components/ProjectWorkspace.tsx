import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Folder, Users, DollarSign, Calendar, Sliders } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ProjectWorkspace() {
  const { toast } = useToast();
  const [progress, setProgress] = useState(65);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const project = {
    name: "Quantum Computing Optimization",
    status: "Active",
    budget: 750000,
    spent: 487500,
    team_size: 8,
    deadline: "2025-12-31",
  };

  const handleUpdate = () => {
    toast({
      title: "Progress Updated",
      description: `Project progress has been updated to ${progress}%.`,
    });
    setShowUpdateModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Project Workspace</h1>
        <p className="text-slate-400">Manage your active collaboration and track milestones</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">{project.name}</CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20">{project.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{project.team_size}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">Team Size</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">₹{(project.spent / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">Spent</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Folder className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{progress}%</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">Progress</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="h-12 w-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Dec 2025</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">Deadline</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-400">Project Completion</span>
                  <span className="text-sm font-bold text-white">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-400">Budget Utilization</span>
                  <span className="text-sm font-bold text-white">
                    {Math.round((project.spent / project.budget) * 100)}%
                  </span>
                </div>
                <Progress value={(project.spent / project.budget) * 100} className="h-2 bg-white/5" />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-white/5">
              <Button onClick={() => setShowUpdateModal(true)} className="bg-primary hover:bg-primary/90">
                Update Progress
              </Button>
              <Button variant="outline" onClick={() => toast({ title: "Milestones", description: "View detailed project timeline." })} className="border-white/10 hover:bg-white/5">
                View Milestones
              </Button>
              <Button variant="outline" onClick={() => toast({ title: "Team Management", description: "Roster and permission settings." })} className="border-white/10 hover:bg-white/5">
                Manage Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="bg-[#0a0a0c] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              Update Project Progress
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Progress</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleUpdate} className="flex-1 bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowUpdateModal(false)} className="border-white/10 hover:bg-white/5 text-slate-400">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
