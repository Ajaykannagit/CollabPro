// Platform analytics and reporting dashboard

import { useLoadAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import loadPlatformAnalyticsAction from '@/actions/loadPlatformAnalytics';
import loadMonthlyTrendsAction from '@/actions/loadMonthlyTrends';
import loadExpertiseDistributionAction from '@/actions/loadExpertiseDistribution';
import { formatINRCompact, usdToINR } from '@/lib/currency';
import { BarChart3, TrendingUp, Users, Briefcase, DollarSign, Award, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SpringPress } from '@/components/ui/animation-wrapper';
import { Counter } from '@/components/ui/animated-primitives';

interface AnalyticsMetric {
  metric_name: string;
  metric_value: number;
}

interface MonthlyTrend {
  month_label: string;
  timestamp: number;
  total_requests: number;
  approved_requests: number;
  signed_agreements: number;
  avg_budget: number;
}

interface ExpertiseArea {
  expertise_area: string;
  project_count: number;
  collaboration_count: number;
  total_funding: number;
}

export function AnalyticsDashboard() {
  const [analytics] = useLoadAction<AnalyticsMetric[]>(loadPlatformAnalyticsAction, [], { category: null });
  const [monthlyTrends, loadingTrends] = useLoadAction<MonthlyTrend[]>(loadMonthlyTrendsAction, []);
  const [expertiseAreas, loadingExpertise] = useLoadAction<ExpertiseArea[]>(loadExpertiseDistributionAction, []);

  const getMetric = (name: string) => {
    const metric = analytics.find((m: AnalyticsMetric) => m.metric_name === name);
    return metric?.metric_value || 0;
  };

  const metrics = [
    {
      title: 'Total Collaborations',
      value: getMetric('total_collaborations'),
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-100',
      change: '+12%',
    },
    {
      title: 'Active Projects',
      value: getMetric('active_projects'),
      icon: Target,
      color: 'text-green-600 bg-green-100',
      change: '+8%',
    },
    {
      title: 'Avg Project Value',
      value: formatINRCompact(usdToINR(getMetric('avg_project_value'))),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100',
      change: '+15%',
    },
    {
      title: 'Success Rate',
      value: `${getMetric('success_rate')}%`,
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-100',
      change: '+2.4%',
    },
    {
      title: 'IP Disclosures',
      value: getMetric('total_ip_disclosures'),
      icon: Award,
      color: 'text-yellow-600 bg-yellow-100',
      change: '+22%',
    },
    {
      title: 'Student Placements',
      value: getMetric('student_placements'),
      icon: Users,
      color: 'text-pink-600 bg-pink-100',
      change: '+18%',
    },
  ];

  return (
    <div className="p-8 bg-slate-50/30 min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
        </div>
        <p className="text-slate-500 font-bold text-lg">Real-time insights and performance metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <SpringPress key={idx} className="h-full">
              <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer border relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color.split(' ')[1]} opacity-[0.03] group-hover:opacity-[0.1] rounded-bl-full transition-opacity`} />
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-14 w-14 rounded-2xl ${metric.color.replace('bg-', 'bg-opacity-20 bg-')} flex items-center justify-center shadow-inner`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-black text-green-600">{metric.change}</span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
                    {typeof metric.value === 'number' ? <Counter value={metric.value} /> : metric.value}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.title}</p>
                </CardContent>
              </Card>
            </SpringPress>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Monthly Collaboration Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-96 pt-8 pb-4 px-6">
            {loadingTrends ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            ) : monthlyTrends && monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month_label"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_requests"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Requests"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="approved_requests"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Approved"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="signed_agreements"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Signed"
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Top Expertise Areas</CardTitle>
          </CardHeader>
          <CardContent className="h-96 pt-8 pb-4 px-6">
            {loadingExpertise ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            ) : expertiseAreas && expertiseAreas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expertiseAreas} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    type="category"
                    dataKey="expertise_area"
                    width={150}
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Bar
                    dataKey="project_count"
                    fill="#3b82f6"
                    name="Projects"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="collaboration_count"
                    fill="#10b981"
                    name="Collaborations"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No expertise data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
