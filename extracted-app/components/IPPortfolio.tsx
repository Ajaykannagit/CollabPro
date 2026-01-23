// IP portfolio management dashboard

import { useState } from 'react';
import { useLoadAction } from '@uibakery/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import loadIPDisclosuresAction from '@/actions/loadIPDisclosures';
import { Lightbulb, FileText, Users, DollarSign } from 'lucide-react';

type IPDisclosure = {
  id: number;
  title: string;
  description: string;
  invention_category: string;
  potential_applications: string;
  commercial_potential: string;
  status: string;
  filing_date: string;
  patent_number: string;
  project_name: string;
  contributors: Array<{
    name: string;
    organization: string;
    ownership_percentage: number;
    role: string;
  }>;
  created_at: string;
};

export function IPPortfolio() {
  const [statusFilter, setStatusFilter] = useState('');
  const [disclosures, loading, error] = useLoadAction(
    loadIPDisclosuresAction,
    [],
    { status: statusFilter || null }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disclosed':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'patent_pending':
        return 'bg-purple-100 text-purple-800';
      case 'patented':
        return 'bg-green-100 text-green-800';
      case 'licensed':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    total: disclosures.length,
    disclosed: disclosures.filter((d: IPDisclosure) => d.status === 'disclosed').length,
    under_review: disclosures.filter((d: IPDisclosure) => d.status === 'under_review').length,
    patent_pending: disclosures.filter((d: IPDisclosure) => d.status === 'patent_pending')
      .length,
    patented: disclosures.filter((d: IPDisclosure) => d.status === 'patented').length,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">IP Portfolio</h1>
        </div>
        <p className="text-gray-600">
          Manage intellectual property and commercialization opportunities
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{statusCounts.total}</p>
            <p className="text-xs text-gray-600 mt-1">Total Disclosures</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{statusCounts.disclosed}</p>
            <p className="text-xs text-gray-600 mt-1">Disclosed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{statusCounts.under_review}</p>
            <p className="text-xs text-gray-600 mt-1">Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {statusCounts.patent_pending}
            </p>
            <p className="text-xs text-gray-600 mt-1">Patent Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{statusCounts.patented}</p>
            <p className="text-xs text-gray-600 mt-1">Patented</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="">All</TabsTrigger>
          <TabsTrigger value="disclosed">Disclosed</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="patent_pending">Patent Pending</TabsTrigger>
          <TabsTrigger value="patented">Patented</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter || 'all'}>
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading IP disclosures...</p>
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
              {disclosures.map((disclosure: IPDisclosure) => (
                <Card key={disclosure.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{disclosure.title}</CardTitle>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Badge variant="outline">{disclosure.invention_category}</Badge>
                          <span>•</span>
                          <span>{disclosure.project_name}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(disclosure.status)}>
                        {disclosure.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {disclosure.description}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Potential Applications
                        </h4>
                        <p className="text-sm text-gray-600">
                          {disclosure.potential_applications}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Commercial Potential
                        </h4>
                        <p className="text-sm text-gray-600">
                          {disclosure.commercial_potential}
                        </p>
                      </div>
                    </div>

                    {disclosure.contributors && disclosure.contributors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Contributors & Ownership
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {disclosure.contributors.map((contributor: any, idx: number) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-sm">{contributor.name}</p>
                                <Badge variant="secondary">
                                  {contributor.ownership_percentage}%
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">
                                {contributor.organization}
                              </p>
                              {contributor.role && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {contributor.role}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {disclosure.status === 'patented' && (
                        <Button size="sm" variant="outline">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Licensing Options
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && disclosures.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No IP disclosures found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start documenting your innovations
                </p>
                <Button>Submit IP Disclosure</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
