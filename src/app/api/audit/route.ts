import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const role = getUserRoleFromRequest(request as any);
        // Admins, Master Admins, and Staff can view logs
        if (role !== 'ADMIN' && role !== 'MASTER_ADMIN' && role !== 'STAFF') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const logs = await prisma.auditLog.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Get audit logs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
