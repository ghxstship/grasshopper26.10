'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { useOperationsReports } from '@/lib/hooks/compvss/useOperations';

export default function OperationsReportsPage() {
  const { data, isLoading, error, refetch } = useOperationsReports();
  const reports = data?.reports || [];
  const metrics = data?.metrics || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Operations Reports"
          description="Loading reports..."
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Operations', href: '/compvss/operations/hub' },
            { label: 'Reports' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading reports...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Operations Reports"
          description="Error loading reports"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Operations', href: '/compvss/operations/hub' },
            { label: 'Reports' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Reports</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Operations Reports"
        description="View performance metrics and reports"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'Operations', href: '/compvss/operations/hub' },
          { label: 'Reports' }
        ]}
      >
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bebas text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400 font-oswald mb-2">{metric.label}</div>
                  <div className="flex items-center gap-1 text-xs text-success font-share-tech">
                    <TrendingUp className="w-3 h-3" />
                    <span>{metric.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-compvss-cyan-500/10 rounded-lg">
                        <FileText className="w-6 h-6 text-compvss-cyan-500" />
                      </div>
                      <div>
                        <h3 className="font-oswald text-white mb-1">{report.name}</h3>
                        <p className="text-sm text-gray-400 font-share-tech">
                          {report.type} • {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="compvss-outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
