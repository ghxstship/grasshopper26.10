/**
 * Blog Post Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useParams } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
}

export default function BlogPostPage() {
  const [loading, setLoading] = React.useState(true);
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const params = useParams();

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ post: BlogPost }>(`/api/blog/${params.slug}`);
        if (response.data?.post) {
          setPost(response.data.post);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

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
          <H1 className="mb-4">Post Not Found</H1>
          <Body className="text-gray-600">The blog post you&apos;re looking for doesn&apos;t exist.</Body>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <H1 className="mb-4">{post.title}</H1>
          <Body className="text-gray-600">
            By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
          </Body>
        </div>

        {post.coverImage && (
          <div className="mb-12 aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card>
          <CardContent className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
        </Card>

        <div className="mt-12">
          <H2 className="mb-6">Related Posts</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Related Post 1</CardTitle>
              </CardHeader>
              <CardContent>
                <Body className="text-gray-600">Coming soon</Body>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Related Post 2</CardTitle>
              </CardHeader>
              <CardContent>
                <Body className="text-gray-600">Coming soon</Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
