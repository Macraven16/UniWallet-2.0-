import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const fees = await prisma.feeStructure.findMany({
            include: { school: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(fees);
    } catch (error) {
        console.error('Get fees error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, amount, dueDate, schoolId, breakdown } = body;

        if (!name || !amount || !dueDate || !schoolId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fee = await prisma.feeStructure.create({
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                schoolId,
                breakdown: breakdown || [],
            },
        });

        return NextResponse.json(fee);
    } catch (error) {
        console.error('Create fee error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
