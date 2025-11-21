'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FileText, Download, Eye, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

interface ContractData {
  id: string;
  title: string;
  vendor: string;
  type: string;
  signedDate: string;
  expiryDate: string;
  value: number;
  status: string;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/documents/contracts

export default function ContractsPage() {
  const { isLoading, error, refetch } = useDocuments();
  // TODO: Replace mock data with actual API data once backend is ready
  // const contracts = documents.filter(doc => doc.type === 'contract');

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="CONTRACTS"
          description="Loading contracts..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Contracts' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <BodyText className="text-grey-400">Loading contracts...</BodyText>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="CONTRACTS"
          description="Error loading contracts"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Contracts' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Contracts</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const contracts: ContractData[] = [
    {
      id: '1',
      title: 'Venue Rental Agreement',
      vendor: 'Madison Square Garden',
      type: 'Venue',
      signedDate: '2025-01-15',
      expiryDate: '2025-12-31',
      value: 250000,
      status: 'active'
    },
    {
      id: '2',
      title: 'Catering Services Contract',
      vendor: 'Premium Catering Co',
      type: 'Catering',
      signedDate: '2025-02-01',
      expiryDate: '2025-11-30',
      value: 85000,
      status: 'expiring-soon'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'expiring-soon': return 'bg-warning-light text-warning border-warning-border';
      case 'expired': return 'bg-error-light text-error border-error-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CONTRACT MANAGEMENT"
        description="Track and manage vendor contracts"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Contracts' }
        ]}
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Total Contracts
                  </CardDescription>
                  <CardTitle >
                    {contracts.length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <FileText className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Active
                  </CardDescription>
                  <CardTitle >
                    {contracts.filter((c: ContractData) => c.status === 'active').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Expiring Soon
                  </CardDescription>
                  <CardTitle >
                    {contracts.filter((c: ContractData) => c.status === 'expiring-soon').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Total Value
                  </CardDescription>
                  <CardTitle >
                    ${contracts.reduce((sum: number, c: ContractData) => sum + c.value, 0).toLocaleString()}
                  </CardTitle>
                </div>
                <div className="p-3 bg-accent/100/10 rounded-xl">
                  <FileText className="w-6 h-6 text-atlvs-purple-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.map((contract: ContractData) => (
            <Card key={contract.id} variant="atlvs" className="bg-grey-900/50 hover:bg-grey-900 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-grey-800 rounded-lg">
                      <FileText className="w-6 h-6 text-info" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white">{contract.title}</CardTitle>
                        <Badge variant="atlvs-outline" className={getStatusColor(contract.status)}>
                          {contract.status.replace(/-/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-body-sm text-grey-400 mb-2">{contract.vendor}</div>
                      <div className="flex items-center gap-4 text-body-sm text-grey-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Expires: {new Date(contract.expiryDate).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span className="font-medium text-white">${contract.value.toLocaleString()}</span>
                      </div>
                      {contract.status === 'expiring-soon' && (
                        <div className="mt-2 flex items-center gap-2 text-body-sm text-warning">
                          <AlertCircle className="w-4 h-4" />
                          <span>Renewal required within 30 days</span>
                        </div>
                      )}
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
      </ContentLayout>
    </AtlvsLayout>
  );
}
