'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Clock, Download, Loader2, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/documents/versions

export default function DocumentVersionsPage() {
  const { documents, isLoading, error, refetch } = useDocuments('version');
  const versions = (documents as any) || [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="VERSION HISTORY"
          description="Loading..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Versions' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="VERSION HISTORY"
          description="Error loading versions"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Versions' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="VERSION HISTORY"
        description="Track document changes over time"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Versions' }
        ]}
      >

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                All Versions
              </CardTitle>
              <div className="space-y-3">
                {versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between p-4 bg-grey-800/50 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center">
                        {version.version}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{version.version}</span>
                          {version.current && (
                            <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-body-sm text-grey-400">
                          {version.date} • {version.author} • {version.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {!version.current && (
                        <Button variant="atlvs" size="sm">
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
