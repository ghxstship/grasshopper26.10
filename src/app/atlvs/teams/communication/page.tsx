'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Search, Users, Phone, Video, MoreVertical, Paperclip, Smile, Bell,  } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';
import { Textarea } from '@/components/atoms/Textarea';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface _Channel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  members: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function CommunicationHubPage() { 
  const [selectedChannel, setSelectedChannel] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data,  } = useTeams();
  const queryClient = useQueryClient();
  
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // TODO: Implement actual API call
      return { success: true, message };
    },
    onSuccess: () => {
      setMessageInput('');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
  const channels = (data as any)?.channels || [
    {
      id: '1',
      name: 'Production Team',
      type: 'group',
      members: 12,
      lastMessage: 'Meeting at 3pm today',
      lastMessageTime: '10:30 AM',
      unreadCount: 3
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      type: 'direct',
      members: 2,
      lastMessage: 'Can you review the budget?',
      lastMessageTime: '9:15 AM',
      unreadCount: 1
    },
    {
      id: '3',
      name: 'Project Alpha',
      type: 'project',
      members: 8,
      lastMessage: 'Updated timeline attached',
      lastMessageTime: 'Yesterday',
      unreadCount: 0
    },
    {
      id: '4',
      name: 'Technical Team',
      type: 'group',
      members: 6,
      lastMessage: 'Equipment check complete',
      lastMessageTime: 'Yesterday',
      unreadCount: 0
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'u1',
      senderName: 'Sarah Johnson',
      content: 'Good morning team! Ready for today\'s production meeting?',
      timestamp: '9:00 AM',
      isRead: true
    },
    {
      id: '2',
      senderId: 'u2',
      senderName: 'Mike Chen',
      content: 'Yes, I have the equipment list ready to review.',
      timestamp: '9:05 AM',
      isRead: true
    },
    {
      id: '3',
      senderId: 'current',
      senderName: 'You',
      content: 'Perfect! Let\'s meet in Conference Room B at 10am.',
      timestamp: '9:10 AM',
      isRead: true
    },
    {
      id: '4',
      senderId: 'u1',
      senderName: 'Sarah Johnson',
      content: 'Meeting at 3pm today',
      timestamp: '10:30 AM',
      isRead: false
    }
  ];

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessageMutation.mutate(messageInput);
    }
  };

  const getChannelIcon = (type: string) => {
    if (type === 'direct') return '👤';
    if (type === 'group') return '👥';
    return '📁';
  };

  return (
    <AtlvsLayout>
      <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-h4 text-gray-900">Communication Hub</h1>
          <p className="text-body-sm text-gray-600">Team messaging and collaboration</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar - Channels List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10 text-body-sm"
              />
            </div>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto">
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                  selectedChannel === channel.id ? 'bg-success-light border-l-4 border-l-green-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-h5">{getChannelIcon(channel.type)}</span>
                    <span className="font-medium text-gray-900">{channel.name}</span>
                  </div>
                  {channel.unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-success text-white text-caption rounded-full">
                      {channel.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-600 truncate flex-1">{channel.lastMessage}</span>
                  <span className="text-gray-400 text-caption ml-2">{channel.lastMessageTime}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-caption text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{channel.members} members</span>
                </div>
              </div>
            ))}
          </div>

          {/* New Channel Button */}
          <div className="p-4 border-t border-gray-200">
            <Button variant="atlvs" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Channel
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-h4">{getChannelIcon(channels.find(c => c.id === selectedChannel)?.type || 'group')}</span>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {channels.find(c => c.id === selectedChannel)?.name}
                  </h2>
                  <p className="text-body-sm text-gray-600">
                    {channels.find(c => c.id === selectedChannel)?.members} members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Phone className="w-5 h-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Video className="w-5 h-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${message.senderId === 'current' ? 'order-2' : 'order-1'}`}>
                  {message.senderId !== 'current' && (
                    <div className="text-body-sm text-gray-700 mb-1">{message.senderName}</div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.senderId === 'current'
                        ? 'bg-success text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <div className="text-caption text-gray-500 mt-1">{message.timestamp}</div>
                </div>
                {message.senderId !== 'current' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-body-sm mr-2 order-0">
                    {message.senderName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  variant="atlvs"
                  className="resize-none"
                />
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Smile className="w-5 h-5 text-gray-600" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                variant="atlvs"
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AtlvsLayout>
  );
}
