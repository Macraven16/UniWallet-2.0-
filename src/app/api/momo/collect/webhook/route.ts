import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const referenceId = request.headers.get('X-Reference-Id') || body.externalId;
        const { status, amount, payer } = body;

        console.log('MoMo Webhook Received:', { referenceId, status });

        if (!referenceId) {
            return NextResponse.json({ error: 'Missing Reference ID' }, { status: 400 });
        }

        // TODO: Verify signature (already implemented in verify route, should be shared middleware or util)

        if (status === 'SUCCESSFUL') {
            await prisma.$transaction(async (tx) => {
                // 1. Find the transaction
                const transaction = await tx.transaction.findFirst({
                    where: { reference: referenceId },
                    include: { wallet: true }
                });

                if (!transaction) {
                    console.warn(`Transaction not found for reference: ${referenceId}`);
                    // It might be a direct collection not initiated via our Transaction table?
                    // Or maybe we should create one? For now, log and ignore.
                    return;
                }

                if (transaction.status === 'COMPLETED') {
                    console.log('Transaction already completed.');
                    return;
                }

                // 2. Update Transaction
                await tx.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: 'COMPLETED',
                        balanceAfter: transaction.wallet.balance + transaction.amount, // Update balanceAfter
                    }
                });

                // 3. Update Wallet
                await tx.wallet.update({
                    where: { id: transaction.walletId },
                    data: {
                        balance: { increment: transaction.amount }
                    }
                });

                console.log(`Wallet credited for transaction ${referenceId}`);
            });
        } else if (status === 'FAILED') {
            await prisma.transaction.updateMany({
                where: { reference: referenceId },
                data: { status: 'FAILED' }
            });
        }

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json(null, { status: 500 });
    }
}
