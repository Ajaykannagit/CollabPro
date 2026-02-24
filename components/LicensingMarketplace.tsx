// Licensing marketplace for IP commercialization

import { useState } from 'react';
import { useLoadAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import loadLicensingOpportunitiesAction from '@/actions/loadLicensingOpportunities';
import { formatINRCompact, usdToINR } from '@/lib/currency';
import { Store, Search, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import createLicensingInquiryAction from '@/actions/createLicensingInquiry';
import { FadeInUp, StaggerContainer } from '@/components/ui/animation-wrapper';


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
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [opportunities, loading, error] = useLoadAction(
    loadLicensingOpportunitiesAction,
    [],
    { industrySector: searchQuery || null }
  );

  const handleExpressInterest = async (opp: LicensingOpportunity) => {
    setProcessingId(opp.id);
    try {
      await createLicensingInquiryAction({
        licensing_opportunity_id: opp.id,
        inquirer_name: 'Current User', // Replace with actual user context
        inquirer_email: 'user@example.com',
        inquirer_organization: 'My Organization',
        message: `I am interested in licensing ${opp.anonymized_title}.`
      });

      toast({
        title: "Interest Recorded",
        description: `We have notified the IP holder of ${opp.anonymized_title}.`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to record interest",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-8 bg-slate-50/30 min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Licensing Marketplace</h1>
        </div>
        <p className="text-slate-500 font-bold text-lg">Acquire and manage intellectual property rights</p>
      </div>

      {/* Search */}
      <FadeInUp>
        <Card className="mb-10 border-slate-200 bg-white/50 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-2xl border overflow-hidden">
          <CardContent className="p-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
              <Input
                placeholder="Search by industry sector, technology, or patent ID..."
                className="pl-12 h-14 bg-slate-50 border-none rounded-xl font-medium text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Badge className="bg-primary/5 text-primary border-primary/10 text-[10px] font-black uppercase">Fuzzy Search Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeInUp>

      {/* Opportunities Grid */}
      {loading && (
        <div className="text-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Marketplace...</p>
        </div>
      )}

      {error && (
        <Card className="border-red-100 bg-red-50">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-red-600 text-center">Protocol Error: {(error as Error).message}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          {(opportunities || []).map((opp: LicensingOpportunity, idx: number) => (
            <FadeInUp key={opp.id} delay={idx * 0.05}>
              <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer border relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500" />
                <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="bg-white text-slate-500 border-slate-200 text-[10px] font-bold uppercase py-1 px-3 shadow-sm">{opp.invention_category}</Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                      {opp.licensing_type?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{opp.anonymized_title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {opp.anonymized_description}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      <span>{opp.inquiries_count} inquiries</span>
                    </div>
                    <div className="h-3 w-[1px] bg-slate-200" />
                    <Badge variant="outline" className="border-slate-200 text-slate-400 text-[10px] font-bold uppercase py-0.5 px-2">
                      {opp.ip_status?.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Valuation</p>
                    <p className="text-3xl font-black text-primary">
                      {formatINRCompact(usdToINR(opp.asking_price))}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Strategic Industry Vectors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opp.industry_sectors?.split(', ').slice(0, 3).map((sector, sIdx) => (
                        <Badge key={sIdx} variant="outline" className="bg-white border-slate-200 text-slate-600 text-[10px] font-bold uppercase py-1 px-3 shadow-sm">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-slate-50">
                    <Button
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                      onClick={(e) => { e.stopPropagation(); handleExpressInterest(opp); }}
                      disabled={processingId === opp.id}
                    >
                      {processingId === opp.id ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="h-5 w-5 mr-2" />
                      )}
                      {processingId === opp.id ? 'Processing...' : 'Express Interest'}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl px-6 transition-all active:scale-95 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Securing Audit Report",
                          description: "Requesting encrypted full research data and IP audit logs for review.",
                        });
                      }}
                    >
                      Audit Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>
          ))}
        </StaggerContainer>
      )}

      {!loading && !error && (!opportunities || opportunities.length === 0) && (
        <Card className="border-slate-200 bg-white rounded-2xl border">
          <CardContent className="p-20 text-center">
            <Store className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">
              No matching assets
            </h3>
            <p className="text-sm text-slate-500 font-medium">Try refining your strategic search parameters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
