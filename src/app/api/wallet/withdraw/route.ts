import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { WalletService } from '@/lib/services/wallet/withdraw.service';



// Validation: z.object schema.parse validate
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    const wallet = await new WalletService().findById({
      where: { userId: session.user.id },
    });

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    const updated = await new WalletService().update({
      where: { userId: session.user.id },
      data: { balance: { decrement: amount } },
    });

    await new WalletService().create({
      data: {
        walletId: wallet.id,
        type: 'WITHDRAWAL',
        amount,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ balance: updated.balance });
  } catch (error) {
    return handleApiError(error);
  }
}
