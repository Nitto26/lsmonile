import { NextResponse } from 'next/server';
import { getRepairBookingById, updateRepairBooking } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const booking = getRepairBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Repair ticket not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch ticket' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateRepairBooking(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Repair ticket not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update ticket' }, { status: 500 });
  }
}
