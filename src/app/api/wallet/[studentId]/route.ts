import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
    try {
        const { studentId } = await params;

        const wallet = await prisma.wallet.findUnique({
            where: { studentId },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 20, // Limit to last 20 transactions
                },
            },
        });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        return NextResponse.json(wallet);
    } catch (error) {
        console.error('Get wallet error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
