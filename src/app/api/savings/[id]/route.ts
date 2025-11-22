import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { goalName, targetAmount, currentAmount, deadline } = body;

        const savings = await prisma.savings.update({
            where: { id },
            data: {
                goalName,
                targetAmount: parseFloat(targetAmount),
                currentAmount: parseFloat(currentAmount),
                deadline: deadline ? new Date(deadline) : null,
            },
        });

        return NextResponse.json(savings);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.savings.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
