'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { useIssues } from '@/lib/hooks/compvss/useIssues';

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  status: 'unassigned' | 'assigned' | 'in-progress' | 'resolved';
  assignedTo?: string;
  submittedBy: string;
  submittedAt: string;
}

export default function IssueRoutingPage() {
  const queryClient = useQueryClient();
  const { data: issuesData } = useIssues() as any;
  
  // Transform API data to match component interface
  const issues = useMemo(() => {
    if (!issuesData?.issues) return [];
    return issuesData.issues.map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description || '',
      priority: issue.priority?.toLowerCase() || 'medium',
      category: issue.category || 'General',
      status: issue.status?.toLowerCase().replace('_', '-') || 'unassigned',
      assignedTo: issue.assignedTo?.name,
      submittedBy: issue.createdBy?.name || 'Unknown',
      submittedAt: issue.createdAt
    }));
  }, [issuesData]);
  
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [assignTo, setAssignTo] = useState('');

  const assignIssueMutation = useMutation({
    mutationFn: async (data: { issueId: string, assignTo: string }) => {
      const response = await fetch('/api/compvss/issues/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to assign issue');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      setSelectedIssue(null);
      setAssignTo('');
    },
  });

  const teams = [
    'Technical Team',
    'Facilities Team',
    'Security Team',
    'Hospitality Team',
    'Production Team',
    'Medical Team',
  ];

  const handleAssign = (issueId: string) => {
    if (assignTo) {
      assignIssueMutation.mutate({ issueId, assignTo });
    }
  };

  const getPriorityBadge = (priority: Issue['priority']) => {
    const config = {
      low: { variant: 'default' as const, label: 'Low' },
      medium: { variant: 'warning' as const, label: 'Medium' },
      high: { variant: 'error' as const, label: 'High' },
      critical: { variant: 'error' as const, label: 'Critical' },
    };
    return <Badge variant={config[priority].variant}>{config[priority].label}</Badge>;
  };

  const getStatusBadge = (status: Issue['status']) => {
    const config = {
      unassigned: { variant: 'default' as const, label: 'Unassigned' },
      assigned: { variant: 'warning' as const, label: 'Assigned' },
      'in-progress': { variant: 'warning' as const, label: 'In Progress' },
      resolved: { variant: 'success' as const, label: 'Resolved' },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Issue Assignment & Routing"
        description="Assign issues to appropriate teams"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'Issues', href: '/compvss/issues/dashboard' },
          { label: 'Routing' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card variant="compvss" className="bg-gray-900/80 border-compvss-cyan-500/20">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-white">{issues.length}</p>
                <p className="text-sm text-gray-400 font-oswald">Total</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-_error/10 border-red-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-_error">
                  {issues.filter(i => i.status === 'unassigned').length}
                </p>
                <p className="text-sm text-gray-400 font-oswald">Unassigned</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-warning/10 border-yellow-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-warning">
                  {issues.filter(i => i.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-400 font-oswald">In Progress</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-green-500/10 border-green-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-success">
                  {issues.filter(i => i.status === 'resolved').length}
                </p>
                <p className="text-sm text-gray-400 font-oswald">Resolved</p>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue.id} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-1 ${
                        issue.priority === 'critical' || issue.priority === 'high' ? 'text-_error' : 'text-warning'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-white">{issue.title}</CardTitle>
                          <Badge variant="default" className="text-xs">{issue.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 font-share-tech mb-2">
                          {issue.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-share-tech">
                          <span>Category: {issue.category}</span>
                          <span>•</span>
                          <span>Submitted by: {issue.submittedBy}</span>
                          <span>•</span>
                          <span>{new Date(issue.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getPriorityBadge(issue.priority)}
                      {getStatusBadge(issue.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {issue.status === 'unassigned' ? (
                    selectedIssue === issue.id ? (
                      <div className="flex gap-2">
                        <Select
                          value={assignTo}
                          onChange={(e) => setAssignTo(e.target.value)}
                          variant="compvss"
                          className="flex-1"
                        >
                          <option value="">Select team...</option>
                          {teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                          ))}
                        </Select>
                        <Button
                          variant="compvss"
                          size="sm"
                          onClick={() => handleAssign(issue.id)}
                          disabled={!assignTo}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Assign
                        </Button>
                        <Button
                          variant="compvss-outline"
                          size="sm"
                          onClick={() => setSelectedIssue(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="compvss"
                        size="sm"
                        onClick={() => setSelectedIssue(issue.id)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Assign to Team
                      </Button>
                    )
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-share-tech">
                        <User className="w-4 h-4" />
                        <span>Assigned to: {issue.assignedTo}</span>
                      </div>
                      {issue.status === 'resolved' && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
