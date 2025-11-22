import { NextResponse } from 'next/server';
import { momoRequest } from '@/lib/momo';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    try {
        const { number } = await params;

        if (!number) {
            return NextResponse.json({ error: 'Missing phone number' }, { status: 400 });
        }

        // Note: The endpoint for validation depends on the specific API version and permission.
        // Standard sandbox often supports: /v1_0/accountholder/msisdn/{partyId}/active
        const response = await momoRequest(
            'collection',
            `accountholder/msisdn/${number}/active`,
            'GET'
        );

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                isValid: data.result === true,
                // Sandbox might not return name, but production with specific permissions might.
            });
        } else {
            const errorText = await response.text();
            return NextResponse.json({ error: 'Failed to validate account', details: errorText }, { status: response.status });
        }

    } catch (error: any) {
        console.error('Account Validation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
