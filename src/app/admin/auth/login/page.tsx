'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import useAppNotification from '@/components/useAppNotification';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useAppNotification();
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      const { user, accessToken, refreshToken } = res.data;

      if (user.role === 'admin') {
        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);

        message.success('Login successful!');
        router.push('/admin/articles'); // Redirect to admin page
      } else {
        openNotification('error', 'Error', 'Invalid user account');
      }
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || 'Login failed, please try again!'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWithToken = async (url: string) => {
    const token = Cookies.get('accessToken');
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          maxWidth: 400,
          margin: '80px auto',
          padding: 24,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Admin Login</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size="middle"
            onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL, '_blank')}
          >
            Start Server
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
