import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // In a real app, verify Admin role here

        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' },
            take: 100, // Limit to 100 for performance, or implement pagination
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
            reference: tx.reference,
            status: tx.status,
            wallet: {
                studentId: tx.wallet.studentId,
                student: {
                    user: {
                        name: tx.wallet.student.user.name
                    }
                }
            }
        }));

        return NextResponse.json(formattedTransactions);
    } catch (error) {
        console.error('Admin transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
