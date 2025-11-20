'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { FileText, Clock, Download, Eye, GitBranch, User, Calendar, ChevronDown, ChevronUp,  } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { SubsectionHeader } from "@/components/atoms/Typography";

interface Version {
  id: string;
  version: string;
  author: string;
  date: string;
  changes: string;
  size: string;
  status: 'current' | 'previous' | 'archived';
}

interface VersionedDocument {
  id: string;
  name: string;
  type: string;
  versions: Version[];
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/documents/version-control

export default function VersionControlPage() {
  const [selectedDoc, setSelectedDoc] = useState<string>('1');
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const { documents: docs } = useDocuments();
  const documents: VersionedDocument[] = [
    {
      id: '1',
      name: 'Production Contract - Summer Tour 2025',
      type: 'Contract',
      versions: [
        { id: 'v1', version: '3.0', author: 'Sarah Johnson', date: '2025-11-14 10:30', changes: 'Updated payment terms and schedule', size: '2.4 MB', status: 'current' },
        { id: 'v2', version: '2.1', author: 'Mike Chen', date: '2025-11-10 14:20', changes: 'Added venue specifications', size: '2.3 MB', status: 'previous' },
        { id: 'v3', version: '2.0', author: 'Sarah Johnson', date: '2025-11-05 09:15', changes: 'Major revision with legal review', size: '2.2 MB', status: 'previous' },
        { id: 'v4', version: '1.0', author: 'Emily Davis', date: '2025-10-28 16:45', changes: 'Initial draft', size: '1.8 MB', status: 'archived' }
      ]
    },
    {
      id: '2',
      name: 'Technical Rider - Main Stage',
      type: 'Rider',
      versions: [
        { id: 'v5', version: '2.0', author: 'Mike Chen', date: '2025-11-12 11:00', changes: 'Updated equipment list', size: '1.5 MB', status: 'current' },
        { id: 'v6', version: '1.0', author: 'Mike Chen', date: '2025-11-01 13:30', changes: 'Initial version', size: '1.2 MB', status: 'previous' }
      ]
    }
  ];

  const selectedDocument = documents.find((d: VersionedDocument) => d.id === selectedDoc);

  const toggleVersion = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      current: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
      previous: 'bg-info/20 text-info border-info/50',
      archived: 'bg-grey-700 text-grey-300 border-grey-600'
    };
    return badges[status] || badges.archived;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="VERSION CONTROL"
        description="Track and manage document versions"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Version Control' }
        ]}
      >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="lg:col-span-1">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map((doc: VersionedDocument) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${ selectedDoc === doc.id ? 'bg-atlvs-green-500/20 border-2 border-atlvs-green-500' : 'bg-grey-800/50 border-2 border-transparent hover:bg-grey-800' }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-grey-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-body-sm truncate">{doc.name}</div>
                        <div className="text-caption text-grey-400 mt-1">{doc.type}</div>
                        <div className="flex items-center gap-1 mt-1 text-caption text-grey-500">
                          <GitBranch className="w-3 h-3" />
                          <span>{doc.versions.length} versions</span>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-grey-200 p-6">
            <div className="mb-6">
              <h2 className="text-grey-900 mb-1">
                {selectedDocument?.name}
              </h2>
              <p className="text-body-sm text-grey-600">{selectedDocument?.type}</p>
            </div>

            <div className="space-y-3">
              {selectedDocument?.versions.map((version: Version, index: number) => {
                const isExpanded = expandedVersions.has(version.id);
                const statusStyle = getStatusBadge(version.status);
                
                return (
                  <div key={version.id} className="border border-grey-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-grey-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-grey-900">v{version.version}</span>
                            <Badge variant="atlvs-outline" className={statusStyle}>
                              {version.status}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                                Latest
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-body-sm text-grey-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{version.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{version.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{version.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => toggleVersion(version.id)}
                          variant="ghost"
                          size="sm"
                          className="p-2"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-grey-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-grey-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-grey-200">
                        <div className="mb-4">
                          <div className="text-body-sm text-grey-700 mb-1">Changes:</div>
                          <p className="text-body-sm text-grey-600">{version.changes}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="atlvs" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="atlvs-outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          {version.status !== 'current' && (
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Version Comparison */}
          <div className="mt-6 bg-white rounded-lg border border-grey-200 p-6">
            <SubsectionHeader className="text-grey-900 mb-4">Compare Versions</SubsectionHeader>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Version A">
                <Select variant="atlvs">
                  {selectedDocument?.versions.map((v: Version) => (
                    <option key={v.id} value={v.version}>v{v.version}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Version B">
                <Select variant="atlvs">
                  {selectedDocument?.versions.map((v: Version) => (
                    <option key={v.id} value={v.version}>v{v.version}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <Button variant="atlvs" className="mt-4 w-full">
              Compare Versions
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-success" />
            <div>
              <div className="text-body-sm text-grey-600">Total Documents</div>
              <div className="text-grey-900">{documents.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-info" />
            <div>
              <div className="text-body-sm text-grey-600">Total Versions</div>
              <div className="text-grey-900">
                {documents.reduce((sum: number, doc: VersionedDocument) => sum + doc.versions.length, 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-atlvs-purple-500" />
            <div>
              <div className="text-body-sm text-grey-600">Recent Updates</div>
              <div className="text-grey-900">
                {documents.filter((d: VersionedDocument) => d.versions.some((v: Version) => v.status === 'current')).length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-atlvs-orange-500" />
            <div>
              <div className="text-body-sm text-grey-600">Contributors</div>
              <div className="text-grey-900">
                {new Set(documents.flatMap(d => d.versions.map(v => v.author))).size}
              </div>
            </div>
          </div>
        </div>
      </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
