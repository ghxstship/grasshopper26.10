'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { useExpenseReports } from '@/lib/hooks/compvss/useExpenses';

export default function ExpenseReportsPage() {
  const { data: reports = [], isLoading, error, refetch } = useExpenseReports();

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Expense Reports"
          description="View and download expense reports"
          variant="compvss"
          showToolbar={false}
          
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
          title="Expense Reports"
          description="View and download expense reports"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Reports</h2>
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
        title="Expense Reports"
        description="View and download expense reports"
        variant="compvss"
        showToolbar={false}
        
      >
        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Monthly Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-compvss-cyan-500/10 rounded-lg">
                        <FileText className="w-6 h-6 text-compvss-cyan-500" />
                      </div>
                      <div>
                        <h3 className="font-oswald text-white mb-1">{report.name}</h3>
                        <div className="flex items-center gap-2 text-body-sm text-gray-400 font-share-tech">
                          <Calendar className="w-4 h-4" />
                          <span>{report.period}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-h5 font-bebas text-white">{report.total}</div>
                        <div className="text-caption text-gray-500 font-share-tech">{report.status}</div>
                      </div>
                      <Button variant="compvss-outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
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
