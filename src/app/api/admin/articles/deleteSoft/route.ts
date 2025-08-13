import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { ArticleModel } from '@/lib/models/article.model';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await ArticleModel.findByIdAndUpdate(id, { deleted: true });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}