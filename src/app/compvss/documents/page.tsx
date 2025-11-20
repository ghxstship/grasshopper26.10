'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout} from '@/components/templates/CompvssLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { useState, useMemo} from 'react';
import { motion} from 'framer-motion';
import { FileText, Search, Download, Upload, Folder, File, Image as ImageIcon, Video,
 Music,
 Archive,
 Shield,
 Eye,
 Trash2,
 Share2,
 Lock,
 Unlock
} from 'lucide-react';
import { Button} from '@/components/atoms/Button';
import { Card, CardHeader, CardDescription, CardContent} from '@/components/atoms/Card';
import { Badge} from '@/components/atoms/Badge';
import { Input} from '@/components/atoms/Input';
import { Select} from '@/components/atoms/Select';
import { BodyText, SectionHeader, CardTitle as TypographyCardTitle } from '@/components/atoms/Typography'
import { useAuth} from '@/lib/hooks/auth/useAuth';

interface Document {
 id: string;
 name: string;
 type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
 size: number;
 uploadedBy: string;
 uploadedDate: string;
 folder: string;
 permissions: 'public' | 'team' | 'restricted' | 'private';
 tags: string[];
 lastModified: string;
}

const mockDocuments: Document[] = [
 {
 id: 'DOC-001',
 name: 'Production Schedule Q4 2024.pdf',
 type: 'document',
 size: 2457600,
 uploadedBy: 'Sarah Johnson',
 uploadedDate: '2024-11-18',
 folder: 'Production',
 permissions: 'team',
 tags: ['schedule', 'production', 'q4'],
 lastModified: '2024-11-18'
},
 {
 id: 'DOC-002',
 name: 'Equipment Inventory.xlsx',
 type: 'document',
 size: 1048576,
 uploadedBy: 'Mike Chen',
 uploadedDate: '2024-11-17',
 folder: 'Equipment',
 permissions: 'team',
 tags: ['inventory', 'equipment'],
 lastModified: '2024-11-17'
},
 {
 id: 'DOC-003',
 name: 'Safety Protocol Video.mp4',
 type: 'video',
 size: 52428800,
 uploadedBy: 'Alex Kim',
 uploadedDate: '2024-11-15',
 folder: 'Training',
 permissions: 'public',
 tags: ['safety', 'training', 'video'],
 lastModified: '2024-11-15'
},
 {
 id: 'DOC-004',
 name: 'Contract Template.docx',
 type: 'document',
 size: 524288,
 uploadedBy: 'Jordan Lee',
 uploadedDate: '2024-11-14',
 folder: 'Legal',
 permissions: 'restricted',
 tags: ['contract', 'legal', 'template'],
 lastModified: '2024-11-14'
},
 {
 id: 'DOC-005',
 name: 'Site Photos - Location A.zip',
 type: 'archive',
 size: 104857600,
 uploadedBy: 'Sarah Johnson',
 uploadedDate: '2024-11-12',
 folder: 'Media',
 permissions: 'team',
 tags: ['photos', 'location', 'archive'],
 lastModified: '2024-11-12'
}
];

export default function CompvssDocumentsPage() {
 const { user} = useAuth();
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedFolder, setSelectedFolder] = useState('all');
 const [selectedPermission, setSelectedPermission] = useState('all');

 const filteredDocuments = useMemo(() => {
 return mockDocuments.filter(doc => {
 const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
 const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
 const matchesPermission = selectedPermission === 'all' || doc.permissions === selectedPermission;
 return matchesSearch && matchesFolder && matchesPermission;
});
}, [searchQuery, selectedFolder, selectedPermission]);

 const stats = useMemo(() => ({
 total: mockDocuments.length,
 documents: mockDocuments.filter(d => d.type === 'document').length,
 media: mockDocuments.filter(d => ['image', 'video', 'audio'].includes(d.type)).length,
 totalSize: mockDocuments.reduce((sum, d) => sum + d.size, 0)
}), []);

 const getFileIcon = (type: string) => {
 switch (type) {
 case 'document': return <FileText className="w-5 h-5" />;
 case 'image': return <ImageIcon className="w-5 h-5" />;
 case 'video': return <Video className="w-5 h-5" />;
 case 'audio': return <Music className="w-5 h-5" />;
 case 'archive': return <Archive className="w-5 h-5" />;
 default: return <File className="w-5 h-5" />;
}
};

 const getPermissionIcon = (permission: string) => {
 switch (permission) {
 case 'public': return <Unlock className="w-4 h-4" />;
 case 'team': return <Shield className="w-4 h-4" />;
 case 'restricted': return <Lock className="w-4 h-4" />;
 case 'private': return <Lock className="w-4 h-4" />;
 default: return <Shield className="w-4 h-4" />;
}
};

 const getPermissionColor = (permission: string) => {
 switch (permission) {
 case 'public': return 'bg-primary/20 text-primary border-primary/30';
 case 'team': return 'bg-secondary/20 text-secondary border-secondary/30';
 case 'restricted': return 'bg-warning/20 text-warning border-warning/30';
 case 'private': return 'bg-error/20 text-error border-error/30';
 default: return ' ';
}
};

 const formatFileSize = (bytes: number) => {
 if (bytes === 0) return '0 Bytes';
 const k = 1024;
 const sizes = ['Bytes', 'KB', 'MB', 'GB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

 // Check user permissions (RBAC)
 const canUpload = user?.role && ['admin', 'crew', 'production'].includes(user.role);
 const canDelete = user?.role && ['admin'].includes(user.role);
 const canManagePermissions = user?.role && ['admin', 'production'].includes(user.role);

 return (
 <CompvssLayout>
 <ContentLayout
 title="Document Library"
 description="Manage files, documents, and media with role-based access control"
 variant="compvss"
 breadcrumbs={[
 { label: 'Home', href: '/compvss'},
 { label: 'Documents'}
 ]}
 actions={canUpload ? [
 {
 label: 'Upload Files',
 onClick: () => {},
 icon: <Upload className="w-4 h-4" />,
 variant: 'compvss' as const
}
 ] : undefined}
 >
 {/* Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Total Files</BodyText>
 <SectionHeader className="mt-1">{stats.total}</SectionHeader>
 </div>
 <FileText className="w-8 h-8 text-compvss-primary" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Documents</BodyText>
 <SectionHeader className="mt-1">{stats.documents}</SectionHeader>
 </div>
 <File className="w-8 h-8 text-info" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Media Files</BodyText>
 <SectionHeader className="mt-1">{stats.media}</SectionHeader>
 </div>
 <ImageIcon className="w-8 h-8 text-ghxst-primary" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Total Size</BodyText>
 <SectionHeader className="mt-1">{formatFileSize(stats.totalSize)}</SectionHeader>
 </div>
 <Archive className="w-8 h-8 text-compvss-accent" />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Filters */}
 <Card variant="compvss" className="mb-6">
 <CardContent className="pt-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="relative">
 <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <Input
 type="text"
 placeholder="Search documents..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 variant="compvss"
 className="ps-10"
 />
 </div>

 <Select
 value={selectedFolder}
 onChange={(e) => setSelectedFolder(e.target.value)}
 variant="compvss"
 >
 <option value="all">All Folders</option>
 <option value="Production">Production</option>
 <option value="Equipment">Equipment</option>
 <option value="Training">Training</option>
 <option value="Legal">Legal</option>
 <option value="Media">Media</option>
 </Select>

 <Select
 value={selectedPermission}
 onChange={(e) => setSelectedPermission(e.target.value)}
 variant="compvss"
 >
 <option value="all">All Permissions</option>
 <option value="public">Public</option>
 <option value="team">Team</option>
 <option value="restricted">Restricted</option>
 <option value="private">Private</option>
 </Select>
 </div>
 </CardContent>
 </Card>

 {!canUpload && (
 <Card variant="compvss" className="mb-6 border-warning/50 bg-warning/10">
 <CardContent className="pt-6">
 <div className="flex items-center gap-3">
 <Shield className="w-6 h-6 text-warning" />
 <div>
 <BodyText className="text-warning">Limited Access</BodyText>
 <BodyText className="text-muted-foreground">
 You have read-only access to documents. Contact your administrator for upload permissions.
 </BodyText>
 </div>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Documents Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredDocuments.map((doc, index) => (
 <motion.div
 key={doc.id}
 initial={{ opacity: 0, y: 20}}
 animate={{ opacity: 1, y: 0}}
 transition={{ delay: index * 0.05}}
 >
 <Card variant="compvss" className="h-full">
 <CardHeader>
 <div className="flex items-start justify-between mb-3">
 <div className="p-2 bg-compvss-primary/20 rounded-lg text-compvss-primary">
 {getFileIcon(doc.type)}
 </div>
 <Badge className={getPermissionColor(doc.permissions)}>
 <span className="flex items-center gap-1">
 {getPermissionIcon(doc.permissions)}
 {doc.permissions}
 </span>
 </Badge>
 </div>

 <TypographyCardTitle className="mb-2 truncate" title={doc.name}>
 {doc.name}
 </TypographyCardTitle>
 <CardDescription>{doc.folder}</CardDescription>

 <div className="mt-4 space-y-2">
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Size</BodyText>
 <BodyText>{formatFileSize(doc.size)}</BodyText>
 </div>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Uploaded By</BodyText>
 <BodyText>{doc.uploadedBy}</BodyText>
 </div>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Date</BodyText>
 <BodyText>{doc.uploadedDate}</BodyText>
 </div>
 </div>

 <div className="mt-4 flex flex-wrap gap-2">
 {doc.tags.map(tag => (
 <Badge key={tag} variant="compvss-outline">
 {tag}
 </Badge>
 ))}
 </div>
 </CardHeader>

 <CardContent>
 <div className="flex items-center gap-2">
 <Button variant="compvss" size="sm" className="flex-1">
 <Eye className="w-4 h-4 me-2" />
 View
 </Button>
 <Button variant="compvss-outline" size="sm">
 <Download className="w-4 h-4" />
 </Button>
 {canManagePermissions && (
 <Button variant="compvss-outline" size="sm">
 <Share2 className="w-4 h-4" />
 </Button>
 )}
 {canDelete && (
 <Button variant="compvss-outline" size="sm" className="text-error hover:text-error">
 <Trash2 className="w-4 h-4" />
 </Button>
 )}
 </div>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>

 {filteredDocuments.length === 0 && (
 <Card variant="compvss">
 <CardContent className="py-12 text-center">
 <Folder className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
 <SectionHeader className="mb-2">No documents found</SectionHeader>
 <BodyText className="text-muted-foreground">
 Try adjusting your filters or upload new files
 </BodyText>
 </CardContent>
 </Card>
 )}
 </ContentLayout>
 </CompvssLayout>
 );
}
