// Negotiation Workspace - message thread for collaboration

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export function NegotiationWorkspace({ collaborationRequestId: _collaborationRequestId }: { collaborationRequestId: number }) {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    { id: 1, sender: 'University Team', message: 'We are interested in collaborating on this project.', timestamp: '2024-01-15 10:00 AM' },
    { id: 2, sender: 'Corporate Partner', message: 'Great! Let\'s discuss the terms and timeline.', timestamp: '2024-01-15 11:30 AM' },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, this would save to database
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Negotiation Workspace</h1>
        <p className="text-slate-400">Discuss collaboration terms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-200">{msg.sender}</span>
                  <span className="text-xs text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-slate-300">{msg.message}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
