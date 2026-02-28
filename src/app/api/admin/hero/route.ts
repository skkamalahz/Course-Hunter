import { NextRequest, NextResponse } from 'next/server';
import { getHero, updateHero } from '@/lib/content';

export async function GET() {
    try {
        const hero = await getHero();
        return NextResponse.json(hero);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch hero content' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await updateHero(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
    }
}
