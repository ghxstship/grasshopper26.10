/**
 * WalletConnect Authentication Integration
 * Provides authentication using Web3 wallets
 */

import { prisma } from '@/lib/prisma';
import type { WalletConnectClient } from './client';

// Types
export interface WalletAuthParams {
  address: string;
  signature: string;
  message: string;
  chainId: number;
}

export interface WalletAuthResult {
  success: boolean;
  userId?: string;
  walletId?: string;
  error?: string;
}

/**
 * Generate authentication message for wallet signing
 */
export function generateAuthMessage(address: string, nonce: string): string {
  const timestamp = new Date().toISOString();
  return `Sign this message to authenticate with GVTEWAY

Address: ${address}
Nonce: ${nonce}
Timestamp: ${timestamp}

This request will not trigger a blockchain transaction or cost any gas fees.`;
}

/**
 * Generate a random nonce for authentication
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Verify wallet signature
 */
export async function verifyWalletSignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    // Note: In production, you would use a library like ethers.js or viem
    // to verify the signature on the server side
    // For now, we'll implement a basic check
    
    // This is a placeholder - implement proper signature verification
    // using ethers.js verifyMessage or similar
    if (!signature || signature.length < 132) {
      return false;
    }

    // Signature should start with 0x
    if (!signature.startsWith('0x')) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to verify signature:', error);
    return false;
  }
}

/**
 * Authenticate user with wallet
 */
export async function authenticateWithWallet(
  params: WalletAuthParams
): Promise<WalletAuthResult> {
  try {
    const { address, signature, message, chainId } = params;

    // Verify signature
    const isValid = await verifyWalletSignature(address, message, signature);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid signature',
      };
    }

    // Check if wallet exists
    let wallet = await prisma.cryptoWallet.findFirst({
      where: {
        address: address.toLowerCase(),
        type: 'ETHEREUM',
      },
      include: {
        user: true,
      },
    });

    // If wallet doesn't exist, create new user and wallet
    if (!wallet) {
      const user = await prisma.user.create({
        data: {
          email: `${address.toLowerCase()}@wallet.gvteway.com`,
          name: `User ${address.substring(0, 6)}`,
          role: 'CONSUMER',
          emailVerified: new Date(), // Wallet auth is considered verified
        },
      });

      wallet = await prisma.cryptoWallet.create({
        data: {
          userId: user.id,
          address: address.toLowerCase(),
          type: 'ETHEREUM',
          chainId,
          isVerified: true,
          isPrimary: true,
        },
        include: {
          user: true,
        },
      });
    }

    // Update last used timestamp
    await prisma.cryptoWallet.update({
      where: { id: wallet.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      success: true,
      userId: wallet.userId,
      walletId: wallet.id,
    };
  } catch (error) {
    console.error('Wallet authentication failed:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Link wallet to existing user
 */
export async function linkWalletToUser(
  userId: string,
  address: string,
  chainId: number
): Promise<WalletAuthResult> {
  try {
    // Check if wallet already exists
    const existingWallet = await prisma.cryptoWallet.findFirst({
      where: {
        address: address.toLowerCase(),
        type: 'ETHEREUM',
      },
    });

    if (existingWallet) {
      if (existingWallet.userId === userId) {
        return {
          success: true,
          userId,
          walletId: existingWallet.id,
        };
      } else {
        return {
          success: false,
          error: 'Wallet already linked to another account',
        };
      }
    }

    // Check if user already has a primary wallet
    const hasPrimaryWallet = await prisma.cryptoWallet.findFirst({
      where: {
        userId,
        isPrimary: true,
      },
    });

    // Create new wallet
    const wallet = await prisma.cryptoWallet.create({
      data: {
        userId,
        address: address.toLowerCase(),
        type: 'ETHEREUM',
        chainId,
        isVerified: true,
        isPrimary: !hasPrimaryWallet,
      },
    });

    return {
      success: true,
      userId,
      walletId: wallet.id,
    };
  } catch (error) {
    console.error('Failed to link wallet:', error);
    return {
      success: false,
      error: 'Failed to link wallet',
    };
  }
}

/**
 * Unlink wallet from user
 */
export async function unlinkWallet(
  userId: string,
  walletId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const wallet = await prisma.cryptoWallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet || wallet.userId !== userId) {
      return {
        success: false,
        error: 'Wallet not found or unauthorized',
      };
    }

    // Don't allow unlinking the last authentication method
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cryptoWallets: true,
        accounts: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const hasOtherAuth = user.accounts.length > 0 || user.cryptoWallets.length > 1;
    if (!hasOtherAuth) {
      return {
        success: false,
        error: 'Cannot unlink last authentication method',
      };
    }

    // Delete wallet
    await prisma.cryptoWallet.delete({
      where: { id: walletId },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to unlink wallet:', error);
    return {
      success: false,
      error: 'Failed to unlink wallet',
    };
  }
}

/**
 * Get user wallets
 */
export async function getUserWallets(userId: string) {
  return await prisma.cryptoWallet.findMany({
    where: { userId },
    orderBy: [
      { isPrimary: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

/**
 * Set primary wallet
 */
export async function setPrimaryWallet(
  userId: string,
  walletId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const wallet = await prisma.cryptoWallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet || wallet.userId !== userId) {
      return {
        success: false,
        error: 'Wallet not found or unauthorized',
      };
    }

    // Remove primary flag from other wallets
    await prisma.cryptoWallet.updateMany({
      where: {
        userId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set new primary wallet
    await prisma.cryptoWallet.update({
      where: { id: walletId },
      data: { isPrimary: true },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to set primary wallet:', error);
    return {
      success: false,
      error: 'Failed to set primary wallet',
    };
  }
}

/**
 * Client-side authentication flow
 */
export async function authenticateWithWalletClient(
  client: WalletConnectClient
): Promise<WalletAuthResult> {
  try {
    // Get address
    const address = client.getAddress();
    if (!address) {
      throw new Error('No wallet connected');
    }

    // Generate nonce and message
    const nonce = generateNonce();
    const message = generateAuthMessage(address, nonce);

    // Sign message
    const signature = await client.signMessage({ message, address });

    // Get chain ID
    const chainId = client.getChainId() || 1;

    // Call authentication API
    const response = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature,
        message,
        chainId,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Wallet authentication failed:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}
