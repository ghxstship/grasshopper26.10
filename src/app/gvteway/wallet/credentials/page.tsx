'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Shield, Plus, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useProfile } from '@/lib/hooks/shared/useProfile';

export default function CredentialsPage() {
  const { data: profile, isLoading, isError } = useProfile();
  const credentials = profile?.credentials || [];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading credentials...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (isError) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Credentials</h2>
            <p className="text-gray-400">Unable to load your credentials</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-bebas gvteway-text-gradient">CREDENTIALS</h1>
                <Button variant="gvteway">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Credential
                </Button>
              </div>
              <div className="space-y-4">
                {credentials.map((cred) => (
                  <Card key={cred.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Shield className="w-8 h-8 text-gvteway-blue-500" />
                          <div>
                            <h3 className="text-xl font-bebas text-white">{cred.name}</h3>
                            <p className="text-gray-400 text-sm">{cred.type}</p>
                          </div>
                        </div>
                        <Badge variant={cred.verified ? 'gvteway' : 'default'}>
                          {cred.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
