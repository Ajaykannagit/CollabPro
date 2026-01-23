// Platform analytics and reporting dashboard

import { useLoadAction } from '@uibakery/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import loadPlatformAnalyticsAction from '@/actions/loadPlatformAnalytics';
import { formatINRCompact, usdToINR } from '@/lib/currency';
import { BarChart3, TrendingUp, Users, Briefcase, DollarSign, Award, Target } from 'lucide-react';

export function AnalyticsDashboard() {
  const [analytics] = useLoadAction(loadPlatformAnalyticsAction, [], { category: null });

  const getMetric = (name: string) => {
    const metric = analytics.find((m: any) => m.metric_name === name);
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
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        </div>
        <p className="text-gray-600">Real-time insights and performance metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{metric.change}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Collaboration Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Expertise Areas</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
