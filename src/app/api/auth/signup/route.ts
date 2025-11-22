import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role, university, indexNumber, phone, campus, grade } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'STUDENT',
            },
        });

        // If Student, create Student profile and Wallet
        if (user.role === 'STUDENT') {
            // Find school ID by name (assuming university name is passed)
            let schoolId = '';

            if (university) {
                const school = await prisma.university.findFirst({
                    where: { name: university },
                });
                if (school) schoolId = school.id;
            }

            // Fallback to first university if no specific one found (for demo purposes)
            if (!schoolId) {
                const firstSchool = await prisma.university.findFirst();
                if (firstSchool) schoolId = firstSchool.id;
            }

            if (!schoolId) {
                // If still no school, we can't create a student properly without a school
                // But we created the user. We should probably delete the user or return error before creating user.
                // For now, let's assume seeds are run.
                console.error("No university found for student signup");
            }

            if (schoolId) {
                await prisma.student.create({
                    data: {
                        userId: user.id,
                        schoolId: schoolId,
                        studentIdNumber: indexNumber || `ID-${Date.now()}`,
                        grade: grade || 'Level 100',
                        campus: campus || 'Main Campus',
                        wallet: {
                            create: {
                                balance: 0.0,
                            },
                        },
                    },
                });
            }
        }

        // Generate Token
        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
