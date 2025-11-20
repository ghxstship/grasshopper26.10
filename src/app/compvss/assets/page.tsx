'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout} from '@/components/templates/CompvssLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { useState, useMemo} from 'react';
import { motion} from 'framer-motion';
import { Package, Plus, Search, LogIn, LogOut, Wrench, CheckCircle2, AlertCircle,
 Calendar,
 Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button} from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/atoms/Card';
import { Badge} from '@/components/atoms/Badge';
import { Input} from '@/components/atoms/Input';
import { Select} from '@/components/atoms/Select';
import { Tabs} from '@/components/molecules/Tabs';
import { BodyText, SectionHeader } from '@/components/atoms/Typography'
import { useAuth} from '@/lib/hooks/auth/useAuth';

interface Asset {
 id: string;
 name: string;
 category: 'equipment' | 'vehicle' | 'tool' | 'gear';
 status: 'available' | 'checked-out' | 'maintenance' | 'reserved';
 location: string;
 checkedOutTo?: string;
 checkedOutDate?: string;
 dueDate?: string;
 condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
 lastMaintenance?: string;
 nextMaintenance?: string;
 serialNumber: string;
}

const mockAssets: Asset[] = [
 {
 id: 'COMP-001',
 name: 'Camera Package - Sony FX6',
 category: 'equipment',
 status: 'checked-out',
 location: 'Production Site A',
 checkedOutTo: 'Sarah Johnson',
 checkedOutDate: '2024-11-18',
 dueDate: '2024-11-22',
 condition: 'excellent',
 lastMaintenance: '2024-10-15',
 nextMaintenance: '2025-01-15',
 serialNumber: 'SN-FX6-2024-001'
},
 {
 id: 'COMP-002',
 name: 'Lighting Kit - ARRI SkyPanel',
 category: 'equipment',
 status: 'available',
 location: 'Equipment Warehouse',
 condition: 'good',
 lastMaintenance: '2024-11-01',
 nextMaintenance: '2025-02-01',
 serialNumber: 'SN-ARRI-2024-045'
},
 {
 id: 'COMP-003',
 name: 'Production Van',
 category: 'vehicle',
 status: 'checked-out',
 location: 'Location B',
 checkedOutTo: 'Mike Chen',
 checkedOutDate: '2024-11-17',
 dueDate: '2024-11-24',
 condition: 'good',
 lastMaintenance: '2024-10-20',
 nextMaintenance: '2024-12-20',
 serialNumber: 'VIN-PROD-2024-003'
},
 {
 id: 'COMP-004',
 name: 'Audio Recording Kit',
 category: 'equipment',
 status: 'maintenance',
 location: 'Maintenance Shop',
 condition: 'needs-repair',
 lastMaintenance: '2024-11-15',
 serialNumber: 'SN-AUD-2024-012'
},
 {
 id: 'COMP-005',
 name: 'Drone - DJI Inspire 3',
 category: 'equipment',
 status: 'reserved',
 location: 'Equipment Warehouse',
 condition: 'excellent',
 lastMaintenance: '2024-11-10',
 nextMaintenance: '2025-02-10',
 serialNumber: 'SN-DJI-2024-007'
}
];

export default function CompvssAssetsPage() {
 const { user} = useAuth();
 const [activeTab, setActiveTab] = useState('assets');
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('all');
 const [selectedStatus, setSelectedStatus] = useState('all');

 const tabs = [
 { id: 'assets', label: 'Assets', icon: <Package className="w-4 h-4" />},
 { id: 'check-in-out', label: 'Check In/Out', icon: <LogIn className="w-4 h-4" />},
 { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" />}
 ];

 const filteredAssets = useMemo(() => {
 return mockAssets.filter(asset => {
 const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 asset.id.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
 const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;
 return matchesSearch && matchesCategory && matchesStatus;
});
}, [searchQuery, selectedCategory, selectedStatus]);

 const stats = useMemo(() => ({
 total: mockAssets.length,
 available: mockAssets.filter(a => a.status === 'available').length,
 checkedOut: mockAssets.filter(a => a.status === 'checked-out').length,
 maintenance: mockAssets.filter(a => a.status === 'maintenance').length
}), []);

 const getStatusColor = (status: string) => {
 switch (status) {
 case 'available': return 'bg-status-available text-status-available border-status-available';
 case 'checked-out': return 'bg-status-checked-out text-status-checked-out border-status-checked-out';
 case 'maintenance': return 'bg-status-maintenance text-status-maintenance border-status-maintenance';
 case 'reserved': return 'bg-status-reserved text-status-reserved border-status-reserved';
 default: return ' ';
}
};

 const getConditionColor = (condition: string) => {
 switch (condition) {
 case 'excellent': return 'text-success';
 case 'good': return 'text-info';
 case 'fair': return 'text-warning';
 case 'needs-repair': return 'text-error';
 default: return '';
}
};

 // Check user permissions (RBAC)
 const canCheckOut = user?.role && ['admin', 'crew', 'production'].includes(user.role);
 const canMaintain = user?.role && ['admin', 'maintenance'].includes(user.role);

 return (
 <CompvssLayout>
 <ContentLayout
 title="Asset Management"
 description="Manage equipment check-in/out, maintenance, and inventory"
 variant="compvss"
 breadcrumbs={[
 { label: 'Home', href: '/compvss'},
 { label: 'Assets'}
 ]}
 primaryAction={canCheckOut ? {
 label: 'Add Asset',
 icon: <Plus className="w-4 h-4" />,
 onClick: () => window.location.href = '/compvss/assets/new'
} : undefined}
 >
 {/* Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Total Assets</BodyText>
 <SectionHeader className="mt-1">{stats.total}</SectionHeader>
 </div>
 <Package className="w-8 h-8 text-compvss-primary" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Available</BodyText>
 <SectionHeader className="mt-1 text-success">{stats.available}</SectionHeader>
 </div>
 <CheckCircle2 className="w-8 h-8 text-success" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Checked Out</BodyText>
 <SectionHeader className="mt-1 text-info">{stats.checkedOut}</SectionHeader>
 </div>
 <LogOut className="w-8 h-8 text-info" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Maintenance</BodyText>
 <SectionHeader className="mt-1 text-warning">{stats.maintenance}</SectionHeader>
 </div>
 <Wrench className="w-8 h-8 text-warning" />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Tabs */}
 <Tabs
 tabs={tabs}
 activeTab={activeTab}
 onChange={setActiveTab}
 variant="compvss"
 className="mb-6"
 />

 {/* Assets Tab */}
 {activeTab === 'assets' && (
 <>
 {/* Filters */}
 <Card variant="compvss" className="mb-6">
 <CardContent className="pt-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="relative">
 <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <Input
 type="text"
 placeholder="Search assets..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 variant="compvss"
 className="ps-10"
 />
 </div>

 <Select
 value={selectedCategory}
 onChange={(e) => setSelectedCategory(e.target.value)}
 variant="compvss"
 >
 <option value="all">All Categories</option>
 <option value="equipment">Equipment</option>
 <option value="vehicle">Vehicles</option>
 <option value="tool">Tools</option>
 <option value="gear">Gear</option>
 </Select>

 <Select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value)}
 variant="compvss"
 >
 <option value="all">All Status</option>
 <option value="available">Available</option>
 <option value="checked-out">Checked Out</option>
 <option value="maintenance">Maintenance</option>
 <option value="reserved">Reserved</option>
 </Select>
 </div>
 </CardContent>
 </Card>

 {/* Assets Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredAssets.map((asset, index) => (
 <motion.div
 key={asset.id}
 initial={{ opacity: 0, y: 20}}
 animate={{ opacity: 1, y: 0}}
 transition={{ delay: index * 0.05}}
 >
 <Card variant="compvss" className="h-full">
 <CardHeader>
 <div className="flex items-start justify-between mb-3">
 <Badge className={getStatusColor(asset.status)}>
 {asset.status.replace('-', ' ')}
 </Badge>
 <Badge variant="compvss-outline">
 {asset.id}
 </Badge>
 </div>

 <CardTitleTypography className="mb-2">{asset.name}</CardTitleTypography>
 <CardDescription>{asset.category}</CardDescription>

 <div className="mt-4 space-y-2">
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Location</BodyText>
 <BodyText>{asset.location}</BodyText>
 </div>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Condition</BodyText>
 <BodyText className={getConditionColor(asset.condition)}>
 {asset.condition}
 </BodyText>
 </div>
 {asset.checkedOutTo && (
 <>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Checked Out To</BodyText>
 <BodyText>{asset.checkedOutTo}</BodyText>
 </div>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Due Date</BodyText>
 <BodyText>{asset.dueDate}</BodyText>
 </div>
 </>
 )}
 </div>
 </CardHeader>

 <CardContent>
 <div className="flex items-center gap-2">
 <Button variant="compvss" size="sm" className="flex-1" asChild>
 <Link href={`/compvss/assets/${asset.id}`}>
 View Details
 </Link>
 </Button>
 {canCheckOut && asset.status === 'available' && (
 <Button variant="compvss-outline" size="sm" asChild>
 <Link href={`/compvss/assets/${asset.id}/checkout`}>
 <LogOut className="w-4 h-4" />
 </Link>
 </Button>
 )}
 </div>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>
 </>
 )}

 {/* Check In/Out Tab */}
 {activeTab === 'check-in-out' && (
 <div className="space-y-6">
 {!canCheckOut && (
 <Card variant="compvss" className="border-warning/50 bg-warning/10">
 <CardContent className="pt-6">
 <div className="flex items-center gap-3">
 <Shield className="w-6 h-6 text-warning" />
 <div>
 <BodyText className="text-warning">Restricted Access</BodyText>
 <BodyText className="text-muted-foreground">
 You don't have permission to check in/out assets. Contact your administrator.
 </BodyText>
 </div>
 </div>
 </CardContent>
 </Card>
 )}

 <Card variant="compvss">
 <CardHeader>
 <CardTitle>Recent Check-Ins/Outs</CardTitle>
 <CardDescription>Track asset movement and usage</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {[
 { asset: 'Camera Package - Sony FX6', user: 'Sarah Johnson', action: 'checked-out', date: '2024-11-18 09:30', dueDate: '2024-11-22'},
 { asset: 'Lighting Kit - ARRI SkyPanel', user: 'Mike Chen', action: 'checked-in', date: '2024-11-17 16:45', dueDate: null},
 { asset: 'Production Van', user: 'Mike Chen', action: 'checked-out', date: '2024-11-17 08:00', dueDate: '2024-11-24'},
 { asset: 'Drone - DJI Inspire 3', user: 'Alex Kim', action: 'checked-in', date: '2024-11-16 18:30', dueDate: null}
 ].map((log, index) => (
 <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
 <div className="flex items-center gap-4">
 <div className={`p-2 rounded-lg ${log.action === 'checked-out' ? 'bg-info/20' : 'bg-success/20'}`}>
 {log.action === 'checked-out' ? <LogOut className="w-5 h-5 text-info" /> : <LogIn className="w-5 h-5 text-success" />
}
 </div>
 <div>
 <BodyText >{log.asset}</BodyText>
 <BodyText className="text-muted-foreground">
 {log.action === 'checked-out' ? 'Checked out by' : 'Checked in by'} {log.user}
 </BodyText>
 </div>
 </div>
 <div className="text-right">
 <BodyText>{log.date}</BodyText>
 {log.dueDate && (
 <BodyText className="text-muted-foreground">Due: {log.dueDate}</BodyText>
 )}
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>
 )}

 {/* Maintenance Tab */}
 {activeTab === 'maintenance' && (
 <div className="space-y-6">
 {!canMaintain && (
 <Card variant="compvss" className="border-warning/50 bg-warning/10">
 <CardContent className="pt-6">
 <div className="flex items-center gap-3">
 <Shield className="w-6 h-6 text-warning" />
 <div>
 <BodyText className="text-warning">Restricted Access</BodyText>
 <BodyText className="text-muted-foreground">
 You don't have permission to manage maintenance. Contact your administrator.
 </BodyText>
 </div>
 </div>
 </CardContent>
 </Card>
 )}

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Due This Week</BodyText>
 <SectionHeader className="mt-1">8</SectionHeader>
 </div>
 <Calendar className="w-8 h-8 text-compvss-primary" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Overdue</BodyText>
 <SectionHeader className="mt-1 text-error">2</SectionHeader>
 </div>
 <AlertCircle className="w-8 h-8 text-error" />
 </div>
 </CardContent>
 </Card>

 <Card variant="compvss">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Completed</BodyText>
 <SectionHeader className="mt-1 text-success">34</SectionHeader>
 </div>
 <CheckCircle2 className="w-8 h-8 text-success" />
 </div>
 </CardContent>
 </Card>
 </div>

 <Card variant="compvss">
 <CardHeader>
 <CardTitle>Maintenance Schedule</CardTitle>
 <CardDescription>Upcoming and overdue maintenance tasks</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {[
 { asset: 'Camera Package - Sony FX6', type: 'Preventive', dueDate: '2025-01-15', status: 'scheduled', priority: 'medium'},
 { asset: 'Audio Recording Kit', type: 'Repair', dueDate: '2024-11-20', status: 'in-progress', priority: 'high'},
 { asset: 'Production Van', type: 'Service', dueDate: '2024-12-20', status: 'scheduled', priority: 'medium'},
 { asset: 'Drone - DJI Inspire 3', type: 'Inspection', dueDate: '2025-02-10', status: 'scheduled', priority: 'low'}
 ].map((maintenance, index) => (
 <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
 <div className="flex items-center gap-4">
 <div className="p-2 bg-compvss-primary/20 rounded-lg">
 <Wrench className="w-5 h-5 text-compvss-primary" />
 </div>
 <div>
 <BodyText >{maintenance.asset}</BodyText>
 <BodyText className="text-muted-foreground">{maintenance.type}</BodyText>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <Badge variant={
 maintenance.priority === 'high' ? 'error' :
 maintenance.priority === 'medium' ? 'default' : 'compvss-outline'
}>
 {maintenance.priority}
 </Badge>
 <div className="text-right">
 <BodyText>{maintenance.dueDate}</BodyText>
 <BodyText className="text-muted-foreground">{maintenance.status}</BodyText>
 </div>
 {canMaintain && (
 <Button variant="compvss" size="lg"
 onClick={() => alert('Add asset functionality coming soon')}
 >
 <Plus className="w-5 h-5 me-2" />
 Add Asset
 </Button>
 )}
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>
 )}
 </ContentLayout>
 </CompvssLayout>
 );
}
