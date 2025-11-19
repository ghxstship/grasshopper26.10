'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, MessageSquare, Paperclip, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Textarea } from '@/components/atoms/Textarea';
import { useAdvancingRequest, useAddComment, useApproveRequest, useRejectRequest } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { useToast } from '@/lib/hooks/useToast';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/advancing/[id]

// API: /api/atlvs/advancing/:id
const API_ENDPOINT = '/api/atlvs/advancing/:id';

export default function AdvancingDetailPage({ params }: { params: { id: string } }) {
  // Data fetching with React Query
  const { data: request, isLoading, error, refetch } = useAdvancingRequest(params.id);
  const addCommentMutation = useAddComment();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();
  const { addToast } = useToast();

  // Local state
  const [commentText, setCommentText] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'pending': return 'bg-warning-light text-warning border-warning-border';
      case 'rejected': return 'bg-error-light text-error border-error-border';
      case 'under-review': return 'bg-info-light text-info border-info-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  const _getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error-light text-error border-error-border';
      case 'high': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      case 'medium': return 'bg-warning-light text-warning border-warning-border';
      case 'low': return 'bg-info-light text-info border-info-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  // Event handlers
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addCommentMutation.mutateAsync({
        requestId: params.id,
        content: commentText,
      });
      setCommentText('');
      addToast({
        title: 'Success',
        description: 'Comment added successfully',
        variant: 'success',
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'error',
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(params.id);
      addToast({
        title: 'Success',
        description: 'Request approved successfully',
        variant: 'success',
      });
      refetch();
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to approve request',
        variant: 'error',
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        id: params.id,
        reason: decisionNotes,
      });
      addToast({
        title: 'Success',
        description: 'Request rejected',
        variant: 'success',
      });
      setDecisionNotes('');
      refetch();
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'error',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <BodyText className="text-grey-400">Loading request details...</BodyText>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  // Error state
  if (error || !request) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Request</SectionHeader>
            <p className="text-grey-400 mb-4">{error?.message || 'Request not found'}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title={request.title}
        description={`${request.type} • ${request.project}`}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: request.title }
        ]}
        actions={[
          {
            label: approveMutation.isPending ? 'Approving...' : 'Approve',
            onClick: handleApprove,
            disabled: approveMutation.isPending || request.status === 'approved',
            variant: 'atlvs' as const
          },
          {
            label: rejectMutation.isPending ? 'Rejecting...' : 'Reject',
            onClick: handleReject,
            disabled: rejectMutation.isPending || request.status === 'rejected',
            variant: 'atlvs' as const
          }
        ]}
      >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Request Details</CardTitle>
                <p className="text-grey-300 mb-6">{request.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(request.details).map(([key, value]) => (
                    <div key={key} className="p-3 bg-grey-800/50 rounded-lg">
                      <div className="text-body-sm text-grey-400 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="font-medium">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Timeline */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Request Timeline</CardTitle>
                <div className="space-y-4">
                  {request.timeline.map((event: any, index: number) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${ index === request.timeline.length - 1 ? 'bg-atlvs-green-500' : 'bg-grey-600' }`} />
                        {index < request.timeline.length - 1 && (
                          <div className="absolute top-3 left-1.5 w-0.5 h-full bg-grey-700" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {event.status.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                          <Badge variant="atlvs-outline" className="bg-grey-700/50 text-caption">
                            {event.user}
                          </Badge>
                        </div>
                        <div className="text-body-sm text-grey-400 mb-1">
                          {new Date(event.date).toLocaleString()}
                        </div>
                        <div className="text-body-sm text-grey-300">{event.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Comments */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({request.comments.length})
                </CardTitle>
                <div className="space-y-4">
                  {request.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center">
                        {comment.user.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user}</span>
                          <span className="text-body-sm text-grey-500">{comment.time}</span>
                        </div>
                        <p className="text-grey-300">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-grey-800">
                    <Textarea
                      placeholder="Add a comment..."
                      rows={3}
                      variant="atlvs"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={isSubmittingComment}
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="atlvs" 
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!commentText.trim() || isSubmittingComment}
                      >
                        {isSubmittingComment ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          'Post Comment'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Info */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Request Info</CardTitle>
                <div className="space-y-4">
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Requested By
                    </div>
                    <div className="font-medium">{request.requestedBy}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Requested
                    </div>
                    <div className="font-medium">{new Date(request.requestedAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </div>
                    <div className="font-medium">{new Date(request.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Attachments */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-4">
                  <Paperclip className="w-5 h-5" />
                  Attachments ({request.attachments.length})
                </CardTitle>
                <div className="space-y-2">
                  {request.attachments.map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-grey-800/50 rounded-lg hover:bg-grey-800 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-body-sm text-grey-400">{file.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Decision */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Make Decision</CardTitle>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add decision notes..."
                    rows={4}
                    variant="atlvs"
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                  />
                  <div className="space-y-2">
                    <Button 
                      variant="atlvs" 
                      size="sm" 
                      className="w-full"
                      onClick={handleApprove}
                      disabled={approveMutation.isPending || request.status === 'approved'}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve Request
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-error"
                      onClick={handleReject}
                      disabled={rejectMutation.isPending || request.status === 'rejected'}
                    >
                      {rejectMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject Request
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
