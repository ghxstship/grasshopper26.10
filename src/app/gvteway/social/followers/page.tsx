'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { UserPlus } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/social/followers

export default function FollowersPage() {
  const followers = [{ id: '1', name: 'User 1', username: '@user1' }];
  return (
    <ListPageTemplate title="Followers" description="People following you">
      <div className="grid md:grid-cols-3 gap-6">
        {followers.map((user) => (
          <div key={user.id} className="card p-6 text-center">
            <Avatar size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-1 text-ghxst-primary">{user.name}</CardTitle>
            <Metadata className="text-ghxst-text-secondary mb-4">{user.username}</Metadata>
            <Button variant="primary" size="sm" className="w-full">Follow Back</Button>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
