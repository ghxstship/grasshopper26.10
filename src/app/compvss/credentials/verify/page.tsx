'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Shield, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { useCredential } from '@/lib/hooks/compvss/useCredentials';

export default function CredentialVerifyPage() {
  const [searchId, setSearchId] = useState('');
  const [queriedId, setQueriedId] = useState<string | undefined>(undefined);
  const { data: credential, isLoading, error } = useCredential(queriedId);

  const handleSearch = () => {
    if (searchId.trim()) {
      setQueriedId(searchId.trim());
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Credentials', href: '/compvss/credentials/vault' },
    { label: 'Verify', href: '/compvss/credentials/verify' },
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bebas compvss-text-gradient">Verify Credentials</h1>
          <p className="text-gray-400 font-oswald mt-1">Check credential authenticity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="compvss" className="bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-compvss-cyan-500" />
                    Verify Credential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Enter credential ID or certificate number..."
                        className="pl-12 bg-black/50 border-compvss-cyan-500/30 h-12"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button 
                      variant="compvss" 
                      size="lg" 
                      className="w-full"
                      onClick={handleSearch}
                      disabled={!searchId.trim() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Verify Credential
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search Results */}
            {queriedId && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
                <Card variant="compvss" className="bg-gray-900/50">
                  <CardHeader>
                    <CardTitle className="text-white">Verification Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                        <h3 className="text-lg font-bebas text-white mb-2">Credential Not Found</h3>
                        <p className="text-gray-400 text-sm">The credential ID you entered could not be verified.</p>
                      </div>
                    ) : credential ? (
                      <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-5 h-5 text-compvss-cyan-500" />
                              <h3 className="font-oswald text-white text-lg">{credential.name}</h3>
                            </div>
                            <p className="text-sm text-gray-400 font-share-tech mb-2">
                              {credential.type}
                            </p>
                            <div className="flex gap-4 text-xs text-gray-500 font-share-tech">
                              <span>Issued: {credential.issuedDate ? new Date(credential.issuedDate).toLocaleDateString() : 'N/A'}</span>
                              {credential.expiryDate && (
                                <span>Expires: {new Date(credential.expiryDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={credential.status === 'verified' ? 'success' : credential.status === 'expired' ? 'error' : 'warning'}
                            className="flex items-center gap-1"
                          >
                            {credential.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {credential.status}
                          </Badge>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card variant="compvss" className="bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Verification Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-400 font-share-tech">
                    <p>Enter a credential ID to verify its authenticity and check expiration status.</p>
                    <div className="pt-3 border-t border-gray-800">
                      <p className="text-xs text-gray-500">Supported credentials:</p>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li>• Safety certifications</li>
                        <li>• Professional licenses</li>
                        <li>• Training certificates</li>
                        <li>• Background checks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </CompvssLayout>
  );
}
