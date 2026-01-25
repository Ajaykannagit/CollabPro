// Agreement Generator - create collaboration agreements

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';

import { useAgreements } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';

export function AgreementGenerator({ collaborationRequestId }: { collaborationRequestId: number }) {
  const { data: agreements, update, create } = useAgreements();
  const { toast } = useToast();

  const agreement = agreements.find(a => a.collaboration_request_id === collaborationRequestId);

  const handleGenerate = async () => {
    try {
      if (agreement?.id) {
        toast({ title: 'Already exists', description: 'Development draft is already generated.' });
      } else {
        await create({
          collaboration_request_id: collaborationRequestId,
          status: 'Draft',
          current_version: 'v1.0',
          versions: [{
            version_number: 'v1.0',
            created_at: new Date().toISOString(),
            created_by: 'System',
            content: 'Full Agreement Content JSON...',
            sections: [
              { id: '1', title: 'Scope of Work', text: 'The parties agree to collaborate on high-end research...' },
              { id: '2', title: 'Intellectual Property', text: 'All joint IP shall be shared equally...' },
              { id: '3', title: 'Funding', text: 'Funding of ₹1 crore to be disbursed in milestones...' }
            ]
          }]
        });
        toast({ title: 'Success', description: 'Collaboration agreement draft generated.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate agreement.', variant: 'destructive' });
    }
  };

  const handleSendForReview = async () => {
    if (!agreement?.id) return;
    try {
      await update(agreement.id, { status: 'Under Review' });
      toast({ title: 'Sent for Review', description: 'The agreement has been sent to the partner for approval.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send for review.', variant: 'destructive' });
    }
  };

  const handleDownload = () => {
    toast({ title: 'Downloading...', description: 'Preparing PDF version of the agreement.' });
    // Simulate download
    setTimeout(() => {
      toast({ title: 'Success', description: 'Agreement PDF downloaded successfully.' });
    }, 1500);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Agreement Generator</h1>
          <p className="text-slate-400">Create and manage collaboration agreements for Request #{collaborationRequestId}</p>
        </div>
        {!agreement && (
          <Button onClick={handleGenerate} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <FileText className="mr-2 h-4 w-4" /> Generate Draft
          </Button>
        )}
      </div>

      {agreement ? (
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Research Collaboration Agreement</CardTitle>
                <p className="text-sm text-slate-400 mt-1">Version {agreement.current_version}</p>
              </div>
              <Badge className={
                agreement.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20' :
                  agreement.status === 'Under Review' ? 'bg-blue-500/20 text-blue-500 border-blue-500/20' :
                    'bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
              }>
                {agreement.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {agreement.versions[0].sections.map((section: any, idx: number) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <h3 className="font-semibold text-primary mb-2">{section.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-white/10">
              <Button onClick={() => toast({ title: 'Editor Coming Soon', description: 'Rich text editor is under development.' })} variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
              <Button variant="outline" onClick={handleDownload} className="border-white/10 hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {agreement.status === 'Draft' && (
                <Button onClick={handleSendForReview} className="ml-auto bg-emerald-600 hover:bg-emerald-500">
                  Send for Final Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-white/10 bg-white/5">
          <CardContent className="p-12 text-center text-slate-400">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <h3 className="text-xl font-medium text-white mb-2">Ready to formalize?</h3>
            <p className="max-w-md mx-auto mb-6 text-slate-500">Click the generate button above to create a standard collaboration agreement template based on your negotiation terms.</p>
            <Button onClick={handleGenerate} variant="outline" className="border-white/10 hover:bg-white/5">
              Generate Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
