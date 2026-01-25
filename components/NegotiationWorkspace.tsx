// Negotiation Workspace - message thread for collaboration

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

import { useNegotiations } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';

export function NegotiationWorkspace({ collaborationRequestId }: { collaborationRequestId: number }) {
  const [message, setMessage] = useState('');
  const { data: negotiations, update, create } = useNegotiations();
  const { toast } = useToast();

  const negotiation = negotiations.find(n => n.collaboration_request_id === collaborationRequestId);
  const messages = negotiation?.messages || [];

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'Corporate Partner', // In a real app, this would be the logged-in user
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
      type: 'message' as const
    };

    try {
      if (negotiation?.id) {
        await update(negotiation.id, {
          messages: [...messages, newMessage]
        });
      } else {
        await create({
          collaboration_request_id: collaborationRequestId,
          messages: [newMessage],
          status: 'In Progress'
        });
      }
      setMessage('');
      toast({
        title: 'Message Sent',
        description: 'Your message has been delivered successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Negotiation Workspace</h1>
        <p className="text-slate-400">Discuss collaboration terms for Request #{collaborationRequestId}</p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Message Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {messages.map((msg: any) => (
              <div key={msg.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary">{msg.sender}</span>
                  <span className="text-xs text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-slate-300">{msg.message}</p>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12 text-slate-500 italic">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none focus-visible:ring-primary/50"
            />
            <Button
              onClick={handleSend}
              className="h-auto px-6 bg-primary hover:bg-primary/90"
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
