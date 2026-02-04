
import { useLoadAction } from '@/lib/data-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import loadCollaborationRequestsAction from '@/actions/loadCollaborationRequests';
import loadResearchProjectsAction from '@/actions/loadResearchProjects';
import loadIndustryChallengesAction from '@/actions/loadIndustryChallenges';
import { TrendingUp, Briefcase, Target, Users, ArrowRight, Sparkles, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Counter, HoverCard, ShinyButton } from '@/components/ui/animated-primitives';
import { useTestData } from '@/contexts/TestDataContext';
import { CollaborationRequest, ResearchProject, IndustryChallenge } from '@/lib/types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardOverview() {
  const { metrics, chartData, recentActivity } = useTestData();
  const [requests] = useLoadAction<CollaborationRequest[]>(loadCollaborationRequestsAction, [], { status: null });
  const [projects] = useLoadAction<ResearchProject[]>(loadResearchProjectsAction, [], { searchQuery: null });
  const [challenges] = useLoadAction<IndustryChallenge[]>(loadIndustryChallengesAction, [], { searchQuery: null });

  const safeRequests = requests || [];
  const safeProjects = projects || [];
  const safeChallenges = challenges || [];

  const pendingRequests = safeRequests.filter((r: CollaborationRequest) => r.status === 'pending').length;

  // Map icons to the metrics from context
  const iconMap: Record<string, React.ComponentType<any>> = {
    'Active Projects': Briefcase,
    'Open Challenges': Target,
    'Pending Requests': Users,
    'Success Rate': TrendingUp,
  };

  const displayMetrics = metrics.map(m => ({
    ...m,
    icon: iconMap[m.title] || Briefcase,
    // Prefer real counts if available, else use test data value
    value: m.title === 'Active Projects' ? (safeProjects.length || m.value) :
      m.title === 'Open Challenges' ? (safeChallenges.length || m.value) :
        m.title === 'Pending Requests' ? (pendingRequests || m.value) :
          m.value
  }));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your collaboration overview</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10">
            <Clock className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <ShinyButton onClick={() => console.log("New Project")}>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> New Project</span>
          </ShinyButton>
        </div>
      </div>

      {/* Metrics Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {displayMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div key={idx} variants={item}>
              <HoverCard className="h-full">
                <Card className="h-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group overflow-hidden relative">
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
                      <h3 className="text-3xl font-bold text-white tracking-tight">
                        {typeof metric.value === 'number' ? <Counter value={metric.value} /> : metric.value}
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">{metric.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </HoverCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-primary" />
                Engagement Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#52525b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#52525b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                      itemStyle={{ color: '#e4e4e7' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="h-full border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Briefcase className="h-5 w-5 text-secondary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((project: any, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={project.id || i}
                    className="group flex items-center justify-between p-3 rotate-0 hover:scale-[1.02] bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-transparent hover:border-white/10 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-200 truncate group-hover:text-primary transition-colors">
                        {project.title || "New Research Initiative"}
                      </p>
                      <p className="text-xs text-gray-500 group-hover:text-gray-400">{project.college_name || "Partner College"}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                ))}
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 mt-2">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
