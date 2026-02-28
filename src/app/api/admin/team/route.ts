import { NextRequest, NextResponse } from 'next/server';
import { getTeam, updateTeam } from '@/lib/content';

export async function GET() {
    try {
        const team = await getTeam();
        return NextResponse.json(team);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await updateTeam(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
    }
}
