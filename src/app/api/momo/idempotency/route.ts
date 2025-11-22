import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
    return NextResponse.json({ key: uuidv4() });
}
