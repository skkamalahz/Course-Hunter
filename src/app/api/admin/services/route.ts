import { NextRequest, NextResponse } from 'next/server';
import { getServices, updateServices } from '@/lib/content';

export async function GET() {
    try {
        const services = await getServices();
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await updateServices(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update services' }, { status: 500 });
    }
}
