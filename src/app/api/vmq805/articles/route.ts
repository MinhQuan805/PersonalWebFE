import articles from '@/data/articles.json';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


// GET: Lấy danh sách bài viết
export async function GET() {
  try {
    const filtered = articles
      .filter(a => !a.deleted && a.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filtered);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}