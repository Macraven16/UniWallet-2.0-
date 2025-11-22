import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: any) {
    try {
        const userId = getUserIdFromRequest(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                school: true,
                wallet: true,
                user: {
                    select: { name: true, email: true }
                }
            },
        });

        if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: any) {
    try {
        const userId = getUserIdFromRequest(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { grade, campus, phone } = body; // Add other fields as needed

        const student = await prisma.student.update({
            where: { userId },
            data: {
                grade,
                campus,
                // phone is not in student model yet, maybe add to User or Student?
                // For now, let's assume we update what we have
            },
        });

        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
