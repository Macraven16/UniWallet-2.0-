import { NextResponse } from 'next/server';
import { momoRequest } from '@/lib/momo';

export async function GET() {
    try {
        const response = await momoRequest(
            'collection',
            'account/balance',
            'GET'
        );

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data);
        } else {
            const errorText = await response.text();
            return NextResponse.json({ error: 'Failed to get balance', details: errorText }, { status: response.status });
        }

    } catch (error: any) {
        console.error('Collection Balance Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
