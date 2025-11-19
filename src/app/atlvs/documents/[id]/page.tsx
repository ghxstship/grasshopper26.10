'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Share2, Edit, Trash2, Clock, User } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { LoadingState } from '@/components/molecules/LoadingState';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useDocument } from '@/lib/hooks/atlvs/useDocuments';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/documents/[id]

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const { data: document, isLoading, error } = useDocument(params.id);

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Loading..."
          description="Fetching document details"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Loading...' }
          ]}
        >
          <LoadingState variant="atlvs" />
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error || !document) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Error"
          description="Failed to load document"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Error' }
          ]}
        >
          <EmptyState
            title="Document Not Found"
            message="The document you're looking for doesn't exist or you don't have permission to view it."
          />
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title={document.name}
        description={`${document.type} • ${document.size}`}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: document.name }
        ]}
      >
        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="atlvs-outline" className="bg-grey-700/50">
                    {document.category}
                  </Badge>
                  {document.tags.map((tag) => (
                    <Badge key={tag} variant="atlvs-outline" className="bg-grey-700/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="atlvs" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Description</CardTitle>
                <p className="text-grey-300">{document.description}</p>
              </CardHeader>
            </Card>

            {/* Version History */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Version History</CardTitle>
                <div className="space-y-3">
                  {document.versions?.map((version, index) => (
                    <div key={version.id} className="flex items-start gap-4 p-4 bg-grey-800/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center flex-shrink-0">
                        {version.author.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{version.version}</span>
                          {index === 0 && (
                            <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-body-sm text-grey-400 mb-1">
                          {version.author} • {new Date(version.date).toLocaleDateString()}
                        </div>
                        <div className="text-body-sm text-grey-300">{version.changes}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        {index !== 0 && (
                          <Button variant="ghost" size="sm">
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Shared With */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-6">
                  <CardTitle>Shared With ({document.sharedWith?.length || 0})</CardTitle>
                  <Button variant="atlvs" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="space-y-2">
                  {document.sharedWith?.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-3 bg-grey-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center">
                          {person.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-body-sm text-grey-400">{person.role}</div>
                        </div>
                      </div>
                      <Badge variant="atlvs-outline" className="bg-grey-700/50">
                        {person.access}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Activity Log */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Recent Activity</CardTitle>
                <div className="space-y-3">
                  {document.activity?.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-grey-800/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-atlvs-green-500 mt-2" />
                      <div className="flex-1">
                        <div className="text-grey-300">
                          <span className="text-white">{item.user}</span>
                          {' '}{item.action}
                        </div>
                        <div className="text-body-sm text-grey-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Document Info</CardTitle>
                <div className="space-y-4">
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1">Project</div>
                    <div className="font-medium">{document.project}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Uploaded By
                    </div>
                    <div className="font-medium">{document.uploadedBy}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Uploaded
                    </div>
                    <div className="font-medium">{new Date(document.uploadedDate).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1">Last Modified</div>
                    <div className="font-medium">{document.updatedAt ? new Date(document.updatedAt).toLocaleString() : 'N/A'}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Actions */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Actions</CardTitle>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Document
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-error">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Document
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
