import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function signToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function getUserIdFromRequest(req: NextRequest): string | null {
    // 1. Try Authorization Header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded?.userId) return decoded.userId;
    }

    // 2. Try Cookie (Fallback)
    const cookieToken = req.cookies.get('token')?.value;
    if (cookieToken) {
        const decoded = verifyToken(cookieToken);
        if (decoded?.userId) return decoded.userId;
    }

    console.log("Debug: No valid auth found (Header or Cookie)");
    return null;
}

export function getUserRoleFromRequest(req: NextRequest): string | null {
    // 1. Try Authorization Header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded?.role) return decoded.role;
    }

    // 2. Try Cookie (Fallback)
    const cookieToken = req.cookies.get('token')?.value;
    if (cookieToken) {
        const decoded = verifyToken(cookieToken);
        if (decoded?.role) return decoded.role;
    }

    return null;
}

export function canPerformAction(userRole: string, action: 'create' | 'update' | 'delete', targetRole: string): boolean {
    if (userRole === 'MASTER_ADMIN') return true;
    if (userRole === 'ADMIN') {
        // Admin cannot delete/update Master Admin or other Admins (depending on policy, let's say they can't touch Master)
        if (targetRole === 'MASTER_ADMIN') return false;
        return true;
    }
    if (userRole === 'STAFF') {
        // Staff can only manage Students
        if (targetRole === 'STUDENT') {
            // Staff can create/update students, but DELETE requires approval (handled in API logic, this helper checks general permission)
            // For 'delete', we might return false here to enforce the request flow, or handle it in the API.
            // Let's say this helper defines "direct" permission.
            if (action === 'delete') return false; // Staff cannot directly delete
            return true;
        }
        return false;
    }
    return false;
}
