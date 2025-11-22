import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: any) {
    try {
        const userId = getUserIdFromRequest(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const student = await prisma.student.findUnique({
            where: { userId },
            include: { wallet: true },
        });

        if (!student || !student.wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { walletId: student.wallet.id },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json({
            balance: student.wallet.balance,
            transactions,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Simple top-up for testing (bypassing MoMo for now if needed)
export async function POST(request: any) {
    try {
        const userId = getUserIdFromRequest(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { amount } = body;

        const student = await prisma.student.findUnique({
            where: { userId },
            include: { wallet: true },
        });

        if (!student || !student.wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        // Update wallet
        const updatedWallet = await prisma.wallet.update({
            where: { id: student.wallet.id },
            data: {
                balance: { increment: parseFloat(amount) }
            }
        });

        // Create transaction record
        await prisma.transaction.create({
            data: {
                walletId: student.wallet.id,
                amount: parseFloat(amount),
                type: 'TOPUP',
                status: 'COMPLETED',
                method: 'WALLET', // Or 'MOCK'
                description: 'Manual Top-up'
            }
        });

        return NextResponse.json({ success: true, balance: updatedWallet.balance });
    } catch (error) {
        return NextResponse.json({ error: 'Topup failed' }, { status: 500 });
    }
}
