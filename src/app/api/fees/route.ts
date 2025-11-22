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

        // 1. Create the Fee Structure
        const fee = await prisma.feeStructure.create({
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                schoolId,
                breakdown: breakdown || [],
            },
        });

        // 2. Find all students in this school
        const students = await prisma.student.findMany({
            where: { schoolId },
            select: { id: true }
        });

        // 3. Create Invoices for each student
        if (students.length > 0) {
            await prisma.invoice.createMany({
                data: students.map(student => ({
                    studentId: student.id,
                    feeStructureId: fee.id,
                    amountPaid: 0.0,
                    status: 'PENDING',
                }))
            });
        }

        return NextResponse.json({ ...fee, invoicesCreated: students.length });
    } catch (error) {
        console.error('Create fee error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
