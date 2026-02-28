import { NextRequest, NextResponse } from 'next/server';
import { getGallery, updateGallery } from '@/lib/content';

export async function GET() {
    try {
        const gallery = await getGallery();
        return NextResponse.json(gallery);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await updateGallery(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 });
    }
}
