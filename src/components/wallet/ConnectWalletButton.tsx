/**
 * Connect Wallet Button Component
 * Provides UI for connecting Web3 wallets via WalletConnect
 */

'use client';

import { useState } from 'react';
import { Wallet, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface ConnectWalletButtonProps {
  onConnect?: (address: string) => void;
  onError?: (error: string) => void;
  variant?: 'gvteway' | 'compvss' | 'atlvs';
  className?: string;
}

export function ConnectWalletButton({
  onConnect,
  onError,
  variant = 'gvteway',
  className,
}: ConnectWalletButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setStatus('connecting');
    setErrorMessage('');

    try {
      // Note: This is a placeholder implementation
      // In production, you would:
      // 1. Initialize WalletConnect client
      // 2. Connect to wallet
      // 3. Sign authentication message
      // 4. Call authentication API
      // 5. Handle session creation

      // Simulated connection flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      setStatus('success');
      onConnect?.(mockAddress);

      // Reset after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setStatus('error');
      setErrorMessage(message);
      onError?.(message);

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'connecting':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            Connected!
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="w-4 h-4" />
            {errorMessage || 'Connection Failed'}
          </>
        );
      default:
        return (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        );
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant={variant}
      className={className}
    >
      {getButtonContent()}
    </Button>
  );
}

/**
 * Wallet Connection Card Component
 * Full card UI for wallet connection with status
 */
interface WalletConnectionCardProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  variant?: 'gvteway' | 'compvss' | 'atlvs';
  className?: string;
}

export function WalletConnectionCard({
  onConnect,
  onDisconnect,
  variant = 'gvteway',
  className,
}: WalletConnectionCardProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const handleConnect = (connectedAddress: string) => {
    setIsConnected(true);
    setAddress(connectedAddress);
    onConnect?.(connectedAddress);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    onDisconnect?.();
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (isConnected) {
    return (
      <div className={`p-6 rounded-lg border ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-semibold">Wallet Connected</p>
              <p className="text-body-sm text-gray-400">{formatAddress(address)}</p>
            </div>
          </div>
          <Button
            onClick={handleDisconnect}
            variant={variant}
            size="sm"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg border ${className}`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center">
          <Wallet className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="font-semibold text-h6 mb-2">Connect Your Wallet</h3>
          <p className="text-body-sm text-gray-400 mb-4">
            Connect your Web3 wallet to access exclusive features and NFT tickets
          </p>
        </div>
        <ConnectWalletButton
          onConnect={handleConnect}
          variant={variant}
          className="w-full"
        />
      </div>
    </div>
  );
}
