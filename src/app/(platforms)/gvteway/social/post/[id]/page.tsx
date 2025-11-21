/**
 * Post Details Page - UI Rebuild
 * Individual post view with comments
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { H1, H2, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; image?: string };
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; image?: string };
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<Post>(`/api/social/posts/${params.id}`);
        if (response.data) {
          setPost(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Post Not Found</H2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <H1 className="mb-12">Post</H1>

        <Card className="mb-8">
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
            <Body className="text-lg mb-6">{post.content}</Body>
            <Separator className="my-4" />
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm">
                ♥ {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                💬 {post.comments.length}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <H2 className="mb-6">Comments</H2>
          {post.comments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Body className="text-gray-600">No comments yet. Be the first to comment!</Body>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={comment.author.image}
                        fallback={getInitials(comment.author.name)}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Body className="text-sm font-bold">{comment.author.name}</Body>
                          <Caption className="text-gray-500 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Caption>
                        </div>
                        <Body className="text-sm">{comment.content}</Body>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
