import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'json';
        const studentId = searchParams.get('studentId');

        const where = studentId ? { wallet: { studentId } } : {};

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                wallet: {
                    include: {
                        student: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            orderBy: { date: 'desc' },
        });

        if (format === 'csv') {
            const csvHeader = 'Date,Transaction ID,Student Name,Type,Amount,Status,Reference,Description\n';
            const csvRows = transactions.map(tx => {
                return `${tx.date.toISOString()},${tx.id},"${tx.wallet.student.user.name}",${tx.type},${tx.amount},${tx.status},${tx.reference || ''},"${tx.description || ''}"`;
            }).join('\n');

            return new NextResponse(csvHeader + csvRows, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="transactions.csv"',
                },
            });
        }

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Report generation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
