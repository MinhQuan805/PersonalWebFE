import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connectDB';
import { ArticleModel } from '@/lib/models/article.model';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const articles = await ArticleModel.find({ deleted: false, status: 'active', }).sort({ createdAt: -1 });
    return NextResponse.json(articles);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
