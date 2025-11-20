/**
 * NFT Service
 * Manages NFT minting, transfers, and metadata
 */

import { ethers } from 'ethers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class NFTService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contractAddress: string;

  constructor() {
    this.contractAddress = process.env.NFT_CONTRACT_ADDRESS || '';

    if (process.env.ETHEREUM_RPC_URL) {
      this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    }
  }

  /**
   * Mint NFT ticket
   */
  async mintTicketNFT(ticketId: string): Promise<{
    success: boolean;
    tokenId?: number;
    transactionHash?: string;
    error?: string;
    metadata?: {
      name: string;
      description: string;
      image: string;
      attributes: {
        trait_type: string;
        value: string;
      }[];
    };
  }> {
    try {
      if (!this.provider) {
        throw new Error('Ethereum provider not configured');
      }

      // Get ticket details
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
          event: true,
          ticketType: true,
        },
      });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Generate metadata
      const metadata = {
        name: `${ticket.event.name} - ${ticket.ticketType.name}`,
        description: ticket.event.description || '',
        image: ticket.event.imageUrl || '',
        attributes: [
          { trait_type: 'Event', value: ticket.event.name },
          { trait_type: 'Ticket Type', value: ticket.ticketType.name },
          { trait_type: 'Ticket ID', value: ticket.id },
          { trait_type: 'Event Date', value: ticket.event.startDate.toISOString() },
        ],
      };

      // In production, this would interact with smart contract
      // For now, return placeholder
      const tokenId = Math.floor(Math.random() * 1000000);
      const transactionHash = `0x${Math.random().toString(16).substring(2)}`;

      // Update ticket metadata with NFT info
      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          metadata: {
            nftTokenId: tokenId.toString(),
            nftContractAddress: this.contractAddress,
          } as Prisma.InputJsonValue,
        },
      });

      // Update ticket with NFT info
      await prisma.nFTTicket.create({
        data: {
          ticketId,
          tokenId: tokenId.toString(),
          contractAddress: this.contractAddress,
          chain: 'ethereum',
          metadataUri: `ipfs://${tokenId}`,
          ownerAddress: ticket.userId,
        },
      });

      return {
        success: true as const,
        tokenId,
        transactionHash,
        metadata,
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Transfer NFT
   */
  async transferNFT(tokenId: string, fromAddress: string, toAddress: string) {
    try {
      if (!this.provider) {
        throw new Error('Ethereum provider not configured');
      }

      // In production, interact with smart contract
      const transactionHash = `0x${Math.random().toString(16).substring(2)}`;

      // Update NFT ticket ownership
      await prisma.nFTTicket.updateMany({
        where: { tokenId: tokenId.toString() },
        data: {
          ownerAddress: toAddress,
        },
      });

      return {
        success: true,
        transactionHash,
      };
    } catch (error) {
      console.error('Error transferring NFT:', error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get NFT metadata
   */
  async getNFTMetadata(tokenId: string) {
    try {
      const nftTicket = await prisma.nFTTicket.findFirst({
        where: { tokenId },
        include: {
          ticket: {
            include: {
              event: true,
              ticketType: true,
            },
          },
        },
      });

      if (!nftTicket) {
        throw new Error('NFT not found');
      }

      const ticket = nftTicket.ticket;

      if (!ticket) {
        return {
          success: false,
          error: 'NFT not found',
        };
      }

      const metadata = {
        name: `${ticket.event.name} - ${ticket.ticketType.name}`,
        description: ticket.event.description || '',
        image: ticket.event.imageUrl || '',
        attributes: [
          { trait_type: 'Event', value: ticket.event.name },
          { trait_type: 'Ticket Type', value: ticket.ticketType.name },
          { trait_type: 'Ticket ID', value: ticket.id },
          { trait_type: 'Event Date', value: ticket.event.startDate.toISOString() },
        ],
      };

      return {
        success: true,
        metadata,
      };
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify NFT ownership
   */
  async verifyOwnership(tokenId: string, address: string): Promise<boolean> {
    try {
      if (!this.provider) {
        return false;
      }

      // In production, query smart contract
      // For now, check database
      const nftTicketExists = await prisma.nFTTicket.findFirst({
        where: {
          tokenId,
          ownerAddress: address,
        },
      });

      return !!nftTicketExists;
    } catch (error) {
      console.error('Error verifying NFT ownership:', error);
      return false;
    }
  }

  /**
   * Get user's NFTs
   */
  async getUserNFTs(userId: string) {
    try {
      const nftTickets = await prisma.nFTTicket.findMany({
        where: {
          ticket: {
            userId,
          },
        },
        include: {
          ticket: {
            include: {
              event: true,
              ticketType: true,
            },
          },
        },
        orderBy: { mintedAt: 'desc' },
      });

      return {
        success: true,
        nfts: nftTickets.map((nft) => ({
          tokenId: nft.tokenId,
          contractAddress: nft.contractAddress,
          name: `${nft.ticket.event.name} - ${nft.ticket.ticketType.name}`,
          image: nft.ticket.event.imageUrl,
          ticketId: nft.ticket.id,
        })),
      };
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Burn NFT
   */
  async burnNFT(tokenId: string) {
    try {
      if (!this.provider) {
        throw new Error('Ethereum provider not configured');
      }

      // In production, interact with smart contract
      const transactionHash = `0x${Math.random().toString(16).substring(2)}`;

      // Delete NFT ticket record
      await prisma.nFTTicket.deleteMany({
        where: { tokenId },
      });

      return {
        success: true,
        transactionHash,
      };
    } catch (error) {
      console.error('Error burning NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const nftService = new NFTService();
