import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connectDB';
import { SubscriberModel } from '@/lib/models/subscriber.model';
import jwt from 'jsonwebtoken';
import personal from '@/data/personal.json';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 400 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const email = decoded.email;

    await SubscriberModel.findOneAndUpdate(
      { email },
      { status: 'active' }
    );

    return NextResponse.redirect(new URL(personal.giveaway), { status: 302 });

  } catch (error: any) {
    try {
      const { searchParams } = new URL(req.url);
      const token = searchParams.get('token');

      if (token) {
        const decoded: any = jwt.decode(token);
        const email = decoded?.email;

        if (email) {
          const user = await SubscriberModel.findOne({ email });
          if (user && user.status === 'active') {
            // Nếu user đã active rồi => vẫn cho vào
            return NextResponse.redirect(new URL(personal.giveaway), { status: 302 });
          }
        }
      }
    } catch (dbCheckError) {
      console.error("DB check fallback failed:", dbCheckError);
    }

    return NextResponse.redirect(
      new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/error?status=401&msg=${encodeURIComponent(
          "Xác thực thất bại hoặc đã hết hạn"
        )}`
      ),
      { status: 302 }
    );
  }
}
