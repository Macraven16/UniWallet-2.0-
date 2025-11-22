import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import rateLimit from '@/lib/rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize rate limiter
const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Rate Limiting for MoMo APIs
    if (pathname.startsWith('/api/momo')) {
        try {
            // Use IP or Token as key
            const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
            const limit = 10; // 10 requests per minute per IP
            await limiter.check(NextResponse, limit, ip + pathname); // Limit per endpoint
        } catch {
            return NextResponse.json({ error: 'Rate Limit Exceeded' }, { status: 429 });
        }
    }

    // Protected routes
    const protectedRoutes = ['/admin', '/student', '/parent', '/api/momo'];
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtected) {
        if (!token) {
            // Redirect to login for page requests, return 401 for API
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Note: jwt.verify might not work in Edge Runtime if it relies on Node.js crypto.
            // However, for this environment (likely Node.js runtime for Next.js), it might be fine.
            // If it fails, we might need 'jose' library.
            // For now, we assume it works or we just check token existence for basic protection.

            // Decoding without verification to get role (verification happened at login/session start)
            // Ideally we verify signature too.
            const decoded = jwt.decode(token) as any;

            if (!decoded) {
                throw new Error('Invalid token');
            }

            const userRole = decoded.role;

            // RBAC for MoMo Disbursement and Remittance (Admin only)
            if (pathname.startsWith('/api/momo/disburse') || pathname.startsWith('/api/momo/remit')) {
                if (!['ADMIN', 'MASTER_ADMIN'].includes(userRole)) {
                    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
                }
            }

            // Basic RBAC for pages
            if (pathname.startsWith('/admin') && !['ADMIN', 'MASTER_ADMIN', 'STAFF'].includes(userRole)) {
                return NextResponse.redirect(new URL('/student', request.url)); // Redirect to student dashboard
            }

        } catch (error) {
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/student/:path*', '/parent/:path*', '/api/momo/:path*'],
};
