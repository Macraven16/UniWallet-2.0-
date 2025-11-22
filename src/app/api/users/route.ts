import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getUserRoleFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        // Verify Admin
        // const role = getUserRoleFromRequest(request as any);
        // if (role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                department: true,
                student: true,
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Verify Admin
        // const role = getUserRoleFromRequest(request as any);
        // if (role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        const body = await request.json();
        const { email, password, name, role, departmentId, phoneNumber } = body;

        if (!email || !password || !name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                departmentId: departmentId || null,
                phoneNumber: phoneNumber || null,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
