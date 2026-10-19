import { NextResponse } from 'next/server';
import { getAllRepairServices, getAllRepairBookings, createRepairBooking } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = getAllRepairServices();
    const bookings = getAllRepairBookings();
    return NextResponse.json({ services, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch repair data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.deviceType || !body.brand || !body.model || !body.issue || !body.customerName || !body.phone) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }
    const created = createRepairBooking(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
