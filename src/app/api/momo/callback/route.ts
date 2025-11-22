import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // MTN sends transaction status here
        const { externalId, status, financialTransactionId } = body;

        // externalId would match our transaction.reference or id
        // Let's assume we passed transaction.id as externalId

        if (status === 'SUCCESSFUL') {
            // Find transaction
            // const transaction = await prisma.transaction.findFirst({ where: { reference: externalId }})

            // Update transaction status
            // Update wallet balance
        }

        return NextResponse.json({ status: 'Received' });
    } catch (error) {
        return NextResponse.json({ error: 'Error processing callback' }, { status: 500 });
    }
}
