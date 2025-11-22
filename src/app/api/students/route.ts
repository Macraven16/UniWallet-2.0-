import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: true,
                school: true,
                wallet: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, schoolId, studentIdNumber, grade, campus } = body;

        if (!email || !password || !name || !schoolId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create User first
        const hashedPassword = await hashPassword(password);

        // Transaction to ensure both user and student are created
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'STUDENT',
                },
            });

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    schoolId,
                    studentIdNumber: studentIdNumber || `ID-${Date.now()}`,
                    grade: grade || 'Level 100',
                    campus: campus || 'Main Campus',
                    wallet: {
                        create: {
                            balance: 0.0,
                        },
                    },
                },
                include: {
                    user: true,
                    school: true,
                }
            });

            return student;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Create student error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
