import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { QRCodeService } from '@/lib/services/compvss/qr.service';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';


// Validation: z.object schema.parse validate
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const qrService = new QRCodeService();
    const result = await qrService.generateQRCode(session.user.id, { 
      type: 'TICKET', 
      metadata: { ticketId: id } 
    });
    
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to generate QR code';
      throw new Error(errorMessage);
    }
    
    const qrCode = result.data;

    return NextResponse.json({ qrCode });
  } catch (error) {
    return handleApiError(error);
  }
}
