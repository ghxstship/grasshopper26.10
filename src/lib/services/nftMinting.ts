/**
 * NFT Minting Service
 * Handles NFT ticket minting on Ethereum/Polygon
 */

import { mintNFT, uploadMetadataToIPFS } from '@/lib/integrations/web3';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export interface TicketNFTData {
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  seatNumber?: string;
  qrCode: string;
  ticketId: string;
}

export interface MintResult {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  metadataUri?: string;
  error?: string;
}

/**
 * Create NFT metadata for a ticket
 */
export function createTicketNFTMetadata(ticketData: TicketNFTData): NFTMetadata {
  const attributes = [
    { trait_type: 'Event', value: ticketData.eventName },
    { trait_type: 'Date', value: ticketData.eventDate },
    { trait_type: 'Venue', value: ticketData.venue },
    { trait_type: 'Ticket Type', value: ticketData.ticketType },
    { trait_type: 'Ticket ID', value: ticketData.ticketId },
  ];

  if (ticketData.seatNumber) {
    attributes.push({ trait_type: 'Seat', value: ticketData.seatNumber });
  }

  return {
    name: `${ticketData.eventName} - ${ticketData.ticketType}`,
    description: `Official NFT ticket for ${ticketData.eventName} at ${ticketData.venue} on ${ticketData.eventDate}`,
    image: ticketData.qrCode, // QR code as the image
    attributes,
    external_url: `https://gvteway.com/events/${ticketData.eventId}`,
  };
}

/**
 * Mint an NFT ticket
 */
export async function mintTicketNFT(
  ticketData: TicketNFTData,
  recipientAddress: string
): Promise<MintResult> {
  try {
    // Create metadata
    const metadata = createTicketNFTMetadata(ticketData);

    // Upload metadata to IPFS
    const metadataResult = await uploadMetadataToIPFS(metadata);
    
    if (!metadataResult.success || !metadataResult.data) {
      return {
        success: false,
        error: 'Failed to upload metadata to IPFS',
      };
    }

    const metadataUri = metadataResult.data.uri;

    // Mint NFT
    const mintResult = await mintNFT({
      to: recipientAddress,
      tokenURI: metadataUri,
      metadata: {
        eventId: ticketData.eventId,
        ticketId: ticketData.ticketId,
      },
    });

    if (!mintResult.success || !mintResult.data) {
      return {
        success: false,
        error: mintResult.error || 'Failed to mint NFT',
      };
    }

    return {
      success: true,
      tokenId: mintResult.data.tokenId,
      transactionHash: mintResult.data.transactionHash,
      metadataUri,
    };
  } catch (error) {
    console.error('NFT minting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'NFT minting failed',
    };
  }
}

/**
 * Batch mint NFT tickets
 */
export async function batchMintTicketNFTs(
  tickets: Array<{ ticketData: TicketNFTData; recipientAddress: string }>
): Promise<MintResult[]> {
  const results: MintResult[] = [];

  for (const ticket of tickets) {
    const result = await mintTicketNFT(ticket.ticketData, ticket.recipientAddress);
    results.push(result);
  }

  return results;
}

/**
 * Check if an address owns a specific ticket NFT
 */
export async function verifyTicketNFTOwnership(
  ticketId: string,
  ownerAddress: string
): Promise<boolean> {
  try {
    // This would query the blockchain to verify ownership
    // Implementation depends on your smart contract
    const response = await fetch('/api/nft/verify-ownership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, ownerAddress }),
    });

    const data = await response.json();
    return data.isOwner === true;
  } catch (error) {
    console.error('Ownership verification error:', error);
    return false;
  }
}

/**
 * Transfer ticket NFT to another address
 */
export async function transferTicketNFT(
  tokenId: string,
  fromAddress: string,
  toAddress: string
): Promise<MintResult> {
  try {
    const response = await fetch('/api/nft/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId, fromAddress, toAddress }),
    });

    if (!response.ok) {
      throw new Error('Transfer failed');
    }

    const data = await response.json();
    return {
      success: true,
      transactionHash: data.transactionHash,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transfer failed',
    };
  }
}

/**
 * Get NFT metadata from token ID
 */
export async function getTicketNFTMetadata(tokenId: string): Promise<NFTMetadata | null> {
  try {
    const response = await fetch(`/api/nft/metadata/${tokenId}`);
    
    if (!response.ok) {
      return null;
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Failed to fetch NFT metadata:', error);
    return null;
  }
}

/**
 * Burn (destroy) a ticket NFT
 */
export async function burnTicketNFT(tokenId: string): Promise<MintResult> {
  try {
    const response = await fetch('/api/nft/burn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId }),
    });

    if (!response.ok) {
      throw new Error('Burn failed');
    }

    const data = await response.json();
    return {
      success: true,
      transactionHash: data.transactionHash,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Burn failed',
    };
  }
}
