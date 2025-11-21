'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText, BodyTextSmall } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/ui-rebuild/atoms/Textarea';

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user?: { name: string };
}

export default function AdvancingCommentsPage({ params }: { params: { id: string } }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const response = await fetch(`/api/atlvs/advancing/${params.id}/comments`);
    if (response.ok) {
      const data = await response.json();
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [params.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/atlvs/advancing/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <H2>Advancing Request Comments</H2>
      
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Add Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter your comment..."
            rows={3}
          />
          <Button variant="atlvs" onClick={handleAddComment} disabled={loading}>
            {loading ? 'Adding...' : 'Add Comment'}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} variant="atlvs">
            <CardContent>
              <BodyText>{comment.content}</BodyText>
              <BodyTextSmall className="mt-2 text-gray-400">
                {comment.user?.name} • {new Date(comment.createdAt).toLocaleDateString()}
              </BodyTextSmall>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
