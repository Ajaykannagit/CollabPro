// Agreement Generator - create collaboration agreements

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';

export function AgreementGenerator({ collaborationRequestId: _collaborationRequestId }: { collaborationRequestId: number }) {
  const agreement = {
    title: "Research Collaboration Agreement",
    version: "v1.0",
    status: "Draft",
    sections: [
      { title: "Scope of Work", content: "The parties agree to collaborate on quantum computing research..." },
      { title: "Intellectual Property", content: "All IP developed jointly shall be co-owned..." },
      { title: "Funding", content: "Corporate partner agrees to provide $750,000 in funding..." },
    ],
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Agreement Generator</h1>
        <p className="text-slate-400">Create and manage collaboration agreements</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{agreement.title}</CardTitle>
              <p className="text-sm text-slate-400 mt-1">Version {agreement.version}</p>
            </div>
            <Badge>{agreement.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {agreement.sections.map((section, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-slate-100 mb-2">{section.title}</h3>
                <p className="text-slate-400 text-sm">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Edit Agreement
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">Send for Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
