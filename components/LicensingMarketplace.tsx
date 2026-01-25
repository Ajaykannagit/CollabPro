// Licensing Marketplace - browse and request IP licenses

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useLicensingOpportunities } from '@/hooks/useDatabase';

import { useToast } from '@/hooks/use-toast';

export function LicensingMarketplace() {
  const { data: opportunities } = useLicensingOpportunities();
  const { toast } = useToast();

  const handleRequestLicense = (title: string) => {
    toast({
      title: "License Requested",
      description: `Your request for "${title}" has been sent to the IP owner.`,
    });
  };

  return (
    <div className="p-8">
      {/* ... */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <Card key={opp.id} className="border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-white">{opp.title}</CardTitle>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{opp.license_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{opp.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-lg font-bold text-white">{opp.price_range}</span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleRequestLicense(opp.title)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    License
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-dashed border-white/10 bg-white/5">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Marketplace Empty</h3>
              <p className="text-slate-500 max-w-sm mx-auto">There are currently no IP assets listed for licensing. New opportunities appear when IP disclosures are approved for commercialization.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
