'use client';

import { Result, Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ErrorPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');

  return (
    <Result
      status="error"
      title={msg || "Something went wrong"}
      subTitle="Try later"
      extra={
        <Button type="primary" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      }
      style={{ marginTop: 40, marginBottom: 20 }}
    />
  );
};

const ErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPageContent />
    </Suspense>
  );
};

export default ErrorPage;
