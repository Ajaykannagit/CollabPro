// Agreement template generator and review interface

import { useState, useEffect } from 'react';
import { useLoadAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import loadAgreementDetailsAction from '@/actions/loadAgreementDetails';
import { FileText, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

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
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'under_review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'signed':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Collaboration Agreement</h1>
          <p className="text-slate-500 font-bold text-lg">{agreementData.project_title}</p>
          <div className="flex items-center gap-2 mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span>{agreementData.College_name}</span>
            <span className="text-primary">×</span>
            <span>{agreementData.company_name}</span>
          </div>
        </div>
        <Badge className={cn(
          "px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm border",
          getStatusColor(agreementData.status)
        )}>
          {agreementData.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agreement Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm overflow-hidden group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Agreement Type</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-2xl font-black text-primary group-hover:scale-[1.01] transition-transform origin-left">
                {agreementData.agreement_type}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm border group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                {agreementData.ip_ownership_split}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm border group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revenue Sharing Model</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                {agreementData.revenue_sharing_model}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm border group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Confidentiality Terms</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                {agreementData.confidentiality_terms}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm border group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Termination Clauses</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                {agreementData.termination_clauses}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm border group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                {agreementData.compliance_requirements}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm border">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Signature Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                {agreementData.College_signed_at ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-slate-300 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-sm text-slate-900">{agreementData.College_name}</p>
                  {agreementData.College_signed_at ? (
                    <>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                        By {agreementData.College_signatory}
                      </p>
                      <p className="text-[10px] font-bold text-primary uppercase mt-0.5">
                        {new Date(agreementData.College_signed_at).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending signature</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                {agreementData.corporate_signed_at ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-slate-300 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-sm text-slate-900">{agreementData.company_name}</p>
                  {agreementData.corporate_signed_at ? (
                    <>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                        By {agreementData.corporate_signatory}
                      </p>
                      <p className="text-[10px] font-bold text-primary uppercase mt-0.5">
                        {new Date(agreementData.corporate_signed_at).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending signature</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm border">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Legal Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {loadingChecklist ? (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing checklist...</p>
              ) : (
                checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group/item">
                    <Checkbox
                      id={`checklist-${item.item_key}`}
                      checked={item.is_checked}
                      className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      onCheckedChange={(checked) =>
                        handleChecklistChange(item.item_key, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`checklist-${item.item_key}`}
                      className="text-xs font-bold text-slate-600 cursor-pointer group-hover/item:text-slate-900 transition-colors"
                    >
                      {item.item_label}
                    </label>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
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
              className="w-full h-12 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
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
          </div>
        </div>
      </div>
    </div>
  );
}
