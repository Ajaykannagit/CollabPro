// Shared negotiation workspace with messaging and scope editing

import { useState } from 'react';
import { useLoadAction, useMutateAction } from '@uibakery/data';
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

type NegotiationWorkspaceProps = {
  collaborationRequestId: number;
};

export function NegotiationWorkspace({ collaborationRequestId }: NegotiationWorkspaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [thread, loading, _error, refresh] = useLoadAction(
    loadNegotiationThreadAction,
    [],
    { collaborationRequestId }
  );
  const [sendMessage, sending] = useMutateAction(createNegotiationMessageAction);
  const { toast } = useToast();

  const threadData = thread[0];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !threadData) return;

    try {
      await sendMessage({
        threadId: threadData.thread_id,
        senderName: 'Rajesh Kumar',
        senderOrganization: 'NHSRCL',
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

  if (loading || !threadData) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading negotiation workspace...</p>
      </div>
    );
  }

  const currentScope = threadData.current_scope;

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
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          message.sender_organization === 'NHSRCL'
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
                    <Button variant="outline" size="sm" className="flex-1">
                      Propose Changes
                    </Button>
                    <Button size="sm" className="flex-1">
                      Approve Scope
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No project scope defined yet</p>
                  <Button className="mt-4" size="sm">
                    Create Initial Scope
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  );
}
