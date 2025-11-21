/**
 * Social Feed Page - UI Rebuild
 * Alias for main social page
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; image?: string };
  likes: number;
  comments: number;
}

export default function SocialFeedPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ posts: Post[] }>('/api/social/feed');
        if (response.data?.posts) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <H1>Social Feed</H1>
          <Button>Create Post</Button>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={post.author.image}
                    fallback={getInitials(post.author.name)}
                    size="md"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{post.author.name}</CardTitle>
                    <Caption className="text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Caption>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Body className="mb-4">{post.content}</Body>
                <div className="flex items-center gap-6">
                  <Button variant="ghost" size="sm">
                    ♥ {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    💬 {post.comments}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
