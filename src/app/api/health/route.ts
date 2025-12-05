import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const start = Date.now();
    try {
        // DB Latency Check
        const dbStart = Date.now();
        const userCount = await prisma.user.count();
        const dbLatency = Date.now() - dbStart;

        const feeCount = await prisma.feeStructure.count();
        const studentCount = await prisma.student.count();

        // Check for recent error logs
        let errorLogs: string[] = [];
        try {
            const logPath = path.join(process.cwd(), 'login-error.log');
            if (fs.existsSync(logPath)) {
                const logs = fs.readFileSync(logPath, 'utf-8')
                    .split('\n')
                    .filter(line => line.trim().length > 5); // Filter out empty lines or just braces
                errorLogs = logs.slice(-5); // Get last 5 meaningful lines
            }
        } catch (e) {
            // Ignore log read errors
        }

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            db: {
                connected: true,
                latency: `${dbLatency}ms`,
                users: userCount,
                fees: feeCount,
                students: studentCount
            },
            system: {
                memory: process.memoryUsage(),
                nodeVersion: process.version
            },
            recentErrors: errorLogs
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({
            status: 'unhealthy',
            error: 'Database connection failed',
            details: String(error)
        }, { status: 500 });
    }
}
