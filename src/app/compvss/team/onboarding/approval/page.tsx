'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, FileText, Shield, User,  } from 'lucide-react';
import { useTeam } from '@/lib/hooks/compvss/useTeam';
import Link from 'next/link';

import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

export default function ApprovalWorkflowPage() { 
  const { data,  } = useTeam();
  const approvalSteps = (data as any)?.approvalSteps || [
    {
      id: '1',
      title: 'Profile Review',
      description: 'Basic information and role verification',
      status: 'completed' as const,
      reviewer: 'System',
      completedAt: '2024-11-10',
    },
    {
      id: '2',
      title: 'Credentials Verification',
      description: 'Document authenticity and validity check',
      status: 'completed' as const,
      reviewer: 'HR Team',
      completedAt: '2024-11-12',
    },
    {
      id: '3',
      title: 'Training Completion',
      description: 'Required training modules assessment',
      status: 'completed' as const,
      reviewer: 'Training Dept',
      completedAt: '2024-11-13',
    },
    {
      id: '4',
      title: 'Compliance Check',
      description: 'Final compliance and background verification',
      status: 'in-progress' as const,
      reviewer: 'Compliance Officer',
    },
    {
      id: '5',
      title: 'Manager Approval',
      description: 'Department manager final approval',
      status: 'pending' as const,
      reviewer: 'Production Manager',
    },
  ];

  const completedSteps = approvalSteps.filter(s => s.status === 'completed').length;
  const totalSteps = approvalSteps.length;
  const currentStep = approvalSteps.find(s => s.status === 'in-progress');

  const getStatusBadge = (status: 'completed' | 'in-progress' | 'pending') => {
    const variants = {
      completed: 'success' as const,
      'in-progress': 'warning' as const,
      pending: 'default' as const,
    };
    const labels = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      pending: 'Pending',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Approval Workflow"
        description="Track your onboarding approval progress"
        variant="compvss"
        showToolbar={false}
        
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Overview */}
          <Card variant="compvss" className="mb-6 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-compvss-cyan-500" />
                  <div>
                    <h3 className="font-oswald text-white text-h6">Approval Progress</h3>
                    <p className="text-body-sm text-gray-400 font-share-tech">
                      {completedSteps} of {totalSteps} steps completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-h3 font-bebas text-compvss-cyan-500">
                    {Math.round((completedSteps / totalSteps) * 100)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          {currentStep && (
            <Card variant="compvss" className="mb-6 bg-warning/10 border-warning/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-warning flex-shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h3 className="font-oswald text-white mb-1">Currently Under Review</h3>
                    <p className="text-body-sm text-gray-400 font-share-tech mb-2">
                      {currentStep.title} - {currentStep.description}
                    </p>
                    <p className="text-caption text-gray-500 font-share-tech">
                      Reviewer: {currentStep.reviewer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval Steps */}
          <div className="space-y-4 mb-6">
            {approvalSteps.map((step, index) => (
              <Card key={step.id} variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Step Number & Icon */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bebas text-h6 ${
                        step.status === 'completed' 
                          ? 'bg-success-light text-success' 
                          : step.status === 'in-progress'
                          ? 'bg-warning-light text-warning'
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      {index < approvalSteps.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          step.status === 'completed' ? 'bg-success-light0' : 'bg-gray-800'
                        }`} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-oswald text-white mb-1">{step.title}</h3>
                          <p className="text-body-sm text-gray-400 font-share-tech mb-2">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-4 text-caption text-gray-500 font-share-tech">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{step.reviewer}</span>
                            </div>
                            {step.completedAt && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>Completed: {new Date(step.completedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(step.status)}
                      </div>

                      {/* Status-specific messages */}
                      {step.status === 'completed' && (
                        <div className="bg-success-light0/10 border border-success/30 rounded-lg p-3 mt-3">
                          <p className="text-body-sm text-success font-share-tech flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Approved and verified
                          </p>
                        </div>
                      )}
                      {step.status === 'in-progress' && (
                        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mt-3">
                          <p className="text-body-sm text-warning font-share-tech">
                            Under review. Estimated completion: 1-2 business days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Card */}
          <Card variant="compvss" className="mb-6 bg-compvss-cyan-500/10 border-compvss-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-compvss-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-oswald text-white mb-1">What&apos;s Next?</h3>
                  <p className="text-body-sm text-gray-400 font-share-tech mb-2">
                    Once all approval steps are completed, you&apos;ll receive an email notification and gain full access to the COMPVSS platform.
                  </p>
                  <p className="text-body-sm text-gray-400 font-share-tech">
                    Questions? Contact our support team at support@compvss.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/compvss/dashboard" className="flex-1">
              <Button variant="compvss" size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Button variant="compvss-outline" size="lg">
              Contact Support
            </Button>
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
