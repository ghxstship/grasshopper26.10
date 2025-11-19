'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Clock, User, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useIssues } from '@/lib/hooks/compvss/useIssues';
import { Button } from '@/components/atoms/Button';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { BodyText } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/issues/detail/[id]

export default function IssueDetailPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Issues', href: '/compvss/issues/dashboard' },
    { label: 'Issue Detail', href: '/compvss/issues/detail' },
  ];

  return (
    <CompvssLayout>
      <IssueDetailContent />
    </CompvssLayout>
  );
}

function IssueDetailContent() { 
  const { data,  } = useIssues();
  const issue = (data as any)?.issue || {
    id: 'ISS-001',
    title: 'Power outage in Zone B',
    description: 'Complete power loss in the food court area. Multiple vendors affected. Emergency lighting is operational but main power grid is down.',
    category: 'Facility',
    priority: 'critical',
    status: 'in_progress',
    reporter: 'John Smith',
    assignee: 'Mike Chen',
    location: 'Zone B - Food Court',
    created: '2025-06-15 14:32',
    updated: '2025-06-15 15:45',
  };

  const updates = [
    { user: 'Mike Chen', action: 'assigned to this issue', time: '15:45' },
    { user: 'Sarah Johnson', action: 'changed priority to Critical', time: '15:30' },
    { user: 'John Smith', action: 'created this issue', time: '14:32' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="compvss-text-gradient">{issue.id}</h1>
                <Badge variant="compvss" className="bg-error-light text-error border-destructive/30">
                  {issue.priority}
                </Badge>
                <Badge variant="compvss" className="bg-info-light text-info border-info/30">
                  {issue.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-grey-400">{issue.title}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="compvss-outline" size="sm">
                Update Status
              </Button>
              <Button variant="compvss" size="sm">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Resolve
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="compvss" className="bg-grey-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-grey-300 -tech">
                    {issue.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card variant="compvss" className="bg-grey-900/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-compvss-cyan-500" />
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {updates.map((update, index) => (
                      <div key={index} className="flex gap-3 pb-4 border-b border-grey-800 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 flex items-center justify-center text-black text-body-sm flex-shrink-0">
                          {update.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-body-sm text-grey-300 -tech">
                            <span className="text-white">{update.user}</span> {update.action}
                          </p>
                          <p className="text-caption text-grey-500 -tech mt-1">{update.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card variant="compvss" className="bg-grey-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <BodyText className="text-caption text-grey-500 mb-1">Reporter</BodyText>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-grey-400" />
                      <span className="text-body-sm text-white -tech">{issue.reporter}</span>
                    </div>
                  </div>
                  <div>
                    <BodyText className="text-caption text-grey-500 mb-1">Assignee</BodyText>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-grey-400" />
                      <span className="text-body-sm text-white -tech">{issue.assignee}</span>
                    </div>
                  </div>
                  <div>
                    <BodyText className="text-caption text-grey-500 mb-1">Location</BodyText>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-grey-400" />
                      <span className="text-body-sm text-white -tech">{issue.location}</span>
                    </div>
                  </div>
                  <div>
                    <BodyText className="text-caption text-grey-500 mb-1">Category</BodyText>
                    <Badge variant="compvss-outline" className="text-caption">
                      {issue.category}
                    </Badge>
                  </div>
                  <div>
                    <BodyText className="text-caption text-grey-500 mb-1">Created</BodyText>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-grey-400" />
                      <span className="text-body-sm text-white -tech">{issue.created}</span>
                    </div>
                  </div>
                  <div>
                    <BodyText className="text-caption text-grey-500 mb-1">Last Updated</BodyText>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-grey-400" />
                      <span className="text-body-sm text-white -tech">{issue.updated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
