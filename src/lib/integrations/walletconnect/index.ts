/**
 * WalletConnect Integration
 * Complete Web3 wallet authentication and connection management
 */

// Client
export {
  WalletConnectClient,
  getWalletConnectClient,
  initializeWalletConnect,
  defaultWalletConnectConfig,
  type WalletConnectConfig,
  type WalletSession,
  type SignMessageParams,
  type SignTransactionParams,
} from './client';

// Hooks
export {
  WalletConnectProvider,
  useWalletConnect,
  useWalletConnectionStatus,
  useWalletConnection,
  useWalletSigning,
  useChainManagement,
} from './hooks';

// Authentication
export {
  generateAuthMessage,
  generateNonce,
  verifyWalletSignature,
  authenticateWithWallet,
  authenticateWithWalletClient,
  linkWalletToUser,
  unlinkWallet,
  getUserWallets,
  setPrimaryWallet,
  type WalletAuthParams,
  type WalletAuthResult,
} from './auth';
