import { NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/db';

export async function GET() {
  try {
    const orders = getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.shippingAddress || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required order fields (customerName, customerPhone, shippingAddress, items)' },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
