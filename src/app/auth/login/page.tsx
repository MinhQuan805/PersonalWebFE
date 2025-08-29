'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import useAppNotification from '@/components/useAppNotification';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openNotification, contextHolder } = useAppNotification();
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      message.success('Đăng nhập thành công!');
      router.push('/admin');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại';
      openNotification('error', 'Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, boxShadow: '0 2px 8px #f0f1f2', borderRadius: 8 }}>
        <h2 style={{ textAlign: 'center' }}>Đăng nhập Admin</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}> 
            <Input type="email" placeholder="Nhập email"/>
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
            <Input.Password placeholder="Nhập mật khẩu"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
} 