/**
 * Direct Messages Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function MessagesPage() {
  const [message, setMessage] = React.useState('');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <H1 className="mb-8">Messages</H1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <H3 className="mb-4">Conversations</H3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-2 border-black">
                    <Avatar fallback="U" size="md" />
                    <div className="flex-1">
                      <H3>User {i}</H3>
                      <Caption className="text-gray-500">Last message...</Caption>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6 h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4">
                <Body className="text-center text-gray-500 py-12">Select a conversation</Body>
              </div>
              <div className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
