'use client';

import * as React from 'react';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardContent} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Badge} from '@/components/atoms/Badge';
import { Avatar} from '@/components/atoms/Avatar';
import { BodyTextSmall, CardTitle as CardTitleTypography,
 Metadata} from '@/components/atoms/Typography';
import { EmptyState} from '@/components/molecules/EmptyState';
import { Tabs} from '@/components/molecules/Tabs';
import { SearchBar} from '@/components/molecules/SearchBar';
import { Bell, Check, CheckCheck, Trash2, Mail,
 MailOpen,
 AlertCircle,
 Info,
 CheckCircle,
 XCircle
} from 'lucide-react';
import { useRouter} from 'next/navigation';

// Mock notification data - replace with actual API calls
interface Notification {
 id: string;
 type: 'info' | 'success' | 'warning' | 'error';
 title: string;
 message: string;
 timestamp: Date;
 read: boolean;
 avatar?: string;
 sender?: string;
 actionUrl?: string;
}

const mockNotifications: Notification[] = [
 {
 id: '1',
 type: 'info',
 title: 'New Event Published',
 message: 'Summer Music Festival 2025 has been published and is now live.',
 timestamp: new Date(Date.now() - 1000 * 60 * 5),
 read: false,
 sender: 'Event Manager',
 actionUrl: '/events/summer-festival-2025'
},
 {
 id: '2',
 type: 'success',
 title: 'Ticket Sales Milestone',
 message: 'Congratulations! You\'ve sold 1,000 tickets for your event.',
 timestamp: new Date(Date.now() - 1000 * 60 * 30),
 read: false,
 sender: 'System',
},
 {
 id: '3',
 type: 'warning',
 title: 'Payment Processing Delay',
 message: 'There is a delay in processing payments. We\'re working to resolve this.',
 timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
 read: true,
 sender: 'Finance Team',
},
 {
 id: '4',
 type: 'info',
 title: 'New Comment on Event',
 message: 'John Doe commented on your event:"Looking forward to this!"',
 timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
 read: true,
 sender: 'John Doe',
 avatar: '/avatars/john-doe.jpg',
 actionUrl: '/events/summer-festival-2025#comments'
},
 {
 id: '5',
 type: 'error',
 title: 'Event Approval Required',
 message: 'Your event"Winter Wonderland" requires admin approval before publishing.',
 timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
 read: true,
 sender: 'Admin Team',
 actionUrl: '/events/winter-wonderland/edit'
},
];

const getNotificationIcon = (type: Notification['type']) => {
 switch (type) {
 case 'info':
 return <Info className="h-5 w-5" />;
 case 'success':
 return <CheckCircle className="h-5 w-5" />;
 case 'warning':
 return <AlertCircle className="h-5 w-5" />;
 case 'error':
 return <XCircle className="h-5 w-5" />;
 default:
 return <Bell className="h-5 w-5" />;
}
};

const getNotificationBadgeVariant = (type: Notification['type']) => {
 switch (type) {
 case 'success':
 return 'success';
 case 'warning':
 return 'warning';
 case 'error':
 return 'error';
 default:
 return 'default';
}
};

const formatTimestamp = (date: Date): string => {
 const now = new Date();
 const diff = now.getTime() - date.getTime();
 const minutes = Math.floor(diff / 60000);
 const hours = Math.floor(diff / 3600000);
 const days = Math.floor(diff / 86400000);

 if (minutes < 1) return 'Just now';
 if (minutes < 60) return`${minutes}m ago`;
 if (hours < 24) return`${hours}h ago`;
 if (days < 7) return`${days}d ago`;
 return date.toLocaleDateString();
};

export default function NotificationsPage() {
 const router = useRouter();
 const [activeTab, setActiveTab] = React.useState<string>('all');
 const [searchQuery, setSearchQuery] = React.useState<string>('');
 const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
 const [selectedNotifications, setSelectedNotifications] = React.useState<Set<string>>(new Set());

 // Filter notifications based on active tab and search
 const filteredNotifications = React.useMemo(() => {
 let filtered = notifications;

 // Filter by tab
 if (activeTab === 'unread') {
 filtered = filtered.filter(n => !n.read);
} else if (activeTab === 'read') {
 filtered = filtered.filter(n => n.read);
}

 // Filter by search query
 if (searchQuery) {
 const query = searchQuery.toLowerCase();
 filtered = filtered.filter(n => n.title.toLowerCase().includes(query) ||
 n.message.toLowerCase().includes(query) ||
 n.sender?.toLowerCase().includes(query)
 );
}

 return filtered;
}, [notifications, activeTab, searchQuery]);

 const unreadCount = notifications.filter(n => !n.read).length;

 const handleMarkAsRead = (id: string) => {
 setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true} : n)
 );
};

 const handleMarkAsUnread = (id: string) => {
 setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false} : n)
 );
};

 const handleMarkAllAsRead = () => {
 setNotifications(prev => prev.map(n => ({ ...n, read: true})));
};

 const handleDelete = (id: string) => {
 setNotifications(prev => prev.filter(n => n.id !== id));
 setSelectedNotifications(prev => {
 const next = new Set(prev);
 next.delete(id);
 return next;
});
};

 const handleDeleteSelected = () => {
 setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
 setSelectedNotifications(new Set());
};

 const handleSelectNotification = (id: string) => {
 setSelectedNotifications(prev => {
 const next = new Set(prev);
 if (next.has(id)) {
 next.delete(id);
} else {
 next.add(id);
}
 return next;
});
};

 const handleSelectAll = () => {
 if (selectedNotifications.size === filteredNotifications.length) {
 setSelectedNotifications(new Set());
} else {
 setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
}
};

 const handleNotificationClick = (notification: Notification) => {
 if (!notification.read) {
 handleMarkAsRead(notification.id);
}
 if (notification.actionUrl) {
 router.push(notification.actionUrl);
} else {
 router.push(`/notifications/${notification.id}/read`);
}
};

 return (
 <GvtewayLayout>
 <ContentLayout
 title="Notifications"
 description="Stay updated with your latest notifications and alerts"
 breadcrumbs={[
 { label:"Home", href:"/home"},
 { label:"Notifications"}
 ]}
 variant="gvteway"
 >
 <div className="space-y-6">
 {/* Header Actions */}
 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
 <div className="flex items-center gap-3">
 <Badge variant={unreadCount > 0 ?"error" :"default"}>
 {unreadCount} Unread
 </Badge>
 {selectedNotifications.size > 0 && (
 <Badge variant="default">
 {selectedNotifications.size} Selected
 </Badge>
 )}
 </div>
 <div className="flex flex-wrap gap-2">
 {selectedNotifications.size > 0 ? (
 <Button
 variant="destructive"
 size="sm"
 onClick={handleDeleteSelected}
 >
 <Trash2 className="h-4 w-4 me-2" />
 Delete Selected
 </Button>
 ) : (
 <>
 <Button
 variant="outline"
 size="sm"
 onClick={handleMarkAllAsRead}
 disabled={unreadCount === 0}
 >
 <CheckCheck className="h-4 w-4 me-2" />
 Mark All Read
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={handleSelectAll}
 >
 <Check className="h-4 w-4 me-2" />
 Select All
 </Button>
 </>
 )}
 </div>
 </div>

 {/* Search and Filter */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="flex-1">
 <SearchBar
 placeholder="Search notifications..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onClear={() => setSearchQuery('')}
 variant="gvteway"
 />
 </div>
 </div>

 {/* Tabs */}
 <Tabs
 tabs={[
 { id: 'all', label:`All (${notifications.length})`},
 { id: 'unread', label:`Unread (${unreadCount})`},
 { id: 'read', label:`Read (${notifications.length - unreadCount})`},
 ]}
 activeTab={activeTab}
 onChange={setActiveTab}
 variant="gvteway"
 />

 {/* Notifications List */}
 {filteredNotifications.length === 0 ? (
 <EmptyState
 icon={<Bell className="h-12 w-12" />}
 title={searchQuery ?"No Matching Notifications" :"No Notifications"}
 message={
 searchQuery ?"Try adjusting your search query"
 : activeTab === 'unread'
 ?"You're all caught up! No unread notifications."
 :"You don't have any notifications yet."
}
 variant="gvteway"
 />
 ) : (
 <div className="space-y-3">
 {filteredNotifications.map((notification) => (
 <Card
 key={notification.id}
 variant="gvteway"
 className={`transition-all hover:border-gvteway-red-500/50 cursor-pointer ${
 !notification.read ? 'border-l-4 border-l-gvteway-red-500' : ''
} ${
 selectedNotifications.has(notification.id) ? 'ring-2 ring-gvteway-red-500' : ''
}`}
 >
 <CardContent className="p-4">
 <div className="flex items-start gap-4">
 {/* Checkbox */}
 <div className="flex items-center pt-1">
 <input
 type="checkbox"
 checked={selectedNotifications.has(notification.id)}
 onChange={(e) => {
 e.stopPropagation();
 handleSelectNotification(notification.id);
}}
 className="h-4 w-4 rounded text-gvteway-red-500 focus:ring-gvteway-red-500"
 />
 </div>

 {/* Avatar/Icon */}
 <div className="flex-shrink-0">
 {notification.avatar ? (
 <Avatar
 src={notification.avatar}
 alt={notification.sender || 'User'}
 fallback={notification.sender || 'U'}
 size="md"
 />
 ) : (
 <div className={`p-2 rounded-full ${
 notification.type === 'success' ? 'bg-success/10 text-success' :
 notification.type === 'warning' ? 'bg-warning/10 text-warning' :
 notification.type === 'error' ? 'bg-error/10 text-error' :
 'bg-info/10 text-info'
}`}>
 {getNotificationIcon(notification.type)}
 </div>
 )}
 </div>

 {/* Content */}
 <div className="flex-1 min-w-0"
 onClick={() => handleNotificationClick(notification)}
 >
 <div className="flex items-start justify-between gap-2 mb-1">
 <CardTitleTypography className="text-white">
 {notification.title}
 </CardTitleTypography>
 <Badge variant={getNotificationBadgeVariant(notification.type)} className="flex-shrink-0">
 {notification.type}
 </Badge>
 </div>
 <BodyTextSmall className="mb-2">
 {notification.message}
 </BodyTextSmall>

 <div className="flex items-center gap-4">
 {notification.sender && (
 <Metadata>From: {notification.sender}</Metadata>
 )}
 <Metadata>{formatTimestamp(notification.timestamp)}</Metadata>
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2 flex-shrink-0">
 {notification.read ? (
 <Button
 variant="ghost"
 size="icon"
 onClick={(e) => {
 e.stopPropagation();
 handleMarkAsUnread(notification.id);
}}
 title="Mark as unread"
 >
 <Mail className="h-4 w-4" />
 </Button>
 ) : (
 <Button
 variant="ghost"
 size="icon"
 onClick={(e) => {
 e.stopPropagation();
 handleMarkAsRead(notification.id);
}}
 title="Mark as read"
 >
 <MailOpen className="h-4 w-4" />
 </Button>
 )}
 <Button
 variant="ghost"
 size="icon"
 onClick={(e) => {
 e.stopPropagation();
 handleDelete(notification.id);
}}
 title="Delete"
 >
 <Trash2 className="h-4 w-4 text-error" />
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
