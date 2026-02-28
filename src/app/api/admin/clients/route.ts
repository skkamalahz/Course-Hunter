import { NextRequest, NextResponse } from 'next/server';
import { getClients, updateClients } from '@/lib/content';

export async function GET() {
    try {
        const clients = await getClients();
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await updateClients(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update clients' }, { status: 500 });
    }
}
