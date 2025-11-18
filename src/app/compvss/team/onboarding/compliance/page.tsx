'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, FileCheck, Calendar } from 'lucide-react';
import { useTeam } from '@/lib/hooks/compvss/useTeam';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'pending' | 'expired' | 'not-required';
  expiryDate?: string;
  lastChecked?: string;
  required: boolean;
}

export default function ComplianceTrackingPage() {
  const { data } = useTeam();
  const [complianceItems] = useState<ComplianceItem[]>((data as { complianceItems?: ComplianceItem[] })?.complianceItems || [
    {
      id: '1',
      title: 'Background Check',
      description: 'Criminal background verification',
      status: 'compliant',
      lastChecked: '2024-11-01',
      required: true,
    },
    {
      id: '2',
      title: 'Safety Certification',
      description: 'OSHA safety training certification',
      status: 'compliant',
      expiryDate: '2025-06-15',
      required: true,
    },
    {
      id: '3',
      title: 'Drug Screening',
      description: 'Pre-employment drug test',
      status: 'pending',
      required: true,
    },
    {
      id: '4',
      title: 'Insurance Verification',
      description: 'Liability insurance coverage',
      status: 'compliant',
      expiryDate: '2025-12-31',
      required: true,
    },
    {
      id: '5',
      title: 'Equipment License',
      description: 'Heavy equipment operation license',
      status: 'expired',
      expiryDate: '2024-10-01',
      required: false,
    },
    {
      id: '6',
      title: 'First Aid Training',
      description: 'CPR and first aid certification',
      status: 'not-required',
      required: false,
    },
  ]);

  const compliantCount = complianceItems.filter(i => i.status === 'compliant' && i.required).length;
  const totalRequired = complianceItems.filter(i => i.required).length;
  const pendingCount = complianceItems.filter(i => i.status === 'pending').length;
  const expiredCount = complianceItems.filter(i => i.status === 'expired').length;

  const getStatusIcon = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-error" />;
      case 'pending':
        return <FileCheck className="w-5 h-5 text-warning" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ComplianceItem['status']) => {
    const variants: Record<ComplianceItem['status'], 'success' | 'warning' | 'error' | 'default'> = {
      compliant: 'success',
      pending: 'warning',
      expired: 'error',
      'not-required': 'default',
    };
    const labels: Record<ComplianceItem['status'], string> = {
      compliant: 'Compliant',
      pending: 'Pending',
      expired: 'Expired',
      'not-required': 'Not Required',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isCompliant = compliantCount === totalRequired && pendingCount === 0 && expiredCount === 0;

  return (
    <CompvssLayout>
      <ContentLayout
        title="Compliance Tracking"
        description="Monitor your compliance status and requirements"
        variant="compvss"
        showToolbar={false}
        
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card variant="compvss" className="bg-success-light0/10 border-success/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm text-gray-400 font-share-tech mb-1">Compliant</p>
                    <p className="text-h3 font-bebas text-success">{compliantCount}/{totalRequired}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-warning/10 border-warning/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm text-gray-400 font-share-tech mb-1">Pending</p>
                    <p className="text-h3 font-bebas text-warning">{pendingCount}</p>
                  </div>
                  <FileCheck className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-error/10 border-destructive/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm text-gray-400 font-share-tech mb-1">Expired</p>
                    <p className="text-h3 font-bebas text-error">{expiredCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-error" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Status */}
          <Card variant="compvss" className={`mb-6 ${isCompliant ? 'bg-success-light0/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {isCompliant ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    <div>
                      <h3 className="font-oswald text-white mb-1">Fully Compliant</h3>
                      <p className="text-body-sm text-gray-400 font-share-tech">
                        All required compliance items are up to date. You&apos;re cleared to work!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
                    <div>
                      <h3 className="font-oswald text-white mb-1">Action Required</h3>
                      <p className="text-body-sm text-gray-400 font-share-tech">
                        Please complete all pending items to maintain compliance status.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Items List */}
          <div className="space-y-4 mb-6">
            {complianceItems.map((item) => (
              <Card key={item.id} variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-oswald text-white">{item.title}</h3>
                          {item.required && (
                            <Badge variant="error" className="text-caption">Required</Badge>
                          )}
                        </div>
                        <p className="text-body-sm text-gray-400 font-share-tech mb-2">
                          {item.description}
                        </p>
                        
                        {/* Dates */}
                        <div className="flex flex-wrap gap-4 text-caption text-gray-500 font-share-tech">
                          {item.expiryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Expires: {formatDate(item.expiryDate)}</span>
                            </div>
                          )}
                          {item.lastChecked && (
                            <div className="flex items-center gap-1">
                              <FileCheck className="w-3 h-3" />
                              <span>Last checked: {formatDate(item.lastChecked)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Action Buttons */}
                  {item.status === 'pending' && (
                    <Button variant="compvss" size="sm" className="w-full">
                      Complete Now
                    </Button>
                  )}
                  {item.status === 'expired' && (
                    <Button variant="compvss" size="sm" className="w-full bg-error hover:bg-destructive">
                      Renew Now
                    </Button>
                  )}
                  {item.status === 'compliant' && (
                    <Button variant="compvss-outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/compvss/team/onboarding/approval" className="flex-1">
              <Button 
                variant="compvss" 
                size="lg" 
                className="w-full"
                disabled={!isCompliant}
              >
                Submit for Approval
              </Button>
            </Link>
            <Link href="/compvss/dashboard">
              <Button variant="compvss-outline" size="lg">
                Save & Exit
              </Button>
            </Link>
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
