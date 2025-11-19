'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useIntegrations } from '@/lib/hooks/atlvs/useIntegrations';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/settings/integrations

export default function IntegrationsSettingsPage() {
  const { integrations, isLoading, error, refetch } = useIntegrations();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="INTEGRATIONS"
          description="Loading integrations..."
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/settings' },
            { label: 'Integrations' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <BodyText className="text-grey-400">Loading integrations...</BodyText>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="INTEGRATIONS"
          description="Error loading integrations"
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/settings' },
            { label: 'Integrations' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Integrations</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
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
        title="INTEGRATIONS"
        description="Connect your favorite tools"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Integrations' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div >{integration.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{integration.name}</div>
                      <div className="text-body-sm text-grey-400 mb-3">{integration.description}</div>
                      {integration.connected ? (
                        <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Button variant="atlvs" size="sm">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
