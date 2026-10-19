import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.brand || !body.category) {
      return NextResponse.json({ error: 'Missing required fields: name, price, brand, category' }, { status: 400 });
    }
    const created = createProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
