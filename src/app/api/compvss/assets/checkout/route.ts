import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const checkoutSchema = z.object({
  assetId: z.string(),
  dueDate: z.string(),
  purpose: z.string().optional(),
  notes: z.string().optional()
});

const checkinSchema = z.object({
  assetId: z.string(),
  condition: z.enum(['excellent', 'good', 'fair', 'needs-repair']),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check RBAC permissions
    const allowedRoles = ['admin', 'crew', 'production'];
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to check out assets' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'checkout') {
      const validated = checkoutSchema.parse(body);
      
      // Mock response - replace with actual database update
      const checkout = {
        id: `CHK-${Date.now()}`,
        ...validated,
        userId: session.user.id,
        checkedOutAt: new Date().toISOString(),
        status: 'checked-out'
      };

      return NextResponse.json(checkout, { status: 201 });
    } else if (action === 'checkin') {
      const validated = checkinSchema.parse(body);
      
      // Mock response - replace with actual database update
      const checkin = {
        id: `CHK-${Date.now()}`,
        ...validated,
        userId: session.user.id,
        checkedInAt: new Date().toISOString(),
        status: 'available'
      };

      return NextResponse.json(checkin);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
