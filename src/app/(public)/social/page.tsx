/**
 * Social Page - UI Rebuild
 * Community hub and social features
 */

'use client';

import * as React from 'react';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { apiClient } from '@/lib/api/client';
import { Heart, MessageCircle, Share2, Users, TrendingUp } from 'lucide-react';

interface Post {
  id: string;
  author: { name: string; username: string; avatar?: string };
  content: string;
  event?: { name: string; id: string };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

interface TrendingTopic {
  id: string;
  tag: string;
  posts: number;
}

export default function SocialPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [trending, setTrending] = React.useState<TrendingTopic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('feed');

  React.useEffect(() => {
    const fetchSocialData = async () => {
      try {
        setLoading(true);
        const [postsRes, trendingRes] = await Promise.all([
          apiClient.get<{ posts: Post[] }>('/api/social/feed'),
          apiClient.get<{ trending: TrendingTopic[] }>('/api/social/trending'),
        ]);
        if (postsRes.data?.posts) setPosts(postsRes.data.posts);
        if (trendingRes.data?.trending) setTrending(trendingRes.data.trending);
      } catch (error) {
        console.error('Failed to fetch social data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      await apiClient.post(`/api/social/posts/${postId}/like`);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <Hero>SOCIAL HUB</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Connect with fellow event-goers, share experiences, and discover what&apos;s trending.
            </Body>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="feed">
                <TabsList className="mb-6">
                  <TabsTrigger value="feed">For You</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>

                <TabsContent value="feed">
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                              {post.author.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <H3 className="text-base">{post.author.name}</H3>
                              <Caption className="text-gray-600">@{post.author.username}</Caption>
                              <Caption className="text-gray-500">
                                {new Date(post.timestamp).toLocaleDateString()}
                              </Caption>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Body className="mb-4">{post.content}</Body>
                          {post.event && (
                            <Badge variant="outline">🎫 {post.event.name}</Badge>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={post.liked ? 'text-red-600' : ''}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${post.liked ? 'fill-red-600' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.shares}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="following">
                  <Card>
                    <CardContent className="py-24 text-center">
                      <Users className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                      <H3 className="mb-4">Follow People to See Their Posts</H3>
                      <Body className="text-gray-600 mb-8">Start following other event-goers to see their updates here</Body>
                      <Button>Discover People</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events">
                  <Card>
                    <CardContent className="py-24 text-center">
                      <H3 className="mb-4">Event Discussions</H3>
                      <Body className="text-gray-600">Join conversations about upcoming events</Body>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <CardTitle>Trending</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trending.map((topic, index) => (
                    <div key={topic.id} className="flex items-center justify-between">
                      <div>
                        <H3 className="text-base">#{topic.tag}</H3>
                        <Caption className="text-gray-600">{topic.posts} posts</Caption>
                      </div>
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Suggested Connections */}
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div>
                          <H3 className="text-sm">User {i}</H3>
                          <Caption className="text-gray-600">@user{i}</Caption>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary">Follow</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}