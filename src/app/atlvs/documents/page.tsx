'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, Upload, Search, Filter, Download, Share2, MoreVertical, File, FileSpreadsheet, Image, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  
  // Fetch documents with React Query
  const { documents, isLoading, error, refetch, downloadDocument } = useDocuments();

  const documentTypes = ['All Types', 'Contract', 'Rider', 'Permit', 'Invoice', 'Other'];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-5 h-5 text-error" />;
      case 'docx': return <File className="w-5 h-5 text-info" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-success" />;
      case 'jpg':
      case 'png': return <Image className="w-5 h-5 text-atlvs-purple-500" aria-label="Image file" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-info-light text-info border-info-border';
      case 'rider': return 'bg-atlvs-purple-500/20 text-atlvs-purple-500 border-atlvs-purple-500/50';
      case 'permit': return 'bg-success-light text-success border-success-border';
      case 'invoice': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const filteredDocuments = useMemo(() => 
    documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === 'All Types' || doc.type === selectedType.toLowerCase();
      return matchesSearch && matchesType;
    }),
    [documents, searchQuery, selectedType]
  );

  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const totalSize = documents.reduce((sum, doc) => {
      const size = parseFloat(doc.size);
      return sum + (doc.size.includes('MB') ? size : size / 1024);
    }, 0);
    const contracts = documents.filter(d => d.type === 'contract').length;
    const recentUploads = documents.filter(d => {
      const uploadDate = new Date(d.uploadedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length;
    
    return { totalDocs, totalSize, contracts, recentUploads };
  }, [documents]);

  // Loading state
  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="DOCUMENT MANAGEMENT"
          description="Loading documents..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-purple-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="DOCUMENT MANAGEMENT"
          description="Error loading documents"
          variant="atlvs"
          showToolbar={false}
        >
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {error instanceof Error ? error.message : 'Failed to load documents'}
                </p>
                <Button variant="atlvs" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </CardHeader>
          </Card>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="DOCUMENT MANAGEMENT"
        description="Manage contracts, riders, permits, and project documents"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="_Document statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Documents
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`${stats.totalDocs} total documents`}>
                    {stats.totalDocs}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <FileText className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Contracts
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`${stats.contracts} contracts`}>
                    {stats.contracts}
                  </CardTitle>
                </div>
                <div className="p-3 bg-accent/100/10 rounded-xl" aria-hidden="true">
                  <File className="w-6 h-6 text-atlvs-purple-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Storage Used
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`${stats.totalSize.toFixed(1)} megabytes storage used`}>
                    {stats.totalSize.toFixed(1)} MB
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <Folder className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Recent Uploads
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas">
                    {stats.recentUploads}
                  </CardTitle>
                </div>
                <div className="p-3 bg-warning-light0/10 rounded-xl">
                  <Upload className="w-6 h-6 text-atlvs-orange-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            variant="atlvs"
          >
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button variant="atlvs" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                variant="atlvs" 
                className="bg-gray-900/50 hover:bg-gray-900 transition-all cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-white truncate">
                            {doc.name}
                          </CardTitle>
                          <Badge variant="atlvs-outline" className="text-caption">
                            v{doc.version}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-body-sm text-gray-400">
                          <span>{doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.project}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="atlvs-outline"
                        className={getTypeColor(doc.type)}
                      >
                        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                      </Badge>
                      <div className="flex gap-1">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="atlvs-outline" className="text-caption">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadDocument(doc.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
