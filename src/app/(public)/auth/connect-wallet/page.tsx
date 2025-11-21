/**
 * Connect Wallet Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Wallet, Shield, Zap } from 'lucide-react';

export default function ConnectWalletPage() {
  const [connecting, setConnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConnectMetaMask = async () => {
    setConnecting(true);
    setError(null);
    try {
      // TODO: Implement MetaMask connection
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to connect MetaMask');
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectWalletConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      // TODO: Implement WalletConnect connection
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectCoinbase = async () => {
    setConnecting(true);
    setError(null);
    try {
      // TODO: Implement Coinbase Wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to connect Coinbase Wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <H1 className="mb-4">Connect Your Wallet</H1>
          <Body className="text-gray-600">
            Connect your Web3 wallet to mint NFT tickets and access blockchain features
          </Body>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <H3 className="mb-2">Secure</H3>
              <Body className="text-gray-600 text-sm">
                Your keys, your crypto. We never access your wallet.
              </Body>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <H3 className="mb-2">Fast</H3>
              <Body className="text-gray-600 text-sm">
                Connect in seconds and start minting NFTs instantly.
              </Body>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-8">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <H3 className="mb-2">Compatible</H3>
              <Body className="text-gray-600 text-sm">
                Works with all major Web3 wallets and providers.
              </Body>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>MetaMask</CardTitle>
                  <CardDescription>Most popular Web3 wallet</CardDescription>
                </div>
                <Button 
                  variant="primary"
                  onClick={handleConnectMetaMask}
                  disabled={connecting}
                  loading={connecting}
                >
                  Connect
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>WalletConnect</CardTitle>
                  <CardDescription>Connect with mobile wallets</CardDescription>
                </div>
                <Button 
                  variant="primary"
                  onClick={handleConnectWalletConnect}
                  disabled={connecting}
                  loading={connecting}
                >
                  Connect
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Coinbase Wallet</CardTitle>
                  <CardDescription>Secure wallet from Coinbase</CardDescription>
                </div>
                <Button 
                  variant="primary"
                  onClick={handleConnectCoinbase}
                  disabled={connecting}
                  loading={connecting}
                >
                  Connect
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="py-6">
            <Body className="text-gray-600 text-sm text-center">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
              Your wallet address will be used to mint and transfer NFT tickets.
            </Body>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
