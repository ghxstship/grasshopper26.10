'use client';

import { DetailPageTemplate } from '@/components/templates/DetailPageTemplate';
import { SectionHeader, CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';
import { MapPin, Calendar, Link as LinkIcon, Edit } from 'lucide-react';

const _metadata = {
  title: 'My Profile | GVTEWAY',
  description: 'View and edit your profile',
};

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/social/profile

export default function ProfilePage() {
  return (
    <DetailPageTemplate
      hero={{
        title: 'John Doe',
        subtitle: '@johndoe • Member since Jan 2025',
        badges: [
          { label: 'VIP Member', variant: 'warning' },
          { label: '24 Events', variant: 'default' },
        ],
        actions: [
          { label: 'Edit Profile', variant: 'primary', icon: <Edit className="w-4 h-4 mr-2" /> },
          { label: 'Share Profile', variant: 'secondary', icon: <LinkIcon className="w-4 h-4 mr-2" /> },
        ],
      }}
      sidebar={
        <div className="space-y-6">
          <div className="card p-6">
            <SectionHeader className="mb-4 text-ghxst-primary">Stats</SectionHeader>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Metadata className="text-ghxst-text-secondary">Events Attended</Metadata>
                <BodyText className="font-semibold">24</BodyText>
              </div>
              <div className="flex justify-between">
                <Metadata className="text-ghxst-text-secondary">Following</Metadata>
                <BodyText className="font-semibold">156</BodyText>
              </div>
              <div className="flex justify-between">
                <Metadata className="text-ghxst-text-secondary">Followers</Metadata>
                <BodyText className="font-semibold">89</BodyText>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <SectionHeader className="mb-4 text-ghxst-primary">Info</SectionHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ghxst-text-secondary" />
                <Metadata className="text-ghxst-text-secondary">Tampa, FL</Metadata>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ghxst-text-secondary" />
                <Metadata className="text-ghxst-text-secondary">Joined Jan 2025</Metadata>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div>
        <SectionHeader className="mb-4 text-ghxst-primary">About</SectionHeader>
        <BodyText className="text-ghxst-text-secondary">
          Music lover and event enthusiast. Always looking for the next great show!
        </BodyText>
      </div>
      <div>
        <SectionHeader className="mb-4 text-ghxst-primary">Interests</SectionHeader>
        <div className="flex flex-wrap gap-2">
          {['Electronic', 'House', 'Techno', 'Festivals', 'Live Music'].map((interest) => (
            <Badge key={interest} variant="default">{interest}</Badge>
          ))}
        </div>
      </div>
      <div>
        <SectionHeader className="mb-4 text-ghxst-primary">Recent Activity</SectionHeader>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4">
              <CardTitle className="mb-2 text-ghxst-primary">Attended Event {i}</CardTitle>
              <Metadata className="text-ghxst-text-secondary">2 days ago</Metadata>
            </div>
          ))}
        </div>
      </div>
    </DetailPageTemplate>
  );
}
