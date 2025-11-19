'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState, useMemo } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { useToast } from '@/lib/hooks/useToast';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { BodyText } from "@/components/atoms/Typography";

interface Message {
  id: string;
  from: string;
  message: string;
  time: string;
  unread: boolean;
}

interface AdvancingRequest {
  id: string;
  project?: string;
  [key: string]: unknown;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/advancing/communication

export default function AdvancingCommunicationPage() {
  const { addToast } = useToast();
  const { data: requests } = useAdvancingRequests();
  
  // State - Using mock data for now, will be replaced with actual messages API
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'Production Team', message: 'Stage setup confirmed for 8am', time: '10 mins ago', unread: true },
    { id: '2', from: 'Venue Manager', message: 'Loading dock access approved', time: '1 hour ago', unread: false },
    { id: '3', from: 'Artist Rep', message: 'Rider requirements updated', time: '2 hours ago', unread: false }
  ]);
  
  const [recipient, setRecipient] = useState('Production Team');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Get available recipients from requests
  const recipients = useMemo(() => {
    const defaultRecipients = ['Production Team', 'Venue Manager', 'Artist Rep', 'Security Team', 'Catering'];
    if (!requests) return defaultRecipients;
    
    // Extract unique project names as potential recipients
    const typedRequests = requests as AdvancingRequest[];
    const projectRecipients = [...new Set(typedRequests.map((r: AdvancingRequest) => r.project))].filter(Boolean);
    return [...defaultRecipients, ...projectRecipients];
  }, [requests]);
  
  // Validation
  const isValid = recipient && messageText.trim().length > 0;
  
  // Event handlers
  const handleSendMessage = async () => {
    if (!isValid) return;
    
    setIsSending(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add message to list (optimistic update)
      const newMessage: Message = {
        id: Date.now().toString(),
        from: 'You',
        message: messageText,
        time: 'Just now',
        unread: false
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setMessageText('');
      
      addToast({
        title: 'Success',
        description: `Message sent to ${recipient}`,
        variant: 'success',
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, unread: false } : msg
      )
    );
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="COMMUNICATION"
        description="Coordinate with production teams"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'Communication' }
        ]}
      >
        <Card variant="atlvs" className="bg-grey-900/50 mb-6">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages
            </CardTitle>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-grey-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <BodyText >No messages yet</BodyText>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${ msg.unread ? 'bg-atlvs-green-500/10 border border-atlvs-green-500/30 hover:bg-atlvs-green-500/20' : 'bg-grey-800/50 hover:bg-grey-800' }`}
                    onClick={() => msg.unread && handleMarkAsRead(msg.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{msg.from}</span>
                        {msg.unread && (
                          <span className="w-2 h-2 rounded-full bg-atlvs-green-500" />
                        )}
                      </div>
                      <span className="text-body-sm text-grey-400">{msg.time}</span>
                    </div>
                    <div className="text-grey-300">{msg.message}</div>
                  </div>
                ))
              )}
            </div>
          </CardHeader>
        </Card>

        <Card variant="atlvs" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="mb-4">Send Message</CardTitle>
            <div className="space-y-4">
              <FormField label="To" required>
                <Select 
                  variant="atlvs"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isSending}
                >
                  {recipients.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Message" required>
                <Textarea
                  rows={4}
                  variant="atlvs"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={isSending}
                />
                <div className="text-caption text-grey-400 mt-1">
                  {messageText.length}/500 characters
                </div>
              </FormField>
              <Button 
                variant="atlvs" 
                className="w-full"
                onClick={handleSendMessage}
                disabled={!isValid || isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
