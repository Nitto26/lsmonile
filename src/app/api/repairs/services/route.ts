import { NextResponse } from 'next/server';
import { updateRepairService, getAllRepairServices } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = getAllRepairServices();
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch services' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }
    const updated = updateRepairService(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Repair service not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 500 });
  }
}
