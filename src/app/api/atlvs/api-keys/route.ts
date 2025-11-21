import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const createKeySchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()).default([]),
  expiresAt: z.string().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        key: true,
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { apiKeys },
    });
  } catch (error) {
    console.error('API keys fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch API keys' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createKeySchema.parse(body);

    const key = `ghxst_${randomBytes(32).toString('hex')}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name: data.name,
        key,
        permissions: data.permissions,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    return NextResponse.json(
      { success: true, data: { apiKey } },
      { status: 201 }
    );
  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create API key' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');

    if (!keyId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'keyId required' } },
        { status: 400 }
      );
    }

    await prisma.apiKey.delete({
      where: {
        id: keyId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'API key deleted' },
    });
  } catch (error) {
    console.error('API key deletion error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete API key' } },
      { status: 500 }
    );
  }
}
