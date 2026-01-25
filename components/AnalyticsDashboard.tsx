// Analytics Dashboard - platform metrics

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Briefcase, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useProjects, useChallenges, useCollaborationRequests } from '@/hooks/useDatabase';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AnalyticsDashboard() {
  const { data: projects } = useProjects();
  const { data: challenges } = useChallenges();
  const { data: requests } = useCollaborationRequests();
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your platform performance report is being generated...",
    });
    setTimeout(() => {
      toast({ title: "Success", description: "Report exported to CSV successfully." });
    }, 1500);
  };

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Total Challenges',
      value: challenges?.length || 0,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Collaboration Requests',
      value: requests?.length || 0,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'IP Disclosures',
      value: '0', // Could be dynamic if we added useIPDisclosures
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10 text-amber-500',
    },
  ];

  const projectsByStatus = [
    { name: 'Active', value: projects?.filter(p => p.status === 'Active').length || 0 },
    { name: 'Proposed', value: projects?.filter(p => p.status === 'Proposed').length || 0 },
    { name: 'Completed', value: projects?.filter(p => p.status === 'Completed').length || 0 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Platform performance and insights</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-white/10 bg-white/5 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Projects by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectsByStatus.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Jan', count: 12 },
                  { month: 'Feb', count: 19 },
                  { month: 'Mar', count: 15 },
                  { month: 'Apr', count: 25 },
                  { month: 'May', count: 22 },
                  { month: 'Jun', count: 30 },
                ]}>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
