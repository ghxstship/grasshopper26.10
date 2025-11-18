import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AssetService } from '@/lib/services/atlvs/asset.service';
import { EquipmentStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const filters = {
      type: searchParams.get('type') || undefined,
      status: statusParam && Object.values(EquipmentStatus).includes(statusParam as EquipmentStatus) 
        ? (statusParam as EquipmentStatus) 
        : undefined,
      search: searchParams.get('search') || undefined,
    };

    const result = await AssetService.getAll(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await AssetService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
