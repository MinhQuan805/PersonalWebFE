import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database/connectDB'
import { DashboardModel } from '@/lib/models/dashboard.model'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const dashboard = await DashboardModel.findOne()

    if (!dashboard) {
      return NextResponse.json(
        { error: 'Dashboard không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(dashboard, { status: 200 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
