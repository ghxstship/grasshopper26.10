import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const documentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['document', 'image', 'video', 'audio', 'archive', 'other']),
  folder: z.string().optional(),
  permissions: z.enum(['public', 'team', 'restricted', 'private']),
  tags: z.array(z.string()).optional(),
  fileUrl: z.string().url(),
  size: z.number().int().min(0)
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const folder = searchParams.get('folder');
    const permissions = searchParams.get('permissions');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (folder) where.folder = folder;
    if (permissions) where.permissions = permissions;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    const documents = await prisma.compvssDocument.findMany({
      where,
      orderBy: { uploadedDate: 'desc' }
    });

    // Apply RBAC filtering based on user role and document permissions
    const filtered = documents.filter(doc => {
      if (doc.permissions === 'public') return true;
      if (doc.permissions === 'team' && session.user.role) return true;
      if (doc.permissions === 'restricted' && ['admin', 'production'].includes(session.user.role || '')) return true;
      if (doc.permissions === 'private' && doc.uploadedBy === session.user.id) return true;
      return false;
    });

    return NextResponse.json({ 
      documents: filtered.length > 0 ? filtered : [], 
      total: filtered.length 
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check RBAC permissions for upload
    const allowedRoles = ['admin', 'crew', 'production'];
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to upload documents' }, { status: 403 });
    }

    const body = await req.json();
    const validated = documentSchema.parse(body);

    const document = await prisma.compvssDocument.create({
      data: {
        name: validated.name,
        type: validated.type,
        folder: validated.folder,
        permissions: validated.permissions,
        tags: validated.tags || [],
        fileUrl: validated.fileUrl,
        size: validated.size,
        uploadedBy: session.user.id
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check RBAC permissions for delete (admin only)
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions to delete documents' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    await prisma.compvssDocument.delete({
      where: { id: documentId }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Document deleted successfully',
      deletedBy: session.user.id,
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    return handleApiError(error);
  }
}
