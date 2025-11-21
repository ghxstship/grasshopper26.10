import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createVendorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  category: z.string(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category) where.category = category;

    const vendors = await prisma.vendor.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { vendors },
    });
  } catch (error) {
    console.error('Vendors fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch vendors' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createVendorSchema.parse(body);

    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        type: data.category || 'OTHER',
        contact: {
          email: data.email,
          phone: data.phone,
          website: data.website,
        },
        address: data.address,
        metadata: data.notes ? { notes: data.notes } : undefined,
        status: 'active',
      },
    });

    return NextResponse.json(
      { success: true, data: { vendor } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create vendor' } },
      { status: 500 }
    );
  }
}
