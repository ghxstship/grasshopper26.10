'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { UserMinus } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/social/following

export default function FollowingPage() {
  const following = [{ id: '1', name: 'User 1', username: '@user1' }];
  return (
    <ListPageTemplate title="Following" description="People you follow">
      <div className="grid md:grid-cols-3 gap-6">
        {following.map((user) => (
          <div key={user.id} className="card p-6 text-center">
            <Avatar size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-1 text-ghxst-primary">{user.name}</CardTitle>
            <Metadata className="text-ghxst-text-secondary mb-4">{user.username}</Metadata>
            <Button variant="secondary" size="sm" className="w-full">Unfollow</Button>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
