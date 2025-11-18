'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { useMemo } from 'react';

interface AdvancingRequest {
  id: string;
  status: string;
  title?: string;
  project?: string;
  requestedAt?: string;
  [key: string]: unknown;
}

interface TimelineEvent {
  id: string;
  title?: string;
  date: string;
  time: string;
  status: string;
  project?: string;
}

export default function AdvancingTimelinePage() {
  const { data: requests, isLoading, error, refetch } = useAdvancingRequests();
  
  // Transform requests into timeline events
  const events = useMemo(() => {
    if (!requests) return [];
    
    const typedRequests = requests as AdvancingRequest[];
    return typedRequests
      .map((req: AdvancingRequest) => ({
        id: req.id,
        title: req.title,
        date: req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'N/A',
        time: req.requestedAt ? new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        status: req.status === 'approved' ? 'completed' : 
                req.status === 'pending' ? 'pending' : 
                req.status === 'under-review' ? 'pending' : 'completed',
        project: req.project
      }))
      .sort((a: TimelineEvent, b: TimelineEvent) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [requests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'pending': return 'bg-warning-light text-warning border-warning-border';
      case 'upcoming': return 'bg-info-light text-info border-info-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ADVANCING TIMELINE"
        description="Track production milestones"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'Timeline' }
        ]}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        ) : error ? (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                <h3 className="text-lg font-bebas mb-2">Failed to Load Timeline</h3>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2" id="timeline-heading">
                <Clock className="w-5 h-5" aria-hidden="true" />
                Event Timeline ({events.length})
              </CardTitle>
              {events.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No timeline events yet</p>
                </div>
              ) : (
                <div className="space-y-4" role="list" aria-labelledby="timeline-heading">
                  {events.map((event: TimelineEvent, index: number) => (
                    <div key={event.id} className="flex items-start gap-4" role="listitem">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          event.status === 'completed' ? 'bg-atlvs-green-500' :
                          event.status === 'pending' ? 'bg-warning' :
                          'bg-info'
                        }`} aria-hidden="true" />
                        {index < events.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-700 my-2" aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium mb-1">{event.title}</div>
                            <div className="text-sm text-gray-400">{event.date} at {event.time}</div>
                            {event.project && (
                              <div className="text-xs text-gray-500 mt-1">{event.project}</div>
                            )}
                          </div>
                          <Badge variant="atlvs-outline" className={getStatusColor(event.status)} role="status" aria-label={`Status: ${event.status}`}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
