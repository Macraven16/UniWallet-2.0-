import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const universities = await prisma.university.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(universities);
    } catch (error) {
        console.error('Get universities error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
