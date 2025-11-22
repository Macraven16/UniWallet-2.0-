import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

// Mock MTN MoMo API interaction
export async function POST(request: any) {
    try {
        const userId = getUserIdFromRequest(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { amount, phoneNumber, provider } = body;

        const student = await prisma.student.findUnique({
            where: { userId },
            include: { wallet: true },
        });

        if (!student || !student.wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        // 1. Create Pending Transaction
        const transaction = await prisma.transaction.create({
            data: {
                walletId: student.wallet.id,
                amount: parseFloat(amount),
                type: 'TOPUP',
                status: 'PENDING',
                method: 'MOMO',
                reference: `MOMO-${Date.now()}`, // In real app, get this from MTN
                description: `MoMo Topup from ${phoneNumber}`,
            },
        });

        // 2. Call MTN API (Mocked here)
        // const mtnResponse = await axios.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', ...)

        // For prototype, we'll auto-complete it after a delay or just return success
        // In a real scenario, we'd wait for the callback.
        // Let's simulate a successful initiation.

        return NextResponse.json({
            message: 'Payment initiated. Please check your phone to confirm.',
            transactionId: transaction.id,
            status: 'PENDING'
        });

    } catch (error) {
        console.error('MoMo Error:', error);
        return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
    }
}
