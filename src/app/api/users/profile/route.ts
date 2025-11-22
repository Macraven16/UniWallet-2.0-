import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Decode token to get userId
        // Note: In a real app, verify signature. Here we assume middleware did basic check or we trust cookie.
        // But we should verify here too.
        let userId: string;
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            userId = decoded.userId;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, phoneNumber, image } = body;

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name || undefined,
                email: email || undefined,
                phoneNumber: phoneNumber || undefined,
                image: image || undefined,
            },
        });

        // Log activity
        await prisma.auditLog.create({
            data: {
                userId,
                action: 'PROFILE_UPDATE',
                details: 'User updated their profile details',
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let userId: string;
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            userId = decoded.userId;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                auditLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                }
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
