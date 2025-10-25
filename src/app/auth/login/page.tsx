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
      message.success('Login successful!');
      router.push('/admin');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      openNotification('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          maxWidth: 400,
          margin: '80px auto',
          padding: 24,
          boxShadow: '0 2px 8px #f0f1f2',
          borderRadius: 8
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
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
