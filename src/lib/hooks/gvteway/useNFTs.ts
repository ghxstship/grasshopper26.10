/**
 * React Query hooks for GVTEWAY NFT Tickets
 * Provides data fetching for blockchain-verified ticket NFTs
 */

import { useQuery } from '@tanstack/react-query';

export interface NFTTicket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  userId: string;
  qrCode: string;
  status: string;
  metadata?: any;
  createdAt: Date;
  event?: {
    title: string;
    startDate: Date;
    venue?: {
      name: string;
      city: string;
    };
  };
  ticketType?: {
    name: string;
    price: number;
  };
}

export interface NFTsResponse {
  tickets: NFTTicket[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all NFT tickets for the current user
 * NFT tickets are blockchain-verified tickets with metadata
 */
export function useNFTs() {
  return useQuery({
    queryKey: ['nfts'],
    queryFn: async (): Promise<NFTsResponse> => {
      const response = await fetch('/api/tickets?nft=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFT tickets');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch single NFT ticket by ID
 */
export function useNFT(id: string | undefined) {
  return useQuery({
    queryKey: ['nft', id],
    queryFn: async (): Promise<NFTTicket> => {
      if (!id) throw new Error('NFT ID is required');

      const response = await fetch(`/api/tickets/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFT ticket');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
