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

    // Check if bulk array is provided
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: 'Empty products array' }, { status: 400 });
      }
      const createdList = [];
      for (const item of body) {
        if (item.name && item.price && item.brand && item.category) {
          const created = createProduct(item);
          createdList.push(created);
        }
      }
      return NextResponse.json({ success: true, count: createdList.length, data: createdList }, { status: 201 });
    }

    if (!body.name || !body.price || !body.brand || !body.category) {
      return NextResponse.json({ error: 'Missing required fields: name, price, brand, category' }, { status: 400 });
    }
    const created = createProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
