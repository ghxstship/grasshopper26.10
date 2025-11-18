'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { MessageCircle } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Avatar } from '@/components/atoms/Avatar';

export default function MessagesPage() {
  const messages = [{ id: '1', name: 'User 1', lastMessage: 'Hey!', time: '2h ago' }];
  return (
    <ListPageTemplate title="Messages" description="Your conversations">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="card p-4 flex items-center gap-4 hover:border-ghxst-primary cursor-pointer">
            <Avatar size="md" />
            <div className="flex-1">
              <CardTitle className="text-ghxst-primary">{msg.name}</CardTitle>
              <Metadata className="text-ghxst-text-secondary">{msg.lastMessage}</Metadata>
            </div>
            <Metadata className="text-ghxst-text-secondary">{msg.time}</Metadata>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
