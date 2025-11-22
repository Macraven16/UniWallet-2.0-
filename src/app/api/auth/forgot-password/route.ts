import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate a reset token (using existing JWT utility for simplicity, though a separate secret/expiry is better for production)
        const resetToken = signToken({ userId: user.id, type: 'reset-password' });

        // In a real app, send email here.
        // For now, we'll log it to the console so the developer can use it.
        console.log(`[MOCK EMAIL] Password reset link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`);

        return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
