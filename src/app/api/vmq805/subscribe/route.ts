// src/app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connectDB';
import { SubscriberModel } from '@/lib/models/subscriber.model';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import personal from '@/data/personal.json';

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
    if (existing && existing.status === 'active') {
      return NextResponse.json({ error: 'Email đã được đăng ký' }, { status: 400 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_API_GET}/subscribe/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const now = new Date();
    const vnTime = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);

    const formattedDate = vnTime;
    await transporter.sendMail({
      from: `"Quan Notes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Nhận source code - ${formattedDate}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f4f7fa; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${personal.about.logo}" alt="Logo" width="80" height="80" />
          </div>

          <h2 style="color: #333; font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 20px;">Cảm ơn bạn đã đăng ký!</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 20px;">Vui lòng nhấn vào nút bên dưới để xác thực và nhận source code</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #0073b1, #00a1d6); color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 25px; box-shadow: 0 2px 8px rgba(0, 115, 177, 0.3); transition: all 0.3s ease;">Nhận Source Code</a>
          </div>
          
          <p style="color: #777; font-size: 14px; line-height: 1.5; text-align: center; margin-bottom: 20px;">Link này sẽ hết hạn sau 1 giờ nếu không được xác thực.</p>
          <p style="color: #999; font-size: 12px; text-align: center;">Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    });


    await SubscriberModel.findOneAndUpdate(
      { email },
      { email, status: 'pending' },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Vui lòng kiểm tra email để xác thực và nhận source code' }, { status: 200 });
  } 
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi không thể đăng ký' }, { status: 500 });
  }
}
