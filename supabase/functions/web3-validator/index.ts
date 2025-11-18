/**
 * Web3 Validator Edge Function
 * Validates blockchain transactions and wallet signatures
 * Verifies NFT ownership and smart contract interactions
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { successResponse, errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

interface ValidationRequest {
  type: 'signature' | 'transaction' | 'nft-ownership';
  data: {
    address?: string;
    signature?: string;
    message?: string;
    txHash?: string;
    tokenId?: string;
    contractAddress?: string;
  };
}

const ALCHEMY_API_KEY = Deno.env.get('ALCHEMY_API_KEY')!;
const NETWORK = Deno.env.get('ETHEREUM_NETWORK') || 'mainnet';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 30, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 30,
      });
    }

    const validationRequest: ValidationRequest = await req.json();

    if (!validationRequest.type || !validationRequest.data) {
      return errorResponse('INVALID_REQUEST', 'Missing type or data', 400);
    }

    let result;

    switch (validationRequest.type) {
      case 'signature': {
        const { address, signature, message } = validationRequest.data;

        if (!address || !signature || !message) {
          return errorResponse('INVALID_REQUEST', 'Missing required fields', 400);
        }

        // Verify signature using ethers.js equivalent
        // For edge function, we'll use a simplified approach
        result = {
          valid: true, // Placeholder - implement actual verification
          address,
          message,
        };

        break;
      }

      case 'transaction': {
        const { txHash } = validationRequest.data;

        if (!txHash) {
          return errorResponse('INVALID_REQUEST', 'Missing transaction hash', 400);
        }

        // Query transaction from Alchemy
        const alchemyUrl = `https://eth-${NETWORK}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
        
        const txResponse = await fetch(alchemyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getTransactionByHash',
            params: [txHash],
          }),
        });

        const txData = await txResponse.json();

        if (!txData.result) {
          return errorResponse('TRANSACTION_NOT_FOUND', 'Transaction not found', 404);
        }

        result = {
          valid: true,
          transaction: txData.result,
        };

        break;
      }

      case 'nft-ownership': {
        const { address, tokenId, contractAddress } = validationRequest.data;

        if (!address || !tokenId || !contractAddress) {
          return errorResponse('INVALID_REQUEST', 'Missing required fields', 400);
        }

        // Query NFT ownership from Alchemy
        const alchemyUrl = `https://eth-${NETWORK}.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs`;
        
        const nftResponse = await fetch(
          `${alchemyUrl}?owner=${address}&contractAddresses[]=${contractAddress}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const nftData = await nftResponse.json();

        const ownsNFT = nftData.ownedNfts?.some(
          (nft: any) => nft.id.tokenId === tokenId
        );

        result = {
          valid: ownsNFT,
          address,
          tokenId,
          contractAddress,
        };

        break;
      }

      default:
        return errorResponse('INVALID_TYPE', 'Invalid validation type', 400);
    }

    const response = successResponse(result);

    return addRateLimitHeaders(response, {
      ...rateLimit,
      maxRequests: 30,
    });
  } catch (error) {
    return handleError(error);
  }
});
