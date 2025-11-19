'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Zap, DollarSign, FileText, MessageSquare, Calendar, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/atlvs/useIntegrations';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  FileText,
  MessageSquare,
  Calendar,
  Mail,
  Zap,
};

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/integrations

export default function IntegrationsPage() {
  const { integrations, isLoading, error, refetch } = useIntegrations();
  
  // Fallback data for when API is not ready
  const fallbackIntegrations = [
    { 
      id: 'stripe', 
      name: 'Stripe', 
      description: 'Accept payments and manage subscriptions', 
      icon: DollarSign,
      connected: true,
      href: '/atlvs/integrations/stripe'
    },
    { 
      id: 'quickbooks', 
      name: 'QuickBooks', 
      description: 'Sync financial data and invoices', 
      icon: FileText,
      connected: false,
      href: '/atlvs/integrations/quickbooks'
    },
    { 
      id: 'slack', 
      name: 'Slack', 
      description: 'Team communication and notifications', 
      icon: MessageSquare,
      connected: true,
      href: '/atlvs/integrations/slack'
    },
    { 
      id: 'google', 
      name: 'Google Workspace', 
      description: 'Calendar, Drive, and Gmail integration', 
      icon: Calendar,
      connected: true,
      href: '/atlvs/integrations/google'
    },
    { 
      id: 'microsoft', 
      name: 'Microsoft 365', 
      description: 'Outlook, Teams, and OneDrive', 
      icon: Mail,
      connected: false,
      href: '/atlvs/integrations/microsoft'
    },
    { 
      id: 'zapier', 
      name: 'Zapier', 
      description: 'Connect to 5000+ apps with automation', 
      icon: Zap,
      connected: false,
      href: '/atlvs/integrations/zapier'
    }
  ];
  
  const displayIntegrations = integrations.length > 0 ? integrations : fallbackIntegrations;
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <BodyText className="text-grey-400">Loading integrations...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Integrations</SectionHeader>
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
        title="INTEGRATIONS"
        description="Connect your favorite tools and services"
        breadcrumbs={[
          { label: 'Integrations' }
        ]}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Available integrations">
            {displayIntegrations.map((integration) => {
              const _IconComponent = typeof integration.icon === 'string' ? iconMap[integration.icon] || Zap : integration.icon;
              const Icon = integration.icon;
              return (
                <Card key={integration.id} variant="atlvs" className="bg-grey-900/50" role="listitem">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-atlvs-green-500/10 border border-atlvs-green-500/20" aria-hidden="true">
                          <Icon className="w-6 h-6 text-atlvs-green-500" aria-hidden="true" />
                        </div>
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          {integration.connected && (
                            <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50 mt-1" role="status" aria-label="Integration connected">
                              <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                              Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-grey-400 mb-4">{integration.description}</p>
                    <div className="flex gap-2">
                      <Link href={integration.href} className="flex-1">
                        <Button variant="atlvs" size="sm" className="w-full" aria-label={`Configure ${integration.name} integration`}>
                          Configure
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" aria-label={`Open ${integration.name} documentation in new window`}>
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
