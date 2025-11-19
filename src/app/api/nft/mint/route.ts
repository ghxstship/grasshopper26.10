import { NextRequest, NextResponse } from 'next/server';
import { mintNFT } from '@/lib/integrations/web3/nft';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { z } from 'zod';
import { handleApiError } from '@/lib/api/response';
import { NftService } from '@/lib/services/nft/mint.service';
import { errors } from '@/lib/api/errors';




export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ticketId, walletAddress } = body;

    if (!ticketId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: ticketId, walletAddress' },
        { status: 400 }
      );
    }

    // Fetch ticket details
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
        order: true,
        ticketType: true,
        nftTicket: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Verify ticket ownership
    if (ticket.order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not own this ticket' },
        { status: 403 }
      );
    }

    // Check if NFT already minted
    if (ticket.nftTicket) {
      return NextResponse.json(
        { error: 'NFT already minted for this ticket' },
        { status: 400 }
      );
    }

    // Prepare NFT metadata
    const metadata = {
      name: `${ticket.event.name} - ${ticket.ticketType.name} Ticket`,
      description: `NFT ticket for ${ticket.event.name} on ${ticket.event.startDate.toLocaleDateString()}`,
      image: ticket.event.imageUrl || '',
      attributes: [
        {
          trait_type: 'Event',
          value: ticket.event.name,
        },
        {
          trait_type: 'Ticket Type',
          value: ticket.ticketType.name,
        },
        {
          trait_type: 'Event Date',
          value: ticket.event.startDate.toISOString(),
        },
        {
          trait_type: 'Venue',
          value: ticket.event.venue?.name || 'TBA',
        },
        {
          trait_type: 'Ticket ID',
          value: ticket.id,
        },
      ],
      external_url: `${process.env.NEXT_PUBLIC_APP_URL}/gvteway/tickets/${ticket.id}`,
    };

    // Mint NFT (includes IPFS upload)
    const mintResult = await mintNFT({
      recipientAddress: walletAddress,
      metadata,
      chain: 'polygon',
    });

    if (!mintResult.success || !mintResult.data) {
      return NextResponse.json(
        { error: mintResult.error || 'Failed to mint NFT' },
        { status: 500 }
      );
    }

    const { tokenId, transactionHash } = mintResult.data;

    // Create NFT record
    await new NftService().create({
      data: {
        ticketId: ticket.id,
        tokenId: tokenId.toString(),
        contractAddress: process.env.NFT_CONTRACT_ADDRESS || '',
        chain: 'polygon',
        metadataUri: `ipfs://${tokenId}`,
        ownerAddress: walletAddress,
      },
    });

    return NextResponse.json({
      success: true,
      tokenId: tokenId.toString(),
      transactionHash,
      message: 'NFT minted successfully',
    });
  } catch (error) {
    console.error('NFT minting error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to mint NFT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Missing ticketId parameter' },
        { status: 400 }
      );
    }

    // Fetch NFT info for ticket
    const nft = await prisma.nFTTicket.findFirst({
      where: { ticketId },
      include: {
        ticket: {
          include: {
            event: true,
            ticketType: true,
          },
        },
      },
    });

    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found for this ticket' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      metadataUri: nft.metadataUri,
      ownerAddress: nft.ownerAddress,
      chain: nft.chain,
      mintedAt: nft.mintedAt,
      ticket: {
        id: nft.ticket.id,
        type: nft.ticket.ticketType.name,
        event: {
          name: nft.ticket.event.name,
          date: nft.ticket.event.startDate,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
