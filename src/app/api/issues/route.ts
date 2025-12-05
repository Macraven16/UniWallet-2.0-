import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, description, attachment, priority, userId, role, email } = body;

        if (!description || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create the issue report
        const issue = await prisma.issueReport.create({
            data: {
                type: type || 'Bug',
                description,
                attachment: attachment || null, // Base64 string or URL
                priority: priority || 'Medium',
                status: 'Open',
                userId,
                role: role || 'Unknown'
            }
        });

        // Log the action
        await createAuditLog(
            userId,
            'ISSUE_REPORT',
            `User ${email || userId} reported a ${type}: ${description.substring(0, 30)}...`
        );

        // --- SIMULATE EMAIL SENDING ---
        // In a real app, use Resend or Nodemailer here.
        const targetEmail = "gyawu0001@gmail.com";
        console.log(`[EMAIL SENT] To: ${targetEmail} | Subject: New Issue Report: ${type} | Body: ${description}`);
        // ------------------------------

        return NextResponse.json({ success: true, issue });
    } catch (error) {
        console.error('Error creating issue report:', error);
        return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        // In a real app, verify Admin role here via token/session
        // For now, we assume the Admin Dashboard calls this public-ish endpoint protected by UI

        const issues = await prisma.issueReport.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true, image: true }
                }
            }
        });

        return NextResponse.json({ issues });
    } catch (error) {
        console.error('Error fetching issues:', error);
        return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }
}
