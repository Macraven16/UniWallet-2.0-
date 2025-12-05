import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        const role = getUserRoleFromRequest(request as any);
        if (role !== 'ADMIN' && role !== 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const requests = await prisma.deletionRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                staff: { select: { name: true, email: true } },
                feeStructure: { select: { name: true, amount: true } },
                student: { select: { grade: true, studentIdNumber: true, user: { select: { name: true } } } }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Get requests error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const role = getUserRoleFromRequest(request as any);
        const adminId = getUserIdFromRequest(request as any);

        if (role !== 'ADMIN' && role !== 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { requestId, action } = body; // action: 'APPROVE' | 'REJECT'

        if (!requestId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const deletionRequest = await prisma.deletionRequest.findUnique({
            where: { id: requestId },
        });

        if (!deletionRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (action === 'REJECT') {
            await prisma.deletionRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' },
            });
            return NextResponse.json({ success: true, message: 'Request rejected' });
        }

        if (action === 'APPROVE') {
            // Perform Deletion based on type
            if (deletionRequest.resourceType === 'FEE' && deletionRequest.feeStructureId) {
                // Delete Invoices first
                await prisma.invoice.deleteMany({
                    where: { feeStructureId: deletionRequest.feeStructureId }
                });
                // Delete Fee
                // Check if it still exists
                const feeExists = await prisma.feeStructure.findUnique({ where: { id: deletionRequest.feeStructureId } });
                if (feeExists) {
                    await prisma.feeStructure.delete({
                        where: { id: deletionRequest.feeStructureId }
                    });
                }
            }
            else if (deletionRequest.resourceType === 'STUDENT' && deletionRequest.studentId) {
                // Logic to delete student (and user?)
                // Usually user deletion cascades to student.
                // If we have student ID, we find userId?
                // Current schema: Student has unique userId.

                const student = await prisma.student.findUnique({ where: { id: deletionRequest.studentId } });
                if (student) {
                    // Delete User (cascades to Student)
                    await prisma.user.delete({ where: { id: student.userId } });
                }
            }

            // Update Request
            await prisma.deletionRequest.update({
                where: { id: requestId },
                data: { status: 'APPROVED' },
            });

            if (adminId) {
                await createAuditLog(adminId, 'APPROVE_DELETION', `Approved deletion request ${requestId}`);
            }

            return NextResponse.json({ success: true, message: 'Deletion approved and executed' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Process request error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
