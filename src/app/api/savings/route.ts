import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
        return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    try {
        const savings = await prisma.savings.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(savings);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, goalName, targetAmount, deadline } = body;

        const savings = await prisma.savings.create({
            data: {
                studentId,
                goalName,
                targetAmount: parseFloat(targetAmount),
                deadline: deadline ? new Date(deadline) : null,
            },
        });

        return NextResponse.json(savings);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
