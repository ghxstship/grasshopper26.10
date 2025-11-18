'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Shield, Download, Eye, Calendar, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState as _useState } from 'react';
import { Button } from '@/components/atoms/Button';

interface InsurancePolicy {
  id: string;
  title: string;
  provider: string;
  type: string;
  policyNumber: string;
  effectiveDate: string;
  expiryDate: string;
  coverage: number;
  status: 'active' | 'expiring-soon' | 'expired';
}

export default function InsurancePage() {
  const { documents: policies, isLoading, error } = useDocuments('insurance');

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="INSURANCE POLICIES"
          description="Loading policies..."
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Insurance' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error || !policies) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="INSURANCE POLICIES"
          description="Error loading policies"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Insurance' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const typedPolicies = policies as any[];

  const getStatusColor = (status: InsurancePolicy['status']) => {
    switch (status) {
      case 'active':
        return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'expiring-soon':
        return 'bg-warning-light text-warning border-warning-border';
      case 'expired':
        return 'bg-error-light text-error border-error-border';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: InsurancePolicy['status']) => {
    switch (status) {
      case 'active':
        return <Shield className="w-4 h-4" />;
      case 'expiring-soon':
        return <AlertCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="INSURANCE POLICIES"
        description="Manage event and production insurance coverage"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Insurance' }
        ]}
        actions={[
          {
            label: 'Add Policy',
            onClick: () => {},
            icon: <Plus className="w-4 h-4" />,
            variant: 'atlvs' as const
          }
        ]}
      >
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Total Policies</div>
                <div className="text-h3 font-bebas atlvs-text-gradient">
                  {typedPolicies.length}
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Active</div>
                <div className="text-h3 font-bebas text-atlvs-green-500">
                  {typedPolicies.filter((p: any) => p.status === 'active').length}
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Expiring Soon</div>
                <div className="text-h3 font-bebas text-warning">
                  {typedPolicies.filter((p: any) => p.status === 'expiring-soon').length}
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Total Coverage</div>
                <div className="text-h3 font-bebas atlvs-text-gradient">
                  ${(typedPolicies.reduce((sum: number, p: any) => sum + (p.coverage || 0), 0) / 1000000).toFixed(1)}M
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Policies List */}
          <div className="space-y-4">
            {typedPolicies.map((policy: any) => (
              <Card key={policy.id} variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-atlvs-green-500/10 border border-atlvs-green-500/20">
                        <Shield className="w-6 h-6 text-atlvs-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-h6">{policy.title}</CardTitle>
                          <Badge variant="atlvs-outline" className={getStatusColor(policy.status)}>
                            {getStatusIcon(policy.status)}
                            <span className="ml-1">{policy.status.replace('-', ' ').toUpperCase()}</span>
                          </Badge>
                        </div>
                        <CardDescription className="mb-3">
                          {policy.provider} • {policy.type}
                        </CardDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Policy Number</div>
                            <div className="font-mono text-caption">{policy.policyNumber}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Effective Date
                            </div>
                            <div>{new Date(policy.effectiveDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Expiry Date
                            </div>
                            <div>{new Date(policy.expiryDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Coverage</div>
                            <div className="font-medium text-atlvs-green-500">
                              ${(policy.coverage / 1000000).toFixed(1)}M
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
