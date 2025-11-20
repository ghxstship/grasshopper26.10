'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Folder, Download, Trash2, Search, Grid, List, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useProject } from '@/lib/hooks/atlvs/useProjects';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  owner: string;
}

// TODO: Create useProjectFiles hook for file management API
// For now using empty array - files API not yet implemented

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/projects/[id]/files

export default function ProjectFilesPage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: projectData, isLoading, error, refetch } = useProject(params.id);
  
  // When files API is ready, transform the data here
  const files: FileItem[] = [];

  const filteredFiles = files.filter((file: FileItem) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <BodyText className="text-grey-400">Loading project files...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Project</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
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
        title="PROJECT FILES"
        description="Manage documents and assets for this project"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Project Details', href: `/atlvs/projects/${params.id}` },
          { label: 'Files' }
        ]}
      >
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 z-10" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-grey-900 rounded-lg p-1">
              <Button
                onClick={() => setViewMode('grid')}
                variant="ghost"
                size="sm"
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-grey-800 text-atlvs-green-500' : 'text-grey-400'}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant="ghost"
                size="sm"
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-grey-800 text-atlvs-green-500' : 'text-grey-400'}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="atlvs" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Storage Info */}
        <Card variant="atlvs" className="bg-grey-900/50 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-body-sm text-grey-400 mb-1">Storage Used</div>
                <div >8.7 GB <span className="text-grey-500">/ 50 GB</span></div>
              </div>
              <div className="w-48 h-2 bg-grey-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-atlvs-green-500 to-atlvs-purple-500 w-[17.4%]" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Files Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card variant="atlvs" className="bg-grey-900/50 cursor-pointer hover:bg-grey-900 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      {file.type === 'folder' ? (
                        <Folder className="w-10 h-10 text-atlvs-purple-500" />
                      ) : (
                        <File className="w-10 h-10 text-atlvs-green-500" />
                      )}
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="p-1">
                          <Download className="w-4 h-4 text-grey-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Trash2 className="w-4 h-4 text-grey-400" />
                        </Button>
                      </div>
                    </div>
                    <div className="font-medium mb-1 truncate">{file.name}</div>
                    {file.size && (
                      <div className="text-body-sm text-grey-400 mb-2">{file.size}</div>
                    )}
                    <div className="flex items-center justify-between text-caption text-grey-500">
                      <span>{file.owner}</span>
                      <span>{file.modified}</span>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-grey-800/50 rounded-lg hover:bg-grey-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {file.type === 'folder' ? (
                        <Folder className="w-6 h-6 text-atlvs-purple-500" />
                      ) : (
                        <File className="w-6 h-6 text-atlvs-green-500" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-body-sm text-grey-400">
                          {file.owner} • {file.modified}
                        </div>
                      </div>
                      {file.size && (
                        <Badge variant="atlvs-outline" className="bg-grey-700/50">
                          {file.size}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-2">
                        <Download className="w-4 h-4 text-grey-400" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Trash2 className="w-4 h-4 text-grey-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
