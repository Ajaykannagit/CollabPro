// IP Portfolio - view intellectual property disclosures

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';
import { useIPDisclosures } from '@/hooks/useDatabase';

export function IPPortfolio() {
  const { data: disclosures } = useIPDisclosures();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">IP Portfolio</h1>
          <p className="text-slate-400">Manage your intellectual property disclosures</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Disclosure
        </Button>
      </div>

      <div className="grid gap-4">
        {disclosures && disclosures.length > 0 ? (
          disclosures.map((disclosure) => (
            <Card key={disclosure.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{disclosure.title}</CardTitle>
                  <Badge>{disclosure.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-4">{disclosure.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>Type: {disclosure.invention_type}</span>
                  <span>•</span>
                  <span>Inventors: {disclosure.inventors?.join(', ')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No IP disclosures yet</h3>
              <p className="text-slate-400 mb-4">Start protecting your intellectual property</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Disclosure
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
