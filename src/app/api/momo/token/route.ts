import { NextResponse } from 'next/server';
import { getToken } from '@/lib/momo';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { product } = body;

        if (!['collection', 'disbursement', 'remittance'].includes(product)) {
            return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
        }

        const token = await getToken(product as any);

        return NextResponse.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600 // Approximate
        });

    } catch (error: any) {
        console.error('Token Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
