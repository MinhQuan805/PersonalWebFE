import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database/connectDB'
import { ArticleModel } from '@/lib/models/article.model'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const id = req.nextUrl.searchParams.get('id')

    if (id) {
      // Lấy 1 bài viết theo id
      const article = await ArticleModel.findOne({
        _id: id,
        deleted: false,
        status: 'active',
      })

      if (!article) {
        return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
      }

      return NextResponse.json(article, { status: 200 })
    } else {
      // Lấy danh sách tất cả bài viết
      const articles = await ArticleModel.find({
        deleted: false,
        status: 'active',
      })
        .sort({ createdAt: -1 })
        .select('-content')

      return NextResponse.json(articles)
    }
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
