import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    try {
        const whereClause = studentId ? { wallet: { studentId } } : {};

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            take: 10,
            orderBy: { date: 'desc' },
            include: {
                wallet: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        const formattedTransactions = transactions.map(tx => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            date: tx.date,
            studentName: tx.wallet.student.user.name,
            studentId: tx.wallet.studentId,
            status: tx.status
        }));

        return NextResponse.json(formattedTransactions);
    } catch (error) {
        console.error('Transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
