'use client';

import { useCallback } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import api from '@/config/api';
import useAppNotification from '@/components/useAppNotification';

export const UploadImage = (actionUrl: string) => {
  const { openNotification } = useAppNotification();

  const customUpload = useCallback(
    async ({ file, onSuccess, onError }: any) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await api.post(`${actionUrl}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Upload response:', response.data); // Debug response
        onSuccess(response.data, file);
      } catch (err: any) {
        console.error('Upload error:', err); // Debug error
        onError(err);
        openNotification('error', 'Lỗi', 'Tải file thất bại');
      }
    },
    [actionUrl, openNotification]
  );

  const onPreview = useCallback(async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  }, []);

  return { customUpload, onPreview };
};