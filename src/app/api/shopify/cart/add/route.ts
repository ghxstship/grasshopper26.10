import { NextRequest, NextResponse } from 'next/server';
import { shopifyService } from '@/lib/services/shopify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, variantId, quantity } = body;

    if (!userId || !variantId || !quantity) {
      return NextResponse.json(
        { error: 'userId, variantId, and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await shopifyService.addToCart(userId, variantId, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
