'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Link as LinkIcon, Settings, Share2, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useSocialFeed } from '@/lib/hooks/gvteway/useSocial';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'media'>('posts');
  const { data: socialData, isLoading, error, refetch } = useSocialFeed();

  const profile = socialData?.profile || {
    name: 'Sarah Johnson',
    username: '@sarahj',
    bio: 'Music lover 🎵 | Festival enthusiast | Living for the next adventure',
    location: 'New York, NY',
    joined: 'Joined March 2024',
    website: 'sarahjohnson.com',
    stats: {
      posts: 156,
      followers: 2847,
      following: 1234,
      events: 42,
    },
  };

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading profile...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Profile</h2>
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
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Cover Image */}
              <div className="h-64 bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20 rounded-xl mb-6" />

              {/* Profile Header */}
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="absolute -top-20 left-6">
                  <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-black" />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mb-16">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Link href="/gvteway/social/profile/edit">
                    <Button variant="gvteway" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                {/* Profile Info */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bebas text-white mb-1">{profile.name}</h1>
                  <p className="text-gray-400 mb-4">{profile.username}</p>
                  <p className="text-white mb-4">{profile.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </div>
                    <div className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-1" />
                      <a href={`https://${profile.website}`} className="text-gvteway-red-500 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {profile.joined}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-6">
                  <div>
                    <span className="text-white font-bold">{profile.stats.posts}</span>
                    <span className="text-gray-400 ml-1">Posts</span>
                  </div>
                  <Link href="/gvteway/social/followers">
                    <div className="cursor-pointer hover:text-gvteway-red-500">
                      <span className="text-white font-bold">{profile.stats.followers.toLocaleString()}</span>
                      <span className="text-gray-400 ml-1">Followers</span>
                    </div>
                  </Link>
                  <Link href="/gvteway/social/following">
                    <div className="cursor-pointer hover:text-gvteway-red-500">
                      <span className="text-white font-bold">{profile.stats.following.toLocaleString()}</span>
                      <span className="text-gray-400 ml-1">Following</span>
                    </div>
                  </Link>
                  <div>
                    <span className="text-white font-bold">{profile.stats.events}</span>
                    <span className="text-gray-400 ml-1">Events Attended</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-800">
                  {(['posts', 'events', 'media'] as const).map((tab) => (
                    <Button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      variant={activeTab === tab ? 'gvteway' : 'ghost'}
                      size="sm"
                      className="capitalize"
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="mt-6">
                {activeTab === 'posts' && (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <p className="text-white mb-4">
                            Sample post content {i}. This is where the user&apos;s posts would appear.
                          </p>
                          <div className="flex items-center gap-6 text-gray-400 text-sm">
                            <span>24 likes</span>
                            <span>5 comments</span>
                            <span>2 hours ago</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <Badge variant="gvteway" className="mb-3">Attended</Badge>
                          <h3 className="text-xl font-bebas text-white mb-2">Event Name {i}</h3>
                          <p className="text-gray-400 text-sm">June 15, 2025</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gray-800 rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
