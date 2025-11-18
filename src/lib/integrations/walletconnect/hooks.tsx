/**
 * WalletConnect React Hooks
 * Provides React hooks for WalletConnect integration
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { WalletConnectClient, WalletSession, SignMessageParams, SignTransactionParams } from './client';

// Context types
interface WalletConnectContextType {
  client: WalletConnectClient | null;
  session: WalletSession | null;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (params: SignMessageParams) => Promise<string>;
  signTransaction: (params: SignTransactionParams) => Promise<string>;
  sendTransaction: (params: SignTransactionParams) => Promise<string>;
  switchChain: (chainId: number) => Promise<void>;
}

// Create context
const WalletConnectContext = createContext<WalletConnectContextType | null>(null);

// Provider props
interface WalletConnectProviderProps {
  children: ReactNode;
  client: WalletConnectClient;
}

/**
 * WalletConnect Provider Component
 */
export function WalletConnectProvider({ children, client }: WalletConnectProviderProps) {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Initialize client
  useEffect(() => {
    const init = async () => {
      try {
        await client.initialize();
        
        // Check for existing session
        if (client.isConnected()) {
          const sessionInfo = client.getSessionInfo();
          setSession(sessionInfo);
          setAddress(sessionInfo.address);
          setChainId(sessionInfo.chainId);
        }
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
      }
    };

    init();
  }, [client]);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const sessionInfo = await client.connect();
      setSession(sessionInfo);
      setAddress(sessionInfo.address);
      setChainId(sessionInfo.chainId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [client]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      await client.disconnect();
      setSession(null);
      setAddress(null);
      setChainId(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, [client]);

  // Sign message
  const signMessage = useCallback(
    async (params: SignMessageParams) => {
      return await client.signMessage(params);
    },
    [client]
  );

  // Sign transaction
  const signTransaction = useCallback(
    async (params: SignTransactionParams) => {
      return await client.signTransaction(params);
    },
    [client]
  );

  // Send transaction
  const sendTransaction = useCallback(
    async (params: SignTransactionParams) => {
      return await client.sendTransaction(params);
    },
    [client]
  );

  // Switch chain
  const switchChain = useCallback(
    async (chainId: number) => {
      await client.switchChain(chainId);
      setChainId(chainId);
    },
    [client]
  );

  const value: WalletConnectContextType = {
    client,
    session,
    isConnected: session !== null,
    isConnecting,
    address,
    chainId,
    connect,
    disconnect,
    signMessage,
    signTransaction,
    sendTransaction,
    switchChain,
  };

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  );
}

/**
 * Hook to use WalletConnect context
 */
export function useWalletConnect(): WalletConnectContextType {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within WalletConnectProvider');
  }
  return context;
}

/**
 * Hook to get wallet connection status
 */
export function useWalletConnectionStatus() {
  const { isConnected, isConnecting, address, chainId } = useWalletConnect();
  return { isConnected, isConnecting, address, chainId };
}

/**
 * Hook to connect/disconnect wallet
 */
export function useWalletConnection() {
  const { connect, disconnect, isConnecting } = useWalletConnect();
  return { connect, disconnect, isConnecting };
}

/**
 * Hook to sign messages
 */
export function useWalletSigning() {
  const { signMessage, signTransaction, sendTransaction, address } = useWalletConnect();
  
  const sign = useCallback(
    async (message: string) => {
      if (!address) {
        throw new Error('No wallet connected');
      }
      return await signMessage({ message, address });
    },
    [signMessage, address]
  );

  return {
    signMessage: sign,
    signTransaction,
    sendTransaction,
  };
}

/**
 * Hook to manage chain switching
 */
export function useChainManagement() {
  const { chainId, switchChain } = useWalletConnect();
  
  const isCorrectChain = useCallback(
    (expectedChainId: number) => {
      return chainId === expectedChainId;
    },
    [chainId]
  );

  return {
    chainId,
    switchChain,
    isCorrectChain,
  };
}
