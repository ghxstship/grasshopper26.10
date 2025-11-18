'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Workflow, Plus, Play, Pause, Settings, Clock, CheckCircle2, XCircle, AlertCircle, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useWorkflows } from '@/lib/hooks/atlvs/useAutomation';

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  executions: number;
  lastRun: string;
  successRate: number;
  category: string;
}

export default function AutomationPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: workflows, isLoading, error, refetch } = useWorkflows();

  const categories = ['All', 'GVTEWAY', 'COMPVSS', 'ATLVS'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'paused': return 'bg-warning-light text-warning border-warning-border';
      case 'error': return 'bg-error-light text-error border-error-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const stats = useMemo(() => {
    const workflowList = workflows || [];
    const totalExecutions = workflowList.reduce((sum: number, w: WorkflowItem) => sum + (w.executions || 0), 0);
    const avgSuccessRate = workflowList.length > 0
      ? workflowList.reduce((sum: number, w: WorkflowItem) => sum + (w.successRate || 0), 0) / workflowList.length
      : 0;
    
    return {
      total: workflowList.length,
      active: workflowList.filter((w: WorkflowItem) => w.status === 'active').length,
      paused: workflowList.filter((w: WorkflowItem) => w.status === 'paused').length,
      errors: workflowList.filter((w: WorkflowItem) => w.status === 'error').length,
      totalExecutions,
      avgSuccessRate
    };
  }, [workflows]);

  const filteredWorkflows = useMemo(() => {
    if (!workflows) return [];
    if (selectedCategory === 'All') return workflows;
    return workflows.filter((w: WorkflowItem) => w.category === selectedCategory);
  }, [workflows, selectedCategory]);

  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <p className="text-gray-400">Loading workflows...</p>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Workflows</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
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
        title="N8N AUTOMATION"
        description="Manage workflows and automate processes"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Automation workflow statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Workflows
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`${workflows?.length || 0} total workflows`}>
                    {workflows?.length || 0}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <Workflow className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Active
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas text-atlvs-green-500" aria-label={`${stats.active} active workflows`}>
                    {stats.active}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl" aria-hidden="true">
                  <Zap className="w-6 h-6 text-atlvs-green-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Executions
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`${stats.totalExecutions.toLocaleString()} total executions`}>
                    {stats.totalExecutions.toLocaleString()}
                  </CardTitle>
                </div>
                <div className="p-3 bg-accent/100/10 rounded-xl" aria-hidden="true">
                  <Play className="w-6 h-6 text-atlvs-purple-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Avg Success Rate
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas">
                    {stats.avgSuccessRate.toFixed(1)}%
                  </CardTitle>
                </div>
                <div className="p-3 bg-warning-light0/10 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-atlvs-orange-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'atlvs' : 'ghost'}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
          <Link href="/atlvs/automation/new">
            <Button variant="atlvs" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </Link>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.map((workflow: WorkflowItem, index: number) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/atlvs/automation/${workflow.id}`}>
                <Card 
                  variant="atlvs" 
                  className="bg-gray-900/50 hover:bg-gray-900 transition-all cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Side */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gray-800 rounded-lg">
                          <Workflow className="w-6 h-6 text-atlvs-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-white">
                              {workflow.name}
                            </CardTitle>
                            <Badge variant="atlvs-outline" className="text-caption">
                              {workflow.id}
                            </Badge>
                            <Badge variant="atlvs-outline" className="text-caption">
                              {workflow.category}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-400">
                            {workflow.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-caption text-gray-400 mb-1">Executions</div>
                          <div className="text-h6 font-bebas text-white">
                            {workflow.executions.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-caption text-gray-400 mb-1">Success Rate</div>
                          <div className="text-h6 font-bebas text-atlvs-green-500">
                            {workflow.successRate}%
                          </div>
                        </div>
                        <div className="text-center min-w-[100px]">
                          <div className="text-caption text-gray-400 mb-1">Last Run</div>
                          <div className="text-body-sm text-white flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {workflow.lastRun}
                          </div>
                        </div>
                        <Badge 
                          variant="atlvs-outline"
                          className={getStatusColor(workflow.status)}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(workflow.status)}
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </span>
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
