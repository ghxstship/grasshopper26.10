import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkoutSchema = z.object({
  assetId: z.string(),
  dueDate: z.coerce.date(),
  purpose: z.string().optional(),
  notes: z.string().optional()
});

const checkinSchema = z.object({
  checkoutId: z.string(),
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
      
      // Create checkout record and update asset status
      const [checkout] = await prisma.$transaction([
        prisma.compvssAssetCheckout.create({
          data: {
            assetId: validated.assetId,
            userId: session.user.id,
            dueDate: validated.dueDate,
            purpose: validated.purpose,
            notes: validated.notes,
            status: 'checked-out'
          }
        }),
        prisma.compvssAsset.update({
          where: { id: validated.assetId },
          data: { status: 'checked-out' }
        })
      ]);

      return NextResponse.json(checkout, { status: 201 });
    } else if (action === 'checkin') {
      const validated = checkinSchema.parse(body);
      
      // Update checkout record and asset status
      const checkout = await prisma.compvssAssetCheckout.findUnique({
        where: { id: validated.checkoutId }
      });

      if (!checkout) {
        return NextResponse.json({ error: 'Checkout record not found' }, { status: 404 });
      }

      const [updated] = await prisma.$transaction([
        prisma.compvssAssetCheckout.update({
          where: { id: validated.checkoutId },
          data: {
            checkedInAt: new Date(),
            condition: validated.condition,
            notes: validated.notes,
            status: 'returned'
          }
        }),
        prisma.compvssAsset.update({
          where: { id: checkout.assetId },
          data: { 
            status: 'available',
            condition: validated.condition
          }
        })
      ]);

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
