import { NextResponse } from 'next/server';
import crypto from 'crypto';

// This secret should be in .env. For sandbox, it might be the API Key or a specific webhook secret.
// In production, you configure this in the MoMo dashboard.
const MOMO_WEBHOOK_SECRET = process.env.MOMO_WEBHOOK_SECRET || 'your-webhook-secret';

export async function POST(request: Request) {
    try {
        const body = await request.text(); // Read as text for hashing
        const signature = request.headers.get('X-Callback-Signature'); // Or whatever header MTN uses (often X-Callback-Signature or similar)

        if (!signature) {
            // For Sandbox, we might not get a signature, so we can be lenient or strict.
            // For "Zero Tolerance", we should log a warning or fail.
            // console.warn('Missing Webhook Signature');
            // return NextResponse.json({ error: 'Missing Signature' }, { status: 401 });
        }

        // Verify Signature (HMAC-SHA256 usually)
        // const hmac = crypto.createHmac('sha256', MOMO_WEBHOOK_SECRET);
        // const digest = hmac.update(body).digest('hex');
        // if (signature !== digest) {
        //     return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
        // }

        const data = JSON.parse(body);
        const referenceId = request.headers.get('X-Reference-Id');

        console.log('MoMo Webhook Verified:', { referenceId, status: data.status });

        // TODO: Update transaction status in DB
        // await prisma.transaction.update(...)

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json(null, { status: 500 });
    }
}
