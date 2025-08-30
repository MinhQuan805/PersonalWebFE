import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/database/connectDB';
import { SubscriberModel } from '@/lib/models/subscriber.model';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Công việc đến" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: subject || `Liên hệ từ ${name}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="color: #2c3e50; font-size: 22px; font-weight: 600; margin: 0;">Bạn có tin nhắn mới!</h3>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <p style="color: #34495e; font-size: 16px; margin: 10px 0;"><strong>Từ:</strong> <span style="color: #2980b9;">${name} &lt;${email}&gt;</span></p>
          <p style="color: #34495e; font-size: 16px; margin: 10px 0;"><strong>Tiêu đề:</strong> <span style="color: #2980b9;">${subject || 'Liên hệ từ ' + name}</span></p>
          <div style="margin: 15px 0; padding: 15px; background-color: #f1f1f1; border-left: 4px solid #3498db; border-radius: 4px;">
            <p style="color: #7f8c8d; font-size: 15px; line-height: 1.5; margin: 0;">${message}</p>
          </div>
          <p style="color: #7f8c8d; font-size: 12px; text-align: right; margin-top: 20px;">Gửi lúc: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
          <p>Vui lòng phản hồi trực tiếp qua email nếu cần.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await connectDB();
    const existing = await SubscriberModel.findOne({ email });
    if (!existing) {
      const subscriber = new SubscriberModel({ email });
      await subscriber.save();
    }
    return NextResponse.json({ message: 'Gửi email thành công' });
  } 
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi không gửi được email' }, { status: 500 });
  }
}
