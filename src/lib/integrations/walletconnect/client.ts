/**
 * WalletConnect Client Integration
 * Provides Web3 wallet authentication and connection management
 */

import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';
import type { SessionTypes } from '@walletconnect/types';

// Types
export interface WalletConnectConfig {
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  chains: string[];
  methods: string[];
  events: string[];
}

export interface WalletSession {
  topic: string;
  address: string;
  chainId: number;
  expiry: number;
  peer: {
    name: string;
    url: string;
    icons: string[];
  };
}

export interface SignMessageParams {
  message: string;
  address: string;
}

export interface SignTransactionParams {
  from: string;
  to: string;
  value: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
}

// WalletConnect Client Class
export class WalletConnectClient {
  private client: SignClient | null = null;
  private web3Modal: Web3Modal | null = null;
  private config: WalletConnectConfig;
  private session: SessionTypes.Struct | null = null;

  constructor(config: WalletConnectConfig) {
    this.config = config;
  }

  /**
   * Initialize WalletConnect client
   */
  async initialize(): Promise<void> {
    try {
      // Initialize Sign Client
      this.client = await SignClient.init({
        projectId: this.config.projectId,
        metadata: this.config.metadata,
      });

      // Initialize Web3Modal
      this.web3Modal = new Web3Modal({
        projectId: this.config.projectId,
        standaloneChains: this.config.chains,
        walletConnectVersion: 2,
      });

      // Set up event listeners
      this.setupEventListeners();

      // Restore existing session if available
      await this.restoreSession();
    } catch (error) {
      console.error('Failed to initialize WalletConnect:', error);
      throw error;
    }
  }

  /**
   * Connect to wallet
   */
  async connect(): Promise<WalletSession> {
    if (!this.client || !this.web3Modal) {
      throw new Error('WalletConnect client not initialized');
    }

    try {
      // Create pairing
      const { uri, approval } = await this.client.connect({
        requiredNamespaces: {
          eip155: {
            methods: this.config.methods,
            chains: this.config.chains,
            events: this.config.events,
          },
        },
      });

      // Open modal with URI
      if (uri) {
        await this.web3Modal.openModal({ uri });
      }

      // Await session approval
      this.session = await approval();

      // Close modal
      this.web3Modal.closeModal();

      return this.getSessionInfo();
    } catch (error) {
      this.web3Modal?.closeModal();
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    if (!this.client || !this.session) {
      return;
    }

    try {
      await this.client.disconnect({
        topic: this.session.topic,
        reason: {
          code: 6000,
          message: 'User disconnected',
        },
      });

      this.session = null;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }

  /**
   * Sign message with connected wallet
   */
  async signMessage(params: SignMessageParams): Promise<string> {
    if (!this.client || !this.session) {
      throw new Error('No active wallet session');
    }

    try {
      const result = await this.client.request({
        topic: this.session.topic,
        chainId: this.config.chains[0],
        request: {
          method: 'personal_sign',
          params: [params.message, params.address],
        },
      });

      return result as string;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  /**
   * Sign transaction with connected wallet
   */
  async signTransaction(params: SignTransactionParams): Promise<string> {
    if (!this.client || !this.session) {
      throw new Error('No active wallet session');
    }

    try {
      const result = await this.client.request({
        topic: this.session.topic,
        chainId: this.config.chains[0],
        request: {
          method: 'eth_signTransaction',
          params: [params],
        },
      });

      return result as string;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }

  /**
   * Send transaction with connected wallet
   */
  async sendTransaction(params: SignTransactionParams): Promise<string> {
    if (!this.client || !this.session) {
      throw new Error('No active wallet session');
    }

    try {
      const result = await this.client.request({
        topic: this.session.topic,
        chainId: this.config.chains[0],
        request: {
          method: 'eth_sendTransaction',
          params: [params],
        },
      });

      return result as string;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Get current session information
   */
  getSessionInfo(): WalletSession {
    if (!this.session) {
      throw new Error('No active wallet session');
    }

    const namespace = this.session.namespaces['eip155'];
    const account = namespace.accounts[0];
    const [, , address] = account.split(':');
    const chainId = parseInt(namespace.chains?.[0]?.split(':')[1] || '1');

    return {
      topic: this.session.topic,
      address,
      chainId,
      expiry: this.session.expiry,
      peer: {
        name: this.session.peer.metadata.name,
        url: this.session.peer.metadata.url,
        icons: this.session.peer.metadata.icons,
      },
    };
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.session !== null;
  }

  /**
   * Get connected address
   */
  getAddress(): string | null {
    if (!this.session) {
      return null;
    }

    try {
      const namespace = this.session.namespaces['eip155'];
      const account = namespace.accounts[0];
      const [, , address] = account.split(':');
      return address;
    } catch {
      return null;
    }
  }

  /**
   * Get connected chain ID
   */
  getChainId(): number | null {
    if (!this.session) {
      return null;
    }

    try {
      const namespace = this.session.namespaces['eip155'];
      const chainId = parseInt(namespace.chains?.[0]?.split(':')[1] || '1');
      return chainId;
    } catch {
      return null;
    }
  }

  /**
   * Switch chain
   */
  async switchChain(chainId: number): Promise<void> {
    if (!this.client || !this.session) {
      throw new Error('No active wallet session');
    }

    try {
      await this.client.request({
        topic: this.session.topic,
        chainId: `eip155:${chainId}`,
        request: {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        },
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    if (!this.client) return;

    // Session proposal
    this.client.on('session_proposal', (proposal) => {
      console.log('Session proposal:', proposal);
    });

    // Session created
    this.client.on('session_event', (event) => {
      console.log('Session event:', event);
    });

    // Session updated
    this.client.on('session_update', ({ topic, params }) => {
      console.log('Session updated:', topic, params);
      const { namespaces } = params;
      const session = this.client?.session.get(topic);
      if (session) {
        this.session = { ...session, namespaces };
      }
    });

    // Session deleted
    this.client.on('session_delete', () => {
      console.log('Session deleted');
      this.session = null;
    });
  }

  /**
   * Restore existing session
   */
  private async restoreSession(): Promise<void> {
    if (!this.client) return;

    const sessions = this.client.session.getAll();
    if (sessions.length > 0) {
      // Use the most recent session
      this.session = sessions[sessions.length - 1];
      console.log('Restored session:', this.session.topic);
    }
  }
}

// Default configuration
export const defaultWalletConnectConfig: WalletConnectConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  metadata: {
    name: 'GVTEWAY',
    description: 'Universal event ticketing and production management platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://gvteway.com',
    icons: ['https://gvteway.com/icon.png'],
  },
  chains: ['eip155:1', 'eip155:137'], // Ethereum mainnet and Polygon
  methods: [
    'eth_sendTransaction',
    'eth_signTransaction',
    'eth_sign',
    'personal_sign',
    'eth_signTypedData',
  ],
  events: ['chainChanged', 'accountsChanged'],
};

// Singleton instance
let walletConnectClient: WalletConnectClient | null = null;

/**
 * Get WalletConnect client instance
 */
export function getWalletConnectClient(
  config: WalletConnectConfig = defaultWalletConnectConfig
): WalletConnectClient {
  if (!walletConnectClient) {
    walletConnectClient = new WalletConnectClient(config);
  }
  return walletConnectClient;
}

/**
 * Initialize WalletConnect
 */
export async function initializeWalletConnect(
  config?: WalletConnectConfig
): Promise<WalletConnectClient> {
  const client = getWalletConnectClient(config);
  await client.initialize();
  return client;
}
