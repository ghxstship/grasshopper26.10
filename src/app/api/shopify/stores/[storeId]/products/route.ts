import { NextRequest, NextResponse } from 'next/server';
import { shopifyService } from '@/lib/services/shopify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const resolvedParams = await params;
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') as 'price' | 'title' | 'created' | undefined;

    const products = await shopifyService.getProducts(resolvedParams.storeId, {
      limit: limit ? Number(limit) : undefined,
      category: category || undefined,
      sortBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
