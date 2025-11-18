'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Key, Plus, Eye, EyeOff,  } from 'lucide-react';
import { useAutomation } from '@/lib/hooks/atlvs/useAutomation';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface Credential {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  status: string;
}

export default function WorkflowCredentialsPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { data,  } = useAutomation();
  const credentials: Credential[] = (data as { credentials?: Credential[] })?.credentials || [];

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CREDENTIALS"
        description="Manage workflow authentication"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Credentials' }
        ]}
        actions={[
          {
            label: 'Add Credential',
            onClick: () => {},
            icon: <Plus className="w-4 h-4" />,
            variant: 'atlvs' as const
          }
        ]}
      >

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Stored Credentials
            </CardTitle>
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium mb-1">{cred.name}</div>
                    <div className="text-sm text-gray-400">{cred.type} • Last used {cred.lastUsed}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="atlvs-outline"
                      className={cred.status === 'active' ? 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50' : 'bg-gray-500/20 text-gray-500 border-gray-500/50'}
                    >
                      {cred.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setShowKeys(prev => ({ ...prev, [cred.id]: !prev[cred.id] }))}>
                      {showKeys[cred.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
