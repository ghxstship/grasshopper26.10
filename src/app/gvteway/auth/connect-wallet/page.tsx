'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, Shield, Zap, Check,  } from 'lucide-react';
import { useAuth } from '@/lib/hooks/gvteway/useAuth';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { connectWallet } from '@/lib/integrations/crypto/payment';


export default function ConnectWalletPage() { 
  const router = useRouter();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const { data,  } = useAuth();
  const WALLETS = (data as any)?.wallets || [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', popular: true },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', popular: true },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '💼', popular: false },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈', popular: false },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', popular: false },
    { id: 'phantom', name: 'Phantom', icon: '👻', popular: false },
  ];

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId);
    setError(null);

    try {
      if (walletId === 'metamask') {
        const connection = await connectWallet();
        setConnectedAddress(connection.address);
        
        // Store wallet address in session/local storage
        localStorage.setItem('walletAddress', connection.address);
        
        // Redirect to dashboard or previous page
        setTimeout(() => {
          router.push('/gvteway/dashboard');
        }, 1500);
      } else {
        // For other wallets, show not implemented message
        setError(`${WALLETS.find(w => w.id === walletId)?.name} integration coming soon!`);
        setConnecting(null);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setConnecting(null);
    }
  };

  return (
    <GvtewayLayout showNav={false}>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <Link href="/gvteway">
              <h1 className="text-5xl font-anton gvteway-text-gradient mb-2 cursor-pointer">
                GVTEWAY
              </h1>
            </Link>
            <p className="text-gray-400 font-oswald">Connect your crypto wallet</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-gvteway-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-gvteway-red-500" />
                </div>
                <h3 className="font-bebas text-lg mb-2">Secure</h3>
                <p className="text-sm text-gray-400">Your keys, your crypto. We never store your private keys</p>
              </CardContent>
            </Card>

            <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-gvteway-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-gvteway-blue-500" />
                </div>
                <h3 className="font-bebas text-lg mb-2">Fast</h3>
                <p className="text-sm text-gray-400">Instant connection with one-click authentication</p>
              </CardContent>
            </Card>

            <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-atlvs-purple-500" />
                </div>
                <h3 className="font-bebas text-lg mb-2">NFT Tickets</h3>
                <p className="text-sm text-gray-400">Access blockchain-based tickets and credentials</p>
              </CardContent>
            </Card>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Choose Your Wallet</CardTitle>
              <CardDescription className="text-gray-400">
                Select a wallet to connect to GVTEWAY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {WALLETS.map((wallet) => (
                  <Button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    disabled={connecting !== null}
                    variant="ghost"
                    className="relative p-4 rounded-xl border-2 border-gray-700 hover:border-gvteway-red-500 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{wallet.name}</span>
                          {wallet.popular && (
                            <span className="text-xs bg-gvteway-red-500/20 text-gvteway-red-500 px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <Wallet className="w-5 h-5 text-gray-500 group-hover:text-gvteway-red-500 transition-colors" />
                    </div>
                    {connecting === wallet.id && (
                      <span className="text-sm text-gray-400 absolute top-2 right-2">Connecting...</span>
                    )}
                  </Button>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {connectedAddress && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm text-center">
                    ✓ Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                <p className="text-sm text-gray-400 text-center">
                  Don&apos;t have a wallet?{' '}
                  <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-gvteway-red-500 hover:text-gvteway-red-400">
                    Learn how to create one
                  </a>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link href="/gvteway/auth/login" className="text-sm text-gray-500 hover:text-gray-400">
                  ← Use email instead
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
