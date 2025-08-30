'use client';

import { Result, Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';

const ErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');

  return (
    <Result
      status="error"
      title={msg || "Something went wrong"}
      subTitle="Vui lòng thử lại"
      extra={
        <Button type="primary" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      }
      style={{ marginTop: 40, marginBottom: 20 }}
    />
  );
};

export default ErrorPage;
