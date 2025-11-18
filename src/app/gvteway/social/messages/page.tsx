'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent } from '@/components/atoms/Card';
import { useConversations } from '@/lib/hooks/gvteway/useMessages';

export default function MessagesPage() {
  const [message, setMessage] = useState('');
  const { data: conversations = [], isLoading, error, refetch } = useConversations();
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading messages...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Messages</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">MESSAGES</h1>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {conversations.map((conv) => (
                          <div key={conv.id} className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm">{conv.name}</p>
                                <p className="text-gray-400 text-xs truncate">{conv.lastMessage}</p>
                              </div>
                              <span className="text-gray-500 text-xs">{conv.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="h-96 mb-4 overflow-y-auto">
                        <p className="text-gray-400 text-center py-8">Select a conversation to start messaging</p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button variant="gvteway">
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
