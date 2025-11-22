import { NextResponse } from 'next/server';
import { momoRequest } from '@/lib/momo';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency, payee, payerMessage, payeeNote } = body;

        if (!amount || !payee || !payee.partyId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const referenceId = uuidv4();

        const response = await momoRequest(
            'remittance',
            'transfer',
            'POST',
            {
                amount,
                currency: currency || 'GHS',
                externalId: referenceId,
                payee,
                payerMessage: payerMessage || 'Remittance',
                payeeNote: payeeNote || 'Remittance',
            },
            {
                'X-Reference-Id': referenceId,
            }
        );

        if (response.status === 202) {
            return NextResponse.json({
                status: 'PENDING',
                referenceId,
                message: 'Remittance initiated successfully',
            }, { status: 202 });
        } else {
            const errorText = await response.text();
            return NextResponse.json({ error: 'Failed to initiate remittance', details: errorText }, { status: response.status });
        }

    } catch (error: any) {
        console.error('Remittance Request Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
