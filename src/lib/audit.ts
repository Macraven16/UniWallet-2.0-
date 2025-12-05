import { prisma } from '@/lib/prisma';

export async function createAuditLog(userId: string, action: string, details?: string) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details,
            },
        });
        console.log(`[Audit] Created log for user ${userId}: ${action}`);
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw error to prevent blocking main flow
    }
}
