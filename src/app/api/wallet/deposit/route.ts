import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { WalletService } from '@/lib/services/wallet/deposit.service';



// Validation: z.object schema.parse validate
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    const wallet = await new WalletService().update({
      where: { userId: session.user.id },
      data: { balance: { increment: amount } },
    });

    await new WalletService().create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ balance: wallet.balance });
  } catch (error) {
    return handleApiError(error);
  }
}
