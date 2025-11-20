'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout} from '@/components/templates/AtlvsLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { useState, useMemo} from 'react';
import { motion} from 'framer-motion';
import { Workflow, Plus, Search, Play, Copy, Edit,
 Clock,
 CheckCircle2,
 AlertCircle,
 Users,
 Zap,
 GitBranch
} from 'lucide-react';
import Link from 'next/link';
import { Button} from '@/components/atoms/Button';
import { Card, CardHeader, CardDescription, CardContent} from '@/components/atoms/Card';
import { Badge} from '@/components/atoms/Badge';
import { Input} from '@/components/atoms/Input';
import { Select} from '@/components/atoms/Select';
import { BodyText, SectionHeader, CardTitle as TypographyCardTitle } from '@/components/atoms/Typography'

interface WorkflowTemplate {
 id: string;
 name: string;
 description: string;
 category: 'event-setup' | 'production' | 'logistics' | 'maintenance' | 'approval' | 'communication';
 steps: number;
 estimatedTime: string;
 usageCount: number;
 lastUsed?: string;
 tags: string[];
 automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
 status: 'active' | 'draft' | 'archived';
}

const mockWorkflows: WorkflowTemplate[] = [
 {
 id: 'WF-001',
 name: 'Event Setup & Teardown',
 description: 'Complete workflow for setting up and tearing down event infrastructure',
 category: 'event-setup',
 steps: 12,
 estimatedTime: '4-6 hours',
 usageCount: 45,
 lastUsed: '2024-11-15',
 tags: ['setup', 'infrastructure', 'logistics'],
 automationLevel: 'semi-automated',
 status: 'active'
},
 {
 id: 'WF-002',
 name: 'Asset Maintenance Schedule',
 description: 'Automated maintenance scheduling and tracking for all equipment',
 category: 'maintenance',
 steps: 8,
 estimatedTime: '2-3 hours',
 usageCount: 120,
 lastUsed: '2024-11-18',
 tags: ['maintenance', 'equipment', 'preventive'],
 automationLevel: 'fully-automated',
 status: 'active'
},
 {
 id: 'WF-003',
 name: 'Budget Approval Process',
 description: 'Multi-stage approval workflow for budget requests and expenses',
 category: 'approval',
 steps: 6,
 estimatedTime: '1-2 days',
 usageCount: 89,
 lastUsed: '2024-11-17',
 tags: ['finance', 'approval', 'budget'],
 automationLevel: 'semi-automated',
 status: 'active'
},
 {
 id: 'WF-004',
 name: 'Production Day Checklist',
 description: 'Comprehensive checklist for production day operations',
 category: 'production',
 steps: 15,
 estimatedTime: '8-10 hours',
 usageCount: 67,
 lastUsed: '2024-11-16',
 tags: ['production', 'checklist', 'day-of'],
 automationLevel: 'manual',
 status: 'active'
},
 {
 id: 'WF-005',
 name: 'Vendor Onboarding',
 description: 'Streamlined process for onboarding new vendors and suppliers',
 category: 'logistics',
 steps: 10,
 estimatedTime: '3-5 days',
 usageCount: 34,
 lastUsed: '2024-11-10',
 tags: ['vendors', 'onboarding', 'compliance'],
 automationLevel: 'semi-automated',
 status: 'active'
},
 {
 id: 'WF-006',
 name: 'Incident Response Protocol',
 description: 'Emergency response workflow for on-site incidents',
 category: 'communication',
 steps: 7,
 estimatedTime: 'Immediate',
 usageCount: 12,
 lastUsed: '2024-11-05',
 tags: ['emergency', 'safety', 'communication'],
 automationLevel: 'semi-automated',
 status: 'active'
}
];

const categoryConfig = {
 'event-setup': { label: 'Event Setup', color: 'bg-ghxst-primary/20 text-ghxst-primary border-ghxst-primary/30'},
 'production': { label: 'Production', color: 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/30'},
 'logistics': { label: 'Logistics', color: 'bg-info/20 text-info border-info/30'},
 'maintenance': { label: 'Maintenance', color: 'bg-success/20 text-success border-success/30'},
 'approval': { label: 'Approval', color: 'bg-warning/20 text-warning border-warning/30'},
 'communication': { label: 'Communication', color: 'bg-compvss-cyan-500/20 text-compvss-cyan-500 border-compvss-cyan-500/30'}
};

const automationIcons = {
 'manual': Clock,
 'semi-automated': GitBranch,
 'fully-automated': Zap
};

export default function WorkflowsPage() {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState<string>('all');
 const [selectedAutomation, setSelectedAutomation] = useState<string>('all');

 const filteredWorkflows = useMemo(() => {
 return mockWorkflows.filter(workflow => {
 const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
 workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
 const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
 const matchesAutomation = selectedAutomation === 'all' || workflow.automationLevel === selectedAutomation;
 return matchesSearch && matchesCategory && matchesAutomation;
});
}, [searchQuery, selectedCategory, selectedAutomation]);

 const stats = useMemo(() => ({
 total: mockWorkflows.length,
 active: mockWorkflows.filter(w => w.status === 'active').length,
 automated: mockWorkflows.filter(w => w.automationLevel === 'fully-automated').length,
 totalUsage: mockWorkflows.reduce((sum, w) => sum + w.usageCount, 0)
}), []);

 return (
 <AtlvsLayout>
 <ContentLayout
 title="Workflow Library"
 description="Pre-configured workflows to streamline your operations"
 variant="atlvs"
 breadcrumbs={[
 { label: 'Home', href: '/atlvs'},
 { label: 'Workflows'}
 ]}
 primaryAction={{
 label: 'Create Workflow',
 icon: <Plus className="w-4 h-4" />,
 onClick: () => window.location.href = '/atlvs/workflows/new'
}}
 >
 {/* Stats Overview */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
 <Card variant="atlvs">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Total Workflows</BodyText>
 <SectionHeader className="mt-1">{stats.total}</SectionHeader>
 </div>
 <Workflow className="w-8 h-8 text-atlvs-primary" />
 </div>
 </CardContent>
 </Card>

 <Card variant="atlvs">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Active</BodyText>
 <SectionHeader className="mt-1">{stats.active}</SectionHeader>
 </div>
 <CheckCircle2 className="w-8 h-8 text-success" />
 </div>
 </CardContent>
 </Card>

 <Card variant="atlvs">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Automated</BodyText>
 <SectionHeader className="mt-1">{stats.automated}</SectionHeader>
 </div>
 <Zap className="w-8 h-8 text-warning" />
 </div>
 </CardContent>
 </Card>

 <Card variant="atlvs">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-muted-foreground">Total Usage</BodyText>
 <SectionHeader className="mt-1">{stats.totalUsage}</SectionHeader>
 </div>
 <Users className="w-8 h-8 text-atlvs-accent" />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Filters */}
 <Card variant="atlvs" className="mb-6">
 <CardContent className="pt-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="relative">
 <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <Input
 type="text"
 placeholder="Search workflows..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 variant="atlvs"
 className="ps-10"
 />
 </div>

 <Select
 value={selectedCategory}
 onChange={(e) => setSelectedCategory(e.target.value)}
 variant="atlvs"
 >
 <option value="all">All Categories</option>
 <option value="event-setup">Event Setup</option>
 <option value="production">Production</option>
 <option value="logistics">Logistics</option>
 <option value="maintenance">Maintenance</option>
 <option value="approval">Approval</option>
 <option value="communication">Communication</option>
 </Select>

 <Select
 value={selectedAutomation}
 onChange={(e) => setSelectedAutomation(e.target.value)}
 variant="atlvs"
 >
 <option value="all">All Automation Levels</option>
 <option value="manual">Manual</option>
 <option value="semi-automated">Semi-Automated</option>
 <option value="fully-automated">Fully Automated</option>
 </Select>
 </div>
 </CardContent>
 </Card>

 {/* Workflow Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredWorkflows.map((workflow, index) => {
 const AutomationIcon = automationIcons[workflow.automationLevel];
 const categoryStyle = categoryConfig[workflow.category];

 return (
 <motion.div
 key={workflow.id}
 initial={{ opacity: 0, y: 20}}
 animate={{ opacity: 1, y: 0}}
 transition={{ delay: index * 0.05}}
 >
 <Card variant="atlvs" className="h-full hover:border-atlvs-primary/50 transition-colors">
 <CardHeader>
 <div className="flex items-start justify-between mb-3">
 <Badge className={categoryStyle.color}>
 {categoryStyle.label}
 </Badge>
 <AutomationIcon className="w-5 h-5 text-muted-foreground" />
 </div>

 <TypographyCardTitle className="mb-2">{workflow.name}</TypographyCardTitle>
 <CardDescription>{workflow.description}</CardDescription>

 <div className="mt-4 space-y-2">
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Steps</BodyText>
 <BodyText>{workflow.steps}</BodyText>
 </div>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Est. Time</BodyText>
 <BodyText>{workflow.estimatedTime}</BodyText>
 </div>
 <div className="flex items-center justify-between">
 <BodyText className="text-muted-foreground">Usage</BodyText>
 <BodyText>{workflow.usageCount}x</BodyText>
 </div>
 </div>

 <div className="mt-4 flex flex-wrap gap-2">
 {workflow.tags.map(tag => (
 <Badge key={tag} variant="atlvs-outline">
 {tag}
 </Badge>
 ))}
 </div>
 </CardHeader>

 <CardContent>
 <div className="flex items-center gap-2">
 <Button variant="atlvs" size="sm" className="flex-1" asChild>
 <Link href={`/atlvs/workflows/${workflow.id}`}>
 <Play className="w-4 h-4 me-2" />
 Use Workflow
 </Link>
 </Button>
 <Button variant="outline" size="sm" asChild>
 <Link href={`/atlvs/workflows/${workflow.id}/edit`}>
 <Edit className="w-4 h-4" />
 </Link>
 </Button>
 <Button variant="outline" size="sm">
 <Copy className="w-4 h-4" />
 </Button>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 );
})}
 </div>

 {filteredWorkflows.length === 0 && (
 <Card variant="atlvs">
 <CardContent className="py-12 text-center">
 <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
 <SectionHeader className="mb-2">No workflows found</SectionHeader>
 <BodyText className="text-muted-foreground">
 Try adjusting your filters or create a new workflow
 </BodyText>
 </CardContent>
 </Card>
 )}
 </ContentLayout>
 </AtlvsLayout>
 );
}
