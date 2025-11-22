import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
        return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    try {
        const budgets = await prisma.budget.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(budgets);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, category, amount, period } = body;

        const budget = await prisma.budget.create({
            data: {
                studentId,
                category,
                amount: parseFloat(amount.toString()),
                period,
            },
        });

        return NextResponse.json(budget);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
