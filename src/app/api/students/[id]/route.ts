import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { studentIdNumber, grade, campus, schoolId, name, email } = body;

        // First get the student to find the userId
        const existingStudent = await prisma.student.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingStudent) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Update Student and User in a transaction
        const student = await prisma.$transaction(async (tx) => {
            // Update User details if provided
            if (name || email) {
                await tx.user.update({
                    where: { id: existingStudent.userId },
                    data: {
                        name: name || undefined,
                        email: email || undefined,
                    }
                });
            }

            // Update Student details
            return await tx.student.update({
                where: { id },
                data: {
                    studentIdNumber,
                    grade,
                    campus,
                    schoolId,
                },
                include: { user: true, school: true }
            });
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error('Update student error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        // Deleting student usually deletes the user too if cascade is set, or just the student profile?
        // Schema says: user User @relation(..., onDelete: Cascade) in Student? No, Student has userId.
        // User has student Student?
        // Actually: Student -> user User @relation(fields: [userId], references: [id], onDelete: Cascade)
        // So if User is deleted, Student is deleted.
        // If we delete Student, User remains?
        // Usually we want to delete the User if it's a student account.

        const student = await prisma.student.findUnique({ where: { id } });
        if (student) {
            await prisma.user.delete({ where: { id: student.userId } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete student error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
