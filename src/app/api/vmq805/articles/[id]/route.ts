import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connectDB';
import { ArticleModel } from '@/lib/models/article.model';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: 'Bài viết không hợp lệ' }, { status: 400 });
  }

  try {
    await connectDB();

    const article = await ArticleModel.findOne({
      _id: id,
      deleted: false,
      status: 'active',
    });

    if (!article) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
