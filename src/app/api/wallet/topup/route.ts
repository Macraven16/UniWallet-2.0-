import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const userId = getUserIdFromRequest(request as any);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, reference, method } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const student = await prisma.student.findUnique({
            where: { userId },
            include: { wallet: true }
        });

        if (!student || !student.wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        const studentId = student.id;

        // Start a transaction to ensure data integrity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get current wallet (lock it if possible, but Prisma doesn't support explicit locking easily, transaction helps)
            const wallet = await tx.wallet.findUnique({
                where: { studentId },
            });

            if (!wallet) {
                throw new Error('Wallet not found');
            }

            // 2. Create Transaction Record
            const balanceBefore = wallet.balance;
            const balanceAfter = balanceBefore + parseFloat(amount);

            const transaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: parseFloat(amount),
                    type: 'TOPUP',
                    status: 'COMPLETED',
                    reference: reference || `REF-${Date.now()}`,
                    method: method || 'MOMO',
                    description: 'Wallet Top-up',
                    balanceBefore,
                    balanceAfter,
                },
            });

            // 3. Update Wallet Balance
            const updatedWallet = await tx.wallet.update({
                where: { studentId },
                data: {
                    balance: { increment: parseFloat(amount) },
                },
            });

            return { transaction, wallet: updatedWallet };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Top-up error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
