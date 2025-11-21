'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { BodyText, Metadata } from '@/components/atoms/Typography';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/social/notifications

export default function NotificationsPage() {
  const notifications = [{ id: '1', text: 'User 1 followed you', time: '2h ago' }];
  return (
    <ListPageTemplate title="Notifications" description="Stay updated with your activity">
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="card p-4">
            <BodyText className="text-ghxst-text-primary mb-1">{notif.text}</BodyText>
            <Metadata className="text-ghxst-text-secondary">{notif.time}</Metadata>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
