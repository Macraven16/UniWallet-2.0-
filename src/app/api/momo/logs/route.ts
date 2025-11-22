import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Assuming we log MoMo transactions in AuditLog or a specific table.
        // For now, let's fetch recent AuditLogs related to payments.
        const logs = await prisma.auditLog.findMany({
            where: {
                action: { in: ['PAYMENT', 'DISBURSEMENT', 'REMITTANCE'] }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Logs Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
