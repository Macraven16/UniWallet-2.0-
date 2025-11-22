import { NextResponse } from 'next/server';
import { momoRequest } from '@/lib/momo';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ referenceId: string }> }
) {
    try {
        const { referenceId } = await params;

        if (!referenceId) {
            return NextResponse.json({ error: 'Missing reference ID' }, { status: 400 });
        }

        const response = await momoRequest(
            'collection',
            `requesttopay/${referenceId}`,
            'GET'
        );

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                referenceId,
                status: data.status, // SUCCESSFUL, PENDING, FAILED
                amount: data.amount,
                currency: data.currency,
                financialTransactionId: data.financialTransactionId,
                externalId: data.externalId,
                reason: data.reason // Failure reason if any
            });
        } else {
            if (response.status === 404) {
                return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
            }
            const errorText = await response.text();
            return NextResponse.json({ error: 'Failed to check status', details: errorText }, { status: response.status });
        }

    } catch (error: any) {
        console.error('Collection Status Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
