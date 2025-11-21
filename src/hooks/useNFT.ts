import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface MintNFTParams {
  ticketId: string;
  walletAddress: string;
}

export function useNFT() {
  const { data: session } = useSession();
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintNFT = async ({ ticketId, walletAddress }: MintNFTParams) => {
    if (!session?.user) {
      throw new Error('You must be logged in to mint NFTs');
    }

    setIsMinting(true);
    setError(null);

    try {
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId,
          walletAddress,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to mint NFT');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Minting failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsMinting(false);
    }
  };

  const transferNFT = async (tokenId: string, toAddress: string) => {
    if (!session?.user) {
      throw new Error('You must be logged in to transfer NFTs');
    }

    setIsTransferring(true);
    setError(null);

    try {
      const response = await fetch('/api/nft/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          toAddress,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to transfer NFT');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transfer failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsTransferring(false);
    }
  };

  const getNFTMetadata = async (tokenId: string): Promise<NFTMetadata> => {
    try {
      const response = await fetch(`/api/nft/${tokenId}/metadata`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to fetch metadata');
      }

      return result.data.metadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metadata';
      setError(errorMessage);
      throw err;
    }
  };

  const getUserNFTs = async () => {
    if (!session?.user) {
      throw new Error('You must be logged in to view your NFTs');
    }

    try {
      const response = await fetch('/api/nft/my-nfts');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to fetch NFTs');
      }

      return result.data.nfts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    mintNFT,
    transferNFT,
    getNFTMetadata,
    getUserNFTs,
    isMinting,
    isTransferring,
    error,
  };
}
