import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';
import { getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log(`[Fee Update] ID: ${id}, Body:`, body);
        const { name, amount, dueDate, schoolId } = body;

        // Basic validation
        if (!name || !amount || !dueDate || !schoolId) {
            console.log("[Fee Update] Missing fields:", { name, amount, dueDate, schoolId });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fee = await prisma.feeStructure.update({
            where: { id },
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                schoolId,
            },
        });

        return NextResponse.json(fee);
    } catch (error) {
        console.error('Update fee error:', error);
        return NextResponse.json({ error: 'Failed to update fee', details: String(error) }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const role = getUserRoleFromRequest(request as any);
        const userId = getUserIdFromRequest(request as any);

        if (role === 'STAFF') {
            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // Create Deletion Request
            await prisma.deletionRequest.create({
                data: {
                    resourceType: 'FEE',
                    feeStructureId: id,
                    staffId: userId,
                    reason: 'Staff requested deletion',
                    status: 'PENDING'
                }
            });

            return NextResponse.json({
                success: true,
                message: 'Deletion request submitted for Admin approval',
                requestPending: true
            }, { status: 202 });
        }

        // Delete linked invoices first (cascade manually if needed, or rely on schema)
        // Schema has invoices linked. We should probably delete them or check logic.
        // For safety, let's delete invoices.
        await prisma.invoice.deleteMany({
            where: { feeStructureId: id }
        });

        await prisma.feeStructure.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete fee error:', error);
        return NextResponse.json({ error: 'Failed to delete fee' }, { status: 500 });
    }
}
