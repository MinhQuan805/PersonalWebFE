import { NextResponse } from 'next/server';
import products from '@/data/products.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filtered = products
      .filter(a => !a.deleted && a.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filtered);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
