/**
 * Web3 Integration
 * Handles NFT minting and IPFS uploads
 */

import { ethers } from 'ethers';
import pinataSDK from '@pinata/sdk';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface Web3Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Upload metadata to IPFS using Pinata
 */
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<Web3Result<{ uri: string; hash: string }>> {
  try {
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_KEY;
    
    if (!pinataApiKey || !pinataSecretKey) {
      console.warn('[Web3] Pinata credentials not configured, using fallback');
      // Fallback to simulated upload
      const metadataString = JSON.stringify(metadata);
      const hash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));
      const ipfsHash = hash.slice(2, 48);
      const uri = `ipfs://${ipfsHash}`;
      
      return {
        success: true,
        data: {
          uri,
          hash: ipfsHash,
        },
      };
    }
    
    // Initialize Pinata
    const pinata = new pinataSDK(pinataApiKey, pinataSecretKey);
    
    // Test authentication
    await pinata.testAuthentication();
    
    // Upload to IPFS
    const result = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `${metadata.name}_metadata`,
      },
    });
    
    const uri = `ipfs://${result.IpfsHash}`;
    
    console.log(`[Web3] Uploaded metadata to IPFS: ${uri}`);
    
    return {
      success: true,
      data: {
        uri,
        hash: result.IpfsHash,
      },
    };
  } catch (error) {
    console.error('[Web3] Error uploading metadata to IPFS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload metadata to IPFS',
    };
  }
}

export interface MintNFTInput {
  to: string;
  tokenURI: string;
  metadata?: Record<string, unknown>;
}

export interface MintNFTResult {
  tokenId: string;
  transactionHash: string;
  contractAddress: string;
}

/**
 * Mint NFT using the TicketNFT contract
 */
export async function mintNFT(
  input: MintNFTInput
): Promise<Web3Result<MintNFTResult>> {
  try {
    if (!input.to || !input.tokenURI) {
      return {
        success: false,
        error: 'Missing required parameters for NFT minting',
      };
    }
    
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      console.warn('[Web3] NFT contract address not configured, using simulation mode');
      // Fallback to simulated minting
      const txData = `${input.to}${input.tokenURI}${Date.now()}`;
      const txHash = ethers.keccak256(ethers.toUtf8Bytes(txData));
      const tokenId = Math.floor(Math.random() * 1000000).toString();
      
      return {
        success: true,
        data: {
          tokenId,
          transactionHash: txHash,
          contractAddress: '0x0000000000000000000000000000000000000000',
        },
      };
    }
    
    // Get signer
    const signer = getSigner();
    if (!signer) {
      return {
        success: false,
        error: 'Failed to initialize signer - check Web3 configuration',
      };
    }
    
    // TicketNFT contract ABI (minimal interface for minting)
    const ticketNFTABI = [
      'function mintTicket(address to, string memory eventId, string memory ticketType, string memory uri, bool transferable) public returns (uint256)',
      'event TicketMinted(uint256 indexed tokenId, address indexed owner, string eventId, string ticketType, string tokenURI)',
    ];
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, ticketNFTABI, signer);
    
    // Extract metadata from input
    const eventId = input.metadata?.eventId as string || 'default-event';
    const ticketType = input.metadata?.ticketType as string || 'GENERAL';
    const transferable = input.metadata?.transferable !== false;
    
    // Mint the NFT
    const tx = await contract.mintTicket(
      input.to,
      eventId,
      ticketType,
      input.tokenURI,
      transferable
    );
    
    console.log(`[Web3] Minting NFT, transaction hash: ${tx.hash}`);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Extract token ID from TicketMinted event
    const event = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e: any) => e && e.name === 'TicketMinted');
    
    const tokenId = event?.args?.tokenId?.toString() || '0';
    
    console.log(`[Web3] NFT minted successfully, token ID: ${tokenId}`);
    
    return {
      success: true,
      data: {
        tokenId,
        transactionHash: receipt.hash,
        contractAddress,
      },
    };
  } catch (error) {
    console.error('[Web3] Error minting NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint NFT',
    };
  }
}

/**
 * Get provider
 */
export function getProvider(): ethers.JsonRpcProvider | null {
  try {
    const rpcUrl = process.env.WEB3_RPC_URL || process.env.NEXT_PUBLIC_WEB3_RPC_URL;
    
    if (!rpcUrl) {
      console.warn('[Web3] No RPC URL configured');
      return null;
    }
    
    return new ethers.JsonRpcProvider(rpcUrl);
  } catch (error) {
    console.error('[Web3] Error creating provider:', error);
    return null;
  }
}

/**
 * Get signer
 */
export function getSigner(): ethers.Wallet | null {
  try {
    const privateKey = process.env.WEB3_PRIVATE_KEY;
    
    if (!privateKey) {
      console.warn('[Web3] No private key configured');
      return null;
    }
    
    const provider = getProvider();
    if (!provider) {
      return null;
    }
    
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    console.error('[Web3] Error creating signer:', error);
    return null;
  }
}
