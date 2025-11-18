/**
 * NFT Minting Integration (Ethereum/Polygon)
 * Agent 6: Integration Specialist
 */

import { createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  animation_url?: string;
  background_color?: string;
}

export interface MintNFTParams {
  recipientAddress: string;
  metadata: NFTMetadata;
  tokenId?: string;
  chain?: 'ethereum' | 'polygon';
}

export interface NFTContract {
  address: string;
  chain: 'ethereum' | 'polygon';
  abi: unknown[];
}

/**
 * Initialize Web3 provider
 */
export async function initWeb3Provider(
  chain: 'ethereum' | 'polygon' = 'polygon'
): Promise<IntegrationResponse<{ provider: string; chainId: number }>> {
  try {
    const rpcUrl =
      chain === 'ethereum'
        ? process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/...'
        : process.env.POLYGON_RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/...';

    const chainId = chain === 'ethereum' ? 1 : 137;

    if (!rpcUrl || rpcUrl.includes('...')) {
      return createErrorResponse(
        'WEB3_MISSING_RPC',
        `${chain} RPC URL is not configured`
      );
    }

    const { JsonRpcProvider } = await import('ethers');
    const provider = new JsonRpcProvider(rpcUrl);
    await provider.getNetwork();

    return createSuccessResponse({ provider: rpcUrl, chainId });
  } catch (error) {
    return createErrorResponse(
      'WEB3_INIT_ERROR',
      error instanceof Error ? error.message : 'Failed to initialize Web3 provider',
      error
    );
  }
}

/**
 * Upload metadata to IPFS
 */
export async function uploadToIPFS(
  metadata: NFTMetadata
): Promise<IntegrationResponse<{ ipfsUrl: string; cid: string }>> {
  try {
    const ipfsApiKey = process.env.IPFS_API_KEY;
    const ipfsSecret = process.env.IPFS_API_SECRET;

    if (!ipfsApiKey || !ipfsSecret) {
      return createErrorResponse(
        'IPFS_MISSING_CREDENTIALS',
        'IPFS credentials are not configured'
      );
    }

    // Upload to Pinata IPFS
    const pinataUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    const response = await fetch(pinataUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: ipfsApiKey,
        pinata_secret_api_key: ipfsSecret,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${metadata.name}-metadata`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('IPFS upload failed');
    }

    const result = await response.json();
    const cid = result.IpfsHash;
    const ipfsUrl = `ipfs://${cid}`;

    return createSuccessResponse({ ipfsUrl, cid });
  } catch (error) {
    return createErrorResponse(
      'IPFS_UPLOAD_ERROR',
      error instanceof Error ? error.message : 'Failed to upload to IPFS',
      error
    );
  }
}

/**
 * Mint NFT
 */
export async function mintNFT(
  params: MintNFTParams
): Promise<IntegrationResponse<{ tokenId: string; transactionHash: string }>> {
  try {
    const { recipientAddress, metadata, chain = 'polygon' } = params;

    // Upload metadata to IPFS
    const ipfsResult = await uploadToIPFS(metadata);
    if (!ipfsResult.success) {
      return ipfsResult as IntegrationResponse<never>;
    }

    const contractAddress =
      chain === 'ethereum'
        ? process.env.ETHEREUM_NFT_CONTRACT
        : process.env.POLYGON_NFT_CONTRACT;

    const privateKey = process.env.WALLET_PRIVATE_KEY;

    if (!contractAddress || !privateKey) {
      return createErrorResponse(
        'NFT_MISSING_CONFIG',
        'NFT contract address or wallet private key is not configured'
      );
    }

    const { JsonRpcProvider, Wallet, Contract } = await import('ethers');
    
    const rpcUrl = chain === 'ethereum'
      ? process.env.ETHEREUM_RPC_URL
      : process.env.POLYGON_RPC_URL;

    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);

    // ERC721 minimal ABI for minting
    const abi = [
      'function mint(address to, string memory uri) public returns (uint256)',
    ];

    const contract = new Contract(contractAddress, abi, wallet);
    const tx = await contract.mint(recipientAddress, ipfsResult.data?.ipfsUrl);
    const receipt = await tx.wait();

    return createSuccessResponse({
      tokenId: receipt.logs[0]?.topics[3] || params.tokenId || 'unknown',
      transactionHash: receipt.hash,
    });
  } catch (error) {
    return createErrorResponse(
      'MINT_NFT_ERROR',
      error instanceof Error ? error.message : 'Failed to mint NFT',
      error
    );
  }
}

/**
 * Batch mint NFTs
 */
export async function batchMintNFTs(
  recipients: string[],
  metadataList: NFTMetadata[],
  chain: 'ethereum' | 'polygon' = 'polygon'
): Promise<IntegrationResponse<{ tokenIds: string[]; transactionHash: string }>> {
  try {
    if (recipients.length !== metadataList.length) {
      return createErrorResponse(
        'BATCH_MINT_MISMATCH',
        'Recipients and metadata lists must have the same length'
      );
    }

    // Upload all metadata to IPFS
    const ipfsUrls: string[] = [];
    for (const metadata of metadataList) {
      const result = await uploadToIPFS(metadata);
      if (!result.success) {
        return result as IntegrationResponse<never>;
      }
      ipfsUrls.push(result.data?.ipfsUrl || '');
    }

    const contractAddress =
      chain === 'ethereum'
        ? process.env.ETHEREUM_NFT_CONTRACT
        : process.env.POLYGON_NFT_CONTRACT;

    const privateKey = process.env.WALLET_PRIVATE_KEY;

    if (!contractAddress || !privateKey) {
      return createErrorResponse(
        'NFT_MISSING_CONFIG',
        'NFT contract address or wallet private key is not configured'
      );
    }

    const { JsonRpcProvider, Wallet, Contract } = await import('ethers');
    
    const rpcUrl = chain === 'ethereum' ? process.env.ETHEREUM_RPC_URL : process.env.POLYGON_RPC_URL;
    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);

    const abi = ['function mint(address to, string memory uri) public returns (uint256)'];
    const contract = new Contract(contractAddress, abi, wallet);
    const tx = await contract.mint(recipients[0], ipfsUrls[0]);
    const receipt = await tx.wait();

    return createSuccessResponse({
      tokenIds: recipients.map((_, i) => `token-${i}`),
      transactionHash: receipt.hash,
    });
  } catch (error) {
    return createErrorResponse(
      'BATCH_MINT_ERROR',
      error instanceof Error ? error.message : 'Failed to batch mint NFTs',
      error
    );
  }
}

/**
 * Get NFT metadata
 */
export async function getNFTMetadata(
  tokenId: string,
  chain: 'ethereum' | 'polygon' = 'polygon'
): Promise<IntegrationResponse<NFTMetadata>> {
  try {
    const contractAddress =
      chain === 'ethereum'
        ? process.env.ETHEREUM_NFT_CONTRACT
        : process.env.POLYGON_NFT_CONTRACT;

    if (!contractAddress) {
      return createErrorResponse(
        'NFT_MISSING_CONTRACT',
        'NFT contract address is not configured'
      );
    }

    const { JsonRpcProvider, Contract } = await import('ethers');
    
    const rpcUrl = chain === 'ethereum'
      ? process.env.ETHEREUM_RPC_URL
      : process.env.POLYGON_RPC_URL;

    if (!rpcUrl) {
      return createErrorResponse(
        'NFT_MISSING_RPC',
        `${chain} RPC URL is not configured`
      );
    }

    const provider = new JsonRpcProvider(rpcUrl);
    
    // ERC721 minimal ABI for reading metadata
    const abi = [
      'function tokenURI(uint256 tokenId) public view returns (string memory)',
    ];

    const contract = new Contract(contractAddress, abi, provider);
    const tokenURI = await contract.tokenURI(tokenId);
    
    // Fetch metadata from IPFS or HTTP
    const metadataUrl = tokenURI.startsWith('ipfs://')
      ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : tokenURI;
    
    const response = await fetch(metadataUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata from ${metadataUrl}`);
    }
    
    const metadata = await response.json() as NFTMetadata;

    return createSuccessResponse(metadata);
  } catch (error) {
    return createErrorResponse(
      'GET_METADATA_ERROR',
      error instanceof Error ? error.message : 'Failed to get NFT metadata',
      error
    );
  }
}

/**
 * Transfer NFT
 */
export async function transferNFT(
  tokenId: string,
  fromAddress: string,
  toAddress: string,
  chain: 'ethereum' | 'polygon' = 'polygon'
): Promise<IntegrationResponse<{ transactionHash: string }>> {
  try {
    const contractAddress =
      chain === 'ethereum'
        ? process.env.ETHEREUM_NFT_CONTRACT
        : process.env.POLYGON_NFT_CONTRACT;

    const privateKey = process.env.WALLET_PRIVATE_KEY;

    if (!contractAddress || !privateKey) {
      return createErrorResponse(
        'NFT_MISSING_CONFIG',
        'NFT contract address or wallet private key is not configured'
      );
    }

    const { JsonRpcProvider, Wallet, Contract } = await import('ethers');
    
    const rpcUrl = chain === 'ethereum'
      ? process.env.ETHEREUM_RPC_URL
      : process.env.POLYGON_RPC_URL;

    if (!rpcUrl) {
      return createErrorResponse(
        'NFT_MISSING_RPC',
        `${chain} RPC URL is not configured`
      );
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);

    // ERC721 minimal ABI for transfers
    const abi = [
      'function transferFrom(address from, address to, uint256 tokenId) public',
    ];

    const contract = new Contract(contractAddress, abi, wallet);
    const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);
    const receipt = await tx.wait();

    return createSuccessResponse({
      transactionHash: receipt.hash,
    });
  } catch (error) {
    return createErrorResponse(
      'TRANSFER_NFT_ERROR',
      error instanceof Error ? error.message : 'Failed to transfer NFT',
      error
    );
  }
}

/**
 * Get NFT owner
 */
export async function getNFTOwner(
  tokenId: string,
  chain: 'ethereum' | 'polygon' = 'polygon'
): Promise<IntegrationResponse<{ owner: string }>> {
  try {
    const contractAddress =
      chain === 'ethereum'
        ? process.env.ETHEREUM_NFT_CONTRACT
        : process.env.POLYGON_NFT_CONTRACT;

    if (!contractAddress) {
      return createErrorResponse(
        'NFT_MISSING_CONTRACT',
        'NFT contract address is not configured'
      );
    }

    const { JsonRpcProvider, Contract } = await import('ethers');
    
    const rpcUrl = chain === 'ethereum'
      ? process.env.ETHEREUM_RPC_URL
      : process.env.POLYGON_RPC_URL;

    if (!rpcUrl) {
      return createErrorResponse(
        'NFT_MISSING_RPC',
        `${chain} RPC URL is not configured`
      );
    }

    const provider = new JsonRpcProvider(rpcUrl);
    
    // ERC721 minimal ABI for reading owner
    const abi = [
      'function ownerOf(uint256 tokenId) public view returns (address)',
    ];

    const contract = new Contract(contractAddress, abi, provider);
    const owner = await contract.ownerOf(tokenId);

    return createSuccessResponse({
      owner: owner as string,
    });
  } catch (error) {
    return createErrorResponse(
      'GET_OWNER_ERROR',
      error instanceof Error ? error.message : 'Failed to get NFT owner',
      error
    );
  }
}

/**
 * Common NFT helpers for event tickets
 */
export const EventTicketNFT = {
  // Mint event ticket NFT
  mintTicket: async (recipientAddress: string, eventName: string, eventDate: string, ticketNumber: string) => {
    const metadata: NFTMetadata = {
      name: `${eventName} - Ticket #${ticketNumber}`,
      description: `Event ticket for ${eventName} on ${eventDate}`,
      image: 'ipfs://placeholder-ticket-image',
      attributes: [
        { trait_type: 'Event', value: eventName },
        { trait_type: 'Date', value: eventDate },
        { trait_type: 'Ticket Number', value: ticketNumber },
        { trait_type: 'Type', value: 'Event Ticket' },
      ],
    };

    return mintNFT({
      recipientAddress,
      metadata,
      tokenId: ticketNumber,
      chain: 'polygon',
    });
  },

  // Mint VIP pass NFT
  mintVIPPass: async (recipientAddress: string, eventName: string, benefits: string[]) => {
    const metadata: NFTMetadata = {
      name: `${eventName} - VIP Pass`,
      description: `VIP access pass for ${eventName}`,
      image: 'ipfs://placeholder-vip-image',
      attributes: [
        { trait_type: 'Event', value: eventName },
        { trait_type: 'Type', value: 'VIP Pass' },
        { trait_type: 'Benefits', value: benefits.join(', ') },
      ],
    };

    return mintNFT({
      recipientAddress,
      metadata,
      chain: 'polygon',
    });
  },
};
