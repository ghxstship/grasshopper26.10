import { ethers } from 'ethers';

export interface CryptoPaymentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface CryptoPaymentResponse {
  paymentAddress: string;
  amount: string;
  currency: string;
  transactionId: string;
  expiresAt: Date;
}

export interface WalletConnection {
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}

/**
 * Connect to user's crypto wallet (MetaMask, WalletConnect, etc.)
 */
export async function connectWallet(): Promise<WalletConnection> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No crypto wallet found. Please install MetaMask or another Web3 wallet.');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
      address,
      provider,
      signer,
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw new Error('Failed to connect to wallet. Please try again.');
  }
}

/**
 * Request crypto payment from connected wallet
 */
export async function requestPayment(
  connection: WalletConnection,
  recipientAddress: string,
  amountInEth: string
): Promise<ethers.TransactionResponse> {
  try {
    const tx = await connection.signer.sendTransaction({
      to: recipientAddress,
      value: ethers.parseEther(amountInEth),
    });

    return tx;
  } catch (error) {
    console.error('Payment request failed:', error);
    throw new Error('Payment request was rejected or failed.');
  }
}

/**
 * Verify transaction on blockchain
 */
export async function verifyTransaction(
  connection: WalletConnection,
  transactionHash: string
): Promise<ethers.TransactionReceipt | null> {
  try {
    const receipt = await connection.provider.getTransactionReceipt(transactionHash);
    return receipt;
  } catch (error) {
    console.error('Failed to verify transaction:', error);
    throw new Error('Failed to verify transaction on blockchain.');
  }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForConfirmation(
  transaction: ethers.TransactionResponse,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt | null> {
  try {
    const receipt = await transaction.wait(confirmations);
    return receipt;
  } catch (error) {
    console.error('Transaction confirmation failed:', error);
    throw new Error('Transaction failed or was not confirmed.');
  }
}

/**
 * Get current ETH to USD exchange rate (mock - use real API in production)
 */
export async function getEthToUsdRate(): Promise<number> {
  // In production, use a real price feed like Chainlink or CoinGecko API
  // For now, return a mock rate
  return 2000; // $2000 per ETH
}

/**
 * Convert USD amount to ETH
 */
export async function convertUsdToEth(usdAmount: number): Promise<string> {
  const rate = await getEthToUsdRate();
  const ethAmount = usdAmount / rate;
  return ethAmount.toFixed(6);
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(connection: WalletConnection): Promise<string> {
  try {
    const balance = await connection.provider.getBalance(connection.address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    throw new Error('Failed to retrieve wallet balance.');
  }
}

/**
 * Disconnect wallet
 */
export function disconnectWallet(): void {
  // Clear any stored wallet data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
  }
}

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
