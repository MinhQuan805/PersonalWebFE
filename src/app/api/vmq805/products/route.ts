import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database/connectDB'
import { ProductModel } from '@/lib/models/product.model'

export const dynamic = 'force-dynamic'

// GET: Lấy danh sách sản phẩm từ
export async function GET() {
  try {
    await connectDB()

    const products = await ProductModel.find({
      deleted: false,
      status: 'active',
    })
      .sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Lỗi server không thể lấy dữ liệu' },
      { status: 500 }
    )
  }
}
