'use client';

import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Avatar} from '@/components/atoms/Avatar';
import { Badge} from '@/components/atoms/Badge';
import { PageTitle, SubsectionHeader, BodyText, BodyTextSmall, Metadata} from '@/components/atoms/Typography';
import { User, Settings, Camera, Mail, Calendar, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link';

export default function ProfilePage() {
 // Mock user data
 const user = {
 name: 'John Doe',
 username: '@johndoe',
 email: 'john.doe@example.com',
 bio: 'Event enthusiast and community organizer. Passionate about bringing people together through amazing experiences.',
 location: 'San Francisco, CA',
 website: 'https://johndoe.com',
 joinDate: 'January 2024',
 avatar: '/default-avatar.jpg',
 stats: {
 eventsAttended: 42,
 eventsCreated: 8,
 followers: 156,
 following: 89,
},
};

 return (
 <GvtewayLayout>
 <ContentLayout
 title="My Profile"
 description="View and manage your profile information"
 breadcrumbs={[
 { label:"Home", href:"/home"},
 { label:"Profile"}
 ]}
 variant="gvteway"
 >
 <div className="max-w-5xl mx-auto space-y-6">
 {/* Profile Header Card */}
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex flex-col md:flex-row gap-6">
 <div className="flex flex-col items-center md:items-start gap-4">
 <Avatar
 src={user.avatar}
 alt={user.name}
 fallback={user.name}
 size="2xl"
 />
 <Link href="/profile/avatar">
 <Button variant="outline" size="sm">
 <Camera className="h-4 w-4 me-2" />
 Change Avatar
 </Button>
 </Link>
 </div>

 <div className="flex-1 space-y-4">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <PageTitle className="mb-0">{user.name}</PageTitle>
 <Badge variant="default">Verified</Badge>
 </div>
 <Metadata>{user.username}</Metadata>
 </div>

 <BodyText>{user.bio}</BodyText>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div className="flex items-center gap-2">
 <Mail className="h-4 w-4" />
 <BodyTextSmall className="mb-0">{user.email}</BodyTextSmall>
 </div>
 <div className="flex items-center gap-2">
 <MapPin className="h-4 w-4" />
 <BodyTextSmall className="mb-0">{user.location}</BodyTextSmall>
 </div>
 <div className="flex items-center gap-2">
 <ExternalLink className="h-4 w-4" />
 <a
 href={user.website}
 target="_blank"
 rel="noopener noreferrer"
 className="text-gvteway-red-500 hover:underline"
 >
 <BodyTextSmall className="mb-0">{user.website}</BodyTextSmall>
 </a>
 </div>
 <div className="flex items-center gap-2">
 <Calendar className="h-4 w-4" />
 <BodyTextSmall className="mb-0">Joined {user.joinDate}</BodyTextSmall>
 </div>
 </div>

 <div className="flex gap-4 pt-2">
 <Link href="/profile/settings">
 <Button variant="gvteway">
 <Settings className="h-4 w-4 me-2" />
 Edit Profile
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Stats Grid */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <Card variant="gvteway">
 <CardContent className="pt-6 text-center">
 <SubsectionHeader className="mb-2">
 {user.stats.eventsAttended}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Events Attended
 </BodyTextSmall>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6 text-center">
 <SubsectionHeader className="mb-2">
 {user.stats.eventsCreated}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Events Created
 </BodyTextSmall>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6 text-center">
 <SubsectionHeader className="mb-2">
 {user.stats.followers}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Followers
 </BodyTextSmall>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6 text-center">
 <SubsectionHeader className="mb-2">
 {user.stats.following}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Following
 </BodyTextSmall>
 </CardContent>
 </Card>
 </div>

 {/* Quick Actions */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Quick Actions</CardTitle>
 <CardDescription>
 Manage your profile and account settings
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <Link href="/profile/avatar" className="block">
 <div className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-gvteway-red-500 transition-colors cursor-pointer">
 <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gvteway-red-100">
 <Camera className="h-6 w-6 text-gvteway-red-600" />
 </div>
 <div className="flex-1">
 <SubsectionHeader className="mb-1">Avatar Management</SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Upload and manage your profile picture
 </BodyTextSmall>
 </div>
 </div>
 </Link>

 <Link href="/profile/settings" className="block">
 <div className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-gvteway-red-500 transition-colors cursor-pointer">
 <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gvteway-red-100">
 <Settings className="h-6 w-6 text-gvteway-red-600" />
 </div>
 <div className="flex-1">
 <SubsectionHeader className="mb-1">Account Settings</SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Update your preferences and security
 </BodyTextSmall>
 </div>
 </div>
 </Link>

 <Link href="/events" className="block">
 <div className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-gvteway-red-500 transition-colors cursor-pointer">
 <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gvteway-red-100">
 <Calendar className="h-6 w-6 text-gvteway-red-600" />
 </div>
 <div className="flex-1">
 <SubsectionHeader className="mb-1">My Events</SubsectionHeader>
 <BodyTextSmall className="mb-0">
 View events you&apos;ve created or attended
 </BodyTextSmall>
 </div>
 </div>
 </Link>

 <Link href="/profile/settings" className="block">
 <div className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-gvteway-red-500 transition-colors cursor-pointer">
 <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gvteway-red-100">
 <User className="h-6 w-6 text-gvteway-red-600" />
 </div>
 <div className="flex-1">
 <SubsectionHeader className="mb-1">Privacy Settings</SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Control your privacy and security options
 </BodyTextSmall>
 </div>
 </div>
 </Link>
 </div>
 </CardContent>
 </Card>

 {/* Recent Activity */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Recent Activity</CardTitle>
 <CardDescription>
 Your latest actions on the platform
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {[
 {
 action: 'Attended event',
 title: 'Tech Conference 2024',
 time: '2 hours ago',
},
 {
 action: 'Created event',
 title: 'Community Meetup',
 time: '1 day ago',
},
 {
 action: 'Updated profile',
 title: 'Changed avatar',
 time: '3 days ago',
},
 ].map((activity, index) => (
 <div
 key={index}
 className="flex items-center gap-4 p-3 rounded-lg border"
 >
 <div className="flex-1">
 <SubsectionHeader className="mb-1">{activity.action}</SubsectionHeader>
 <BodyTextSmall className="mb-0">
 {activity.title}
 </BodyTextSmall>
 </div>
 <Metadata>{activity.time}</Metadata>
 </div>
 ))}
 </div>
 </CardContent>
 <CardFooter>
 <Button variant="outline" className="w-full"
 onClick={() => alert('View all activity functionality coming soon')}
 >
 View All Activity
 </Button>
 </CardFooter>
 </Card>
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
