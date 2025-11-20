import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const documentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['document', 'image', 'video', 'audio', 'archive', 'other']),
  folder: z.string(),
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

    // Mock data - replace with actual database query
    // Filter based on user permissions
    const documents = [
      {
        id: 'DOC-001',
        name: 'Production Schedule Q4 2024.pdf',
        type: 'document',
        size: 2457600,
        uploadedBy: 'Sarah Johnson',
        uploadedDate: '2024-11-18',
        folder: 'Production',
        permissions: 'team',
        tags: ['schedule', 'production', 'q4'],
        fileUrl: '/files/doc-001.pdf'
      }
    ];

    // Apply RBAC filtering based on user role and document permissions
    const filtered = documents.filter(doc => {
      if (doc.permissions === 'public') return true;
      if (doc.permissions === 'team' && session.user.role) return true;
      if (doc.permissions === 'restricted' && ['admin', 'production'].includes(session.user.role || '')) return true;
      if (doc.permissions === 'private' && doc.uploadedBy === session.user.id) return true;
      return false;
    });

    return NextResponse.json({ documents: filtered, total: filtered.length });
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

    // Mock response - replace with actual file upload and database insert
    const document = {
      id: `DOC-${Date.now()}`,
      ...validated,
      uploadedBy: session.user.id,
      uploadedDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

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

    // Mock response - replace with actual database delete
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
