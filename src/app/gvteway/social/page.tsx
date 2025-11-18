'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Heart, Image, Loader2, MapPin, MessageCircle, Share2, TrendingUp, Users, Video } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useSocialFeed, useLikePost } from '@/lib/hooks/gvteway/useSocial';

export default function SocialFeedPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'following'>('feed');
  
  // Fetch posts with React Query
  const { data: posts = [], isLoading, error, refetch } = useSocialFeed();
  const { mutate: _likePost } = useLikePost();
  
  const filteredPosts = useMemo(() => {
    if (activeTab === 'feed') return posts;
    if (activeTab === 'trending') return posts.filter((p: any) => p.likes > 100);
    if (activeTab === 'following') return posts.filter((p: any) => p.isFollowing);
    return posts;
  }, [posts, activeTab]);
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading feed...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Feed</h2>
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
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Header */}
                  <header className="mb-8">
                    <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient" id="page-title">
                      SOCIAL HUB
                    </h1>
                    <p className="text-xl text-gray-400 font-oswald">
                      Connect with fellow event-goers
                    </p>
                  </header>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6" role="tablist" aria-label="Feed filter tabs">
                    {(['feed', 'trending', 'following'] as const).map((tab) => (
                      <Button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        variant={activeTab === tab ? 'gvteway' : 'ghost'}
                        size="sm"
                        className="rounded-full capitalize"
                        role="tab"
                        aria-selected={activeTab === tab}
                        aria-controls={`${tab}-panel`}
                        aria-label={`Show ${tab} posts`}
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>

                  {/* Create Post Card */}
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm mb-6" role="region" aria-label="Create new post">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <Link href="/gvteway/social/post">
                            <Button variant="ghost" className="w-full text-left px-4 py-3 bg-gray-800 rounded-xl text-gray-400 justify-start" aria-label="Create a new post">
                              What&apos;s on your mind?
                            </Button>
                          </Link>
                          <div className="flex gap-4 mt-4" role="group" aria-label="Post attachment options">
                            <Button variant="ghost" size="sm" className="text-gray-400" aria-label="Add photo">
                              <Image className="w-4 h-4" aria-label="Image" />
                              Photo
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400" aria-label="Add video">
                              <Video className="w-4 h-4 mr-2" aria-hidden="true" />
                              Video
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400" aria-label="Add location check-in">
                              <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                              Check-in
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Posts Feed */}
                  <div className="space-y-6" role="feed" aria-label="Social feed posts" id={`${activeTab}-panel`}>
                    {filteredPosts.map((post: any, index: number) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            {/* Post Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex gap-3">
                                <Link href={`/gvteway/social/profile/${post.user.username}`}>
                                  <div className="w-12 h-12 bg-gray-700 rounded-full cursor-pointer" />
                                </Link>
                                <div>
                                  <Link href={`/gvteway/social/profile/${post.user.username}`}>
                                    <h3 className="text-white font-medium hover:text-gvteway-red-500 cursor-pointer">
                                      {post.user.name}
                                    </h3>
                                  </Link>
                                  <p className="text-gray-400 text-sm">{post.user.username} • {post.timestamp}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                •••
                              </Button>
                            </div>

                            {/* Post Content */}
                            <p className="text-white mb-4">{post.content}</p>

                            {/* Event/Check-in Badge */}
                            {post.event && (
                              <Badge variant="gvteway-outline" className="mb-4">
                                🎫 {post.event}
                              </Badge>
                            )}
                            {post.checkIn && (
                              <Badge variant="gvteway-outline" className="mb-4">
                                📍 {post.checkIn}
                              </Badge>
                            )}

                            {/* Post Image */}
                            {post.image && (
                              <div className="mb-4 rounded-xl overflow-hidden bg-gray-800 aspect-video" />
                            )}

                            {/* Post Actions */}
                            <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
                              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400 hover:text-gvteway-red-500 p-0 h-auto">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm">{post.likes}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400 hover:text-gvteway-blue-500 p-0 h-auto">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">{post.comments}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400 hover:text-success p-0 h-auto">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm">{post.shares}</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Quick View */}
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4" />
                    <h3 className="text-white font-bebas text-xl mb-1">Your Profile</h3>
                    <p className="text-gray-400 text-sm mb-4">@username</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bebas text-white">42</p>
                        <p className="text-xs text-gray-400">Posts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bebas text-white">1.2K</p>
                        <p className="text-xs text-gray-400">Followers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bebas text-white">856</p>
                        <p className="text-xs text-gray-400">Following</p>
                      </div>
                    </div>
                    <Link href="/gvteway/social/profile">
                      <Button variant="gvteway" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Trending Events */}
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-gvteway-red-500" />
                      <h3 className="text-white font-bebas text-lg">Trending Events</h3>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                          <div className="w-12 h-12 bg-gray-800 rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">Event Name {i}</p>
                            <p className="text-gray-400 text-xs">2.5K talking about this</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Users */}
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-gvteway-blue-500" />
                      <h3 className="text-white font-bebas text-lg">Suggested For You</h3>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">User {i}</p>
                              <p className="text-gray-400 text-xs">@user{i}</p>
                            </div>
                          </div>
                          <Button variant="gvteway-outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
