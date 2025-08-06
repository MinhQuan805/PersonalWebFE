import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { ProductModel } from '@/lib/models/product.model';

export const dynamic = 'force-dynamic'; // tránh cache khi deploy

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({ deleted: false }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
