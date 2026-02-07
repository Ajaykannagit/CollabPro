// Agreement template generator and review interface

import { useState, useEffect } from 'react';
import { useLoadAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import loadAgreementDetailsAction from '@/actions/loadAgreementDetails';
import { FileText, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

type AgreementDetails = {
  id: number;
  collaboration_request_id: number;
  agreement_type: string;
  ip_ownership_split: string;
  revenue_sharing_model: string;
  confidentiality_terms: string;
  termination_clauses: string;
  compliance_requirements: string;
  College_signed_at: string | null;
  College_signatory: string | null;
  corporate_signed_at: string | null;
  corporate_signatory: string | null;
  status: string;
  project_brief: string;
  project_title: string;
  College_name: string;
  company_name: string;
};

type ChecklistItem = {
  id: number;
  agreement_id: number;
  item_label: string;
  item_key: string;
  is_checked: boolean;
  display_order: number;
};

type AgreementGeneratorProps = {
  collaborationRequestId: number;
};

export function AgreementGenerator({ collaborationRequestId }: AgreementGeneratorProps) {
  const { toast } = useToast();
  const [agreement, loading] = useLoadAction(
    loadAgreementDetailsAction,
    [] as AgreementDetails[],
    { collaborationRequestId }
  );

  const agreementData = agreement[0];
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  // Load checklist items when agreement is loaded
  useEffect(() => {
    const loadChecklist = async () => {
      if (!agreementData?.id) return;

      setLoadingChecklist(true);
      try {
        const { data, error } = await supabase
          .from('agreement_checklist_items')
          .select('*')
          .eq('agreement_id', agreementData.id)
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (data) setChecklistItems(data);
      } catch (error) {
        console.error('Error loading checklist:', error);
      } finally {
        setLoadingChecklist(false);
      }
    };

    loadChecklist();
  }, [agreementData?.id]);

  const handleChecklistChange = async (itemKey: string, checked: boolean) => {
    if (!agreementData?.id) return;

    // Optimistically update UI
    setChecklistItems(prev =>
      prev.map(item =>
        item.item_key === itemKey ? { ...item, is_checked: checked } : item
      )
    );

    try {
      const { error } = await supabase
        .from('agreement_checklist_items')
        .update({ is_checked: checked, updated_at: new Date().toISOString() })
        .eq('agreement_id', agreementData.id)
        .eq('item_key', itemKey);

      if (error) throw error;

      const item = checklistItems.find(i => i.item_key === itemKey);
      toast({
        title: "Checklist Updated",
        description: `${item?.item_label} marked as ${checked ? 'reviewed' : 'unreviewed'}.`,
      });
    } catch (error) {
      console.error('Error updating checklist:', error);
      // Revert optimistic update
      setChecklistItems(prev =>
        prev.map(item =>
          item.item_key === itemKey ? { ...item, is_checked: !checked } : item
        )
      );
      toast({
        title: "Error",
        description: "Failed to update checklist item.",
        variant: "destructive",
      });
    }
  };

  if (loading || !agreementData) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading agreement...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'signed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collaboration Agreement</h1>
          <p className="text-gray-600">{agreementData.project_title}</p>
          <p className="text-sm text-gray-500 mt-1">
            {agreementData.College_name} × {agreementData.company_name}
          </p>
        </div>
        <Badge className={getStatusColor(agreementData.status)}>
          {agreementData.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agreement Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-blue-600">
                {agreementData.agreement_type}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {agreementData.ip_ownership_split}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Sharing Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {agreementData.revenue_sharing_model}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confidentiality Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {agreementData.confidentiality_terms}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination Clauses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {agreementData.termination_clauses}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {agreementData.compliance_requirements}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signature Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                {agreementData.College_signed_at ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-sm">{agreementData.College_name}</p>
                  {agreementData.College_signed_at ? (
                    <>
                      <p className="text-xs text-gray-600">
                        Signed by {agreementData.College_signatory}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(agreementData.College_signed_at).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-600">Pending signature</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                {agreementData.corporate_signed_at ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-sm">{agreementData.company_name}</p>
                  {agreementData.corporate_signed_at ? (
                    <>
                      <p className="text-xs text-gray-600">
                        Signed by {agreementData.corporate_signatory}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(agreementData.corporate_signed_at).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-600">Pending signature</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingChecklist ? (
                <p className="text-xs text-gray-500">Loading checklist...</p>
              ) : (
                checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      id={`checklist-${item.item_key}`}
                      checked={item.is_checked}
                      onCheckedChange={(checked) =>
                        handleChecklistChange(item.item_key, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`checklist-${item.item_key}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {item.item_label}
                    </label>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Initiating Signature",
                    description: "Redirecting to secure signature workflow...",
                  });
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Sign Agreement
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Exporting PDF",
                    description: "Generating PDF agreement...",
                  });
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
