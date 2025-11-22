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
            'disbursement',
            'transfer',
            'POST',
            {
                amount,
                currency: currency || 'GHS',
                externalId: referenceId,
                payee,
                payerMessage: payerMessage || 'Disbursement',
                payeeNote: payeeNote || 'Disbursement',
            },
            {
                'X-Reference-Id': referenceId,
                'X-Callback-Url': process.env.MOMO_CALLBACK_HOST ? `${process.env.MOMO_CALLBACK_HOST}/api/momo/disburse/webhook` : '',
            }
        );

        if (response.status === 202) {
            return NextResponse.json({
                status: 'PENDING',
                referenceId,
                message: 'Disbursement initiated successfully',
            }, { status: 202 });
        } else {
            const errorText = await response.text();
            console.error('Disbursement Request Error:', errorText);
            return NextResponse.json({ error: 'Failed to initiate disbursement', details: errorText }, { status: response.status });
        }

    } catch (error: any) {
        console.error('Disbursement Request Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
