// Licensing marketplace for IP commercialization

import { useState } from 'react';
import { useLoadAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import loadLicensingOpportunitiesAction from '@/actions/loadLicensingOpportunities';
import { formatINRCompact, usdToINR } from '@/lib/currency';
import { Store, Search, Eye, MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type LicensingOpportunity = {
  id: number;
  anonymized_title: string;
  anonymized_description: string;
  licensing_type: string;
  asking_price: number;
  industry_sectors: string;
  inquiries_count: number;
  created_at: string;
  invention_category: string;
  ip_status: string;
};

export function LicensingMarketplace() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, loading, error] = useLoadAction(
    loadLicensingOpportunitiesAction,
    [],
    { industrySector: searchQuery || null }
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Store className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Licensing Marketplace</h1>
        </div>
        <p className="text-gray-600">Discover patented technologies available for licensing</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by industry sector..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading opportunities...</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((opp: LicensingOpportunity) => (
            <Card key={opp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{opp.invention_category}</Badge>
                  <Badge className="bg-teal-100 text-teal-800">
                    {opp.licensing_type}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{opp.anonymized_title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {opp.anonymized_description}
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{opp.inquiries_count} inquiries</span>
                  </div>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {opp.ip_status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Asking Price</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {formatINRCompact(usdToINR(opp.asking_price))}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Applicable Industries
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {opp.industry_sectors.split(', ').slice(0, 3).map((sector, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Interest Expressed",
                        description: `Your interest in ${opp.anonymized_title} has been recorded.`,
                      });
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Express Interest
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Requesting Details",
                        description: "Requesting full details for this opportunity...",
                      });
                    }}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && opportunities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No opportunities found
            </h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
