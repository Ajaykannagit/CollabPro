// Agreement template generator and review interface

import { useLoadAction } from '@uibakery/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import loadAgreementDetailsAction from '@/actions/loadAgreementDetails';
import { FileText, CheckCircle2, AlertCircle, User } from 'lucide-react';

type AgreementGeneratorProps = {
  collaborationRequestId: number;
};

export function AgreementGenerator({ collaborationRequestId }: AgreementGeneratorProps) {
  const [agreement, loading] = useLoadAction(
    loadAgreementDetailsAction,
    [],
    { collaborationRequestId }
  );

  const agreementData = agreement[0];

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
              <div className="flex items-start gap-2">
                <Checkbox id="legal1" defaultChecked />
                <label htmlFor="legal1" className="text-sm text-gray-700">
                  College IP policy reviewed
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="legal2" defaultChecked />
                <label htmlFor="legal2" className="text-sm text-gray-700">
                  Corporate compliance verified
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="legal3" />
                <label htmlFor="legal3" className="text-sm text-gray-700">
                  Ethics committee approval
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="legal4" />
                <label htmlFor="legal4" className="text-sm text-gray-700">
                  Data protection compliance
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <Button className="w-full">
                <User className="h-4 w-4 mr-2" />
                Sign Agreement
              </Button>
              <Button variant="outline" className="w-full">
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
