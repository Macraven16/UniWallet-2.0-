import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest } from '@/lib/auth';

export async function POST(request: any) {
    try {
        const role = getUserRoleFromRequest(request);
        if (role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const body = await request.json();
        const { name, amount, dueDate, breakdown, schoolId } = body;

        const fee = await prisma.feeStructure.create({
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                breakdown: breakdown || [], // JSON
                schoolId: schoolId || 'default_school_id', // Needs to be handled
            },
        });

        return NextResponse.json(fee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create fee' }, { status: 500 });
    }
}

export async function GET(request: any) {
    try {
        const role = getUserRoleFromRequest(request);
        if (role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const fees = await prisma.feeStructure.findMany({
            include: { school: true }
        });
        return NextResponse.json(fees);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
