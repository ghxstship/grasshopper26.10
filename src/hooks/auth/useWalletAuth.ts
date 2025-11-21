import { useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface WalletAuthResult {
  success: boolean;
  address?: string;
  error?: string;
}

export function useWalletAuth() {
  const { data: session, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async (): Promise<WalletAuthResult> => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const address = accounts[0];

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Create message to sign
      const message = `Sign this message to authenticate with GVTEWAY.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Verify signature and link wallet to account
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          chainId: parseInt(chainId, 16),
          message,
          signature,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Wallet authentication failed');
      }

      setConnectedAddress(address);

      // If user is not logged in, sign them in with wallet
      if (!session) {
        await signIn('credentials', {
          walletAddress: address,
          signature,
          redirect: false,
        });
      } else {
        // Update session to include wallet info
        await update({
          walletAddress: address,
        });
      }

      return {
        success: true,
        address,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wallet connection failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsConnecting(false);
    }
  }, [session, update]);

  const disconnectWallet = useCallback(async () => {
    setConnectedAddress(null);
    setError(null);

    if (session) {
      await update({
        walletAddress: null,
      });
    }
  }, [session, update]);

  return {
    connectWallet,
    disconnectWallet,
    isConnecting,
    connectedAddress: connectedAddress || (session?.user as any)?.walletAddress,
    error,
  };
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
