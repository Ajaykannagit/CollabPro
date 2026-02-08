// Shared negotiation workspace with messaging and scope editing

import { useState } from 'react';
import { useLoadAction, useMutateAction } from '@/lib/data-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import loadNegotiationThreadAction from '@/actions/loadNegotiationThread';
import createNegotiationMessageAction from '@/actions/createNegotiationMessage';
import { MessageSquare, FileText, Send, Building2, GraduationCap } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useAppStore } from '@/lib/store';
import createProjectScopeAction from '@/actions/createProjectScope';
import approveProjectScopeAction from '@/actions/approveProjectScope';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type NegotiationMessage = {
  id: string;
  sender_name: string;
  sender_organization: string;
  message_type: 'text' | 'proposal' | 'counter-proposal' | string;
  content: string;
  created_at: string;
};

type ProjectScopeVersion = {
  id: string;
  version_number: number;
  scope_description: string;
  deliverables: string;
  timeline: string;
  budget: number;
  created_by: string;
};

type NegotiationThreadData = {
  thread_id: number;
  collaboration_request_id: number;
  project_brief: string;
  messages: NegotiationMessage[];
  current_scope: ProjectScopeVersion | null;
};

type NegotiationWorkspaceProps = {
  collaborationRequestId: number;
};

export function NegotiationWorkspace({ collaborationRequestId }: NegotiationWorkspaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [thread, loading, _error, refresh] = useLoadAction(
    loadNegotiationThreadAction,
    [] as NegotiationThreadData[],
    { collaborationRequestId }
  );
  const [sendMessage, sending] = useMutateAction(createNegotiationMessageAction);
  const { toast } = useToast();
  const { user, userLoading } = useAppStore();

  // Scope Management State
  const [isScopeDialogOpen, setIsScopeDialogOpen] = useState(false);
  const [scopeDescription, setScopeDescription] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [submittingScope, setSubmittingScope] = useState(false);
  const [approvingScope, setApprovingScope] = useState(false);
  const currentScope = thread[0]?.current_scope;

  const handleCreateScope = async () => {
    if (!threadData || !user) return;
    setSubmittingScope(true);
    try {
      await createProjectScopeAction({
        collaborationRequestId: collaborationRequestId,
        versionNumber: (currentScope?.version_number || 0) + 1,
        scopeDescription,
        deliverables,
        timeline,
        budget: parseFloat(budget) || 0,
        createdBy: user.name
      });
      toast({ title: "Scope Proposed", description: "New version of scope has been submitted." });
      setIsScopeDialogOpen(false);
      refresh();
    } catch (e: any) {
      toast({ title: "Failed to propose scope", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingScope(false);
    }
  };

  const handleApproveScope = async () => {
    if (!currentScope || !user) return;
    setApprovingScope(true);
    try {
      await approveProjectScopeAction({ scopeId: parseInt(currentScope.id), approvedBy: user.name });
      toast({ title: "Scope Approved", description: "Project scope has been finalized." });
      refresh();
    } catch (e: any) {
      toast({ title: "Approval Failed", description: e.message, variant: "destructive" });
    } finally {
      setApprovingScope(false);
    }
  };

  const threadData = thread[0];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !threadData || !user) return;

    try {
      await sendMessage({
        threadId: threadData.thread_id,
        senderName: user.name,
        senderOrganization: user.organization,
        messageType: 'text',
        content: newMessage,
      });
      setNewMessage('');
      toast({ description: 'Message sent successfully' });
      refresh();
    } catch (err) {
      toast({ description: 'Failed to send message', variant: 'destructive' });
    }
  };

  if (loading || userLoading || !threadData || !user) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading negotiation workspace...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Negotiation Workspace</h1>
          <p className="text-gray-600">Collaborate on project scope and terms</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Discussion Thread */}
          <Card className="flex flex-col h-[700px]">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discussion Thread
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                {threadData.messages?.map((message: any) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${message.sender_organization === 'NHSRCL'
                          ? 'bg-blue-600'
                          : 'bg-purple-600'
                          }`}
                      >
                        {message.sender_organization === 'NHSRCL' ? (
                          <Building2 className="h-5 w-5" />
                        ) : (
                          <GraduationCap className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {message.sender_name}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {message.sender_organization}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Current Project Scope */}
          <Card className="h-[700px] overflow-auto">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Project Scope
                {currentScope && (
                  <Badge variant="outline">v{currentScope.version_number}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {currentScope ? (
                <>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Scope Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {currentScope.scope_description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Deliverables</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {currentScope.deliverables}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                      <p className="text-sm text-gray-700">{currentScope.timeline}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                      <p className="text-lg font-bold text-blue-600">
                        {formatINR(currentScope.budget)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs text-gray-600">
                      Last updated by {currentScope.created_by}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsScopeDialogOpen(true)}>
                      Propose Changes
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleApproveScope}
                      disabled={approvingScope}
                    >
                      {approvingScope ? 'Approving...' : 'Approve Scope'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No project scope defined yet</p>
                  <Button className="mt-4" size="sm" onClick={() => setIsScopeDialogOpen(true)}>
                    Create Initial Scope
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />

      <Dialog open={isScopeDialogOpen} onOpenChange={setIsScopeDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Propose Project Scope v{(currentScope?.version_number || 0) + 1}</DialogTitle>
            <DialogDescription>Define the deliverables, timeline, and budget.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scope Description</Label>
              <Textarea
                placeholder="Detailed description of work..."
                value={scopeDescription}
                onChange={(e) => setScopeDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Deliverables</Label>
              <Textarea
                placeholder="List of key deliverables..."
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Input
                  placeholder="e.g. 6 months"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget (INR)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsScopeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateScope} disabled={submittingScope}>
              {submittingScope ? 'Submitting...' : 'Propose Scope'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
