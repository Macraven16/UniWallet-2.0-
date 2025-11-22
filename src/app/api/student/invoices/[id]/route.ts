import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                feeStructure: {
                    include: {
                        school: true
                    }
                },
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // RBAC Check: Ensure invoice belongs to this student
        if (invoice.studentId !== student.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Get invoice error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
