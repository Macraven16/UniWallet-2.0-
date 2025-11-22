import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const departments = await prisma.department.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(departments);
    } catch (error) {
        console.error('Get departments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const role = getUserRoleFromRequest(req);
        if (role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { name, description } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newDepartment = await prisma.department.create({
            data: {
                name,
                description
            }
        });

        return NextResponse.json(newDepartment, { status: 201 });

    } catch (error) {
        console.error('Create department error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
