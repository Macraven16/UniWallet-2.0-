import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Find the student record for this user
        const student = await prisma.student.findUnique({
            where: { userId: decoded.userId },
        });

        if (!student) {
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        const invoices = await prisma.invoice.findMany({
            where: { studentId: student.id },
            include: {
                feeStructure: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(invoices);
    } catch (error) {
        console.error('Get student invoices error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
