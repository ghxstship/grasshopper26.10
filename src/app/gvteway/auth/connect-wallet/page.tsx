'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect with MetaMask wallet',
    icon: '🦊',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect with WalletConnect',
    icon: '🔗',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect with Coinbase Wallet',
    icon: '💼',
  },
];

export default function ConnectWalletPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletId: string) => {
    setError('');
    setIsConnecting(true);
    setSelectedWallet(walletId);

    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, integrate with actual wallet providers
      const response = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletType: walletId,
          address: '0x' + Math.random().toString(16).slice(2, 42),
        }),
      });

      if (response.ok) {
        router.push('/gvteway/dashboard?wallet=connected');
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ghxst-surface rounded-full mb-4">
              <Wallet className="w-8 h-8 text-ghxst-primary" />
            </div>
            <PageTitle className="mb-4 uppercase text-ghxst-primary">Connect Wallet</PageTitle>
            <BodyText className="text-ghxst-text-secondary max-w-lg mx-auto">
              Connect your crypto wallet to access NFT tickets, digital collectibles, and exclusive benefits
            </BodyText>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <BodyText className="text-destructive-foreground text-body-sm">{error}</BodyText>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
                className="w-full p-6 border-2 border-ghxst-border rounded-lg hover:border-ghxst-primary transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-h2">{wallet.icon}</div>
                  <div className="flex-1">
                    <SectionHeader className="text-ghxst-primary mb-1 group-hover:text-ghxst-black transition-colors">
                      {wallet.name}
                    </SectionHeader>
                    <Metadata className="text-ghxst-text-secondary">
                      {wallet.description}
                    </Metadata>
                  </div>
                  {isConnecting && selectedWallet === wallet.id ? (
                    <div className="w-6 h-6 border-2 border-ghxst-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-ghxst-text-secondary group-hover:text-ghxst-primary transition-colors" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 bg-ghxst-surface rounded-lg">
            <SectionHeader className="text-ghxst-primary mb-3">
              Why Connect a Wallet?
            </SectionHeader>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Access NFT tickets and digital collectibles
                </BodyText>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Secure and verifiable ticket ownership
                </BodyText>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Transfer tickets safely to friends
                </BodyText>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Unlock exclusive member benefits
                </BodyText>
              </li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/gvteway/dashboard')}
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </section>
    </GvtewayLayout>
  );
}
