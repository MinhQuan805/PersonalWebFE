import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connectDB';
import { SubscriberModel } from '@/lib/models/subscriber.model';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Vui lòng nhập email' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    await connectDB();

    const existing = await SubscriberModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email đã được đăng ký' }, { status: 400 });
    }

    const subscriber = new SubscriberModel({ email });
    await subscriber.save();

    return NextResponse.json({ message: 'Đăng ký thành công!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi không thể đăng ký' }, { status: 500 });
  }
}
