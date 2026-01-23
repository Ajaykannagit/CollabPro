// Licensing Marketplace - browse and request IP licenses

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search } from 'lucide-react';
import { useLicensingOpportunities } from '@/hooks/useDatabase';

export function LicensingMarketplace() {
  const { data: opportunities } = useLicensingOpportunities();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Licensing Marketplace</h1>
        <p className="text-slate-400">Browse and license intellectual property</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search licensing opportunities..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <Card key={opp.id}>
              <CardHeader>
                <CardTitle className="text-lg">{opp.title}</CardTitle>
                <Badge variant="secondary">{opp.license_type}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-4">{opp.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">{opp.price_range}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Request License
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No licensing opportunities available</h3>
              <p className="text-slate-400">Check back later for new IP available for licensing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
