'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { displayAlert } from '@/redux/action/alert';
import { usePathname } from 'next/navigation';

const AlertInfo = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.alert);
  const pathname = usePathname();

  useEffect(() => {
    // Reset alert khi chuyển route
    dispatch(displayAlert('', 'hide'));
  }, [pathname, dispatch]);

  useEffect(() => {
    if (alert.visible && alert.message) {
      const timer = setTimeout(() => {
        dispatch(displayAlert('', 'hide'));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, dispatch]);

  if (!alert.visible || !alert.message) return null;

  const alertStyle = {
    height: 30,
    position: 'fixed' as const,
    top: 25,
    right: 25,
    zIndex: 9999,
    padding: '8px 16px',
    borderRadius: '4px',
    color: 'white',
    backgroundColor:
      alert.type === 'success' ? '#52c41a' :
      alert.type === 'error' ? '#ff4d4f' :
      alert.type === 'warning' ? '#faad14' : '#1890ff',
  };

  return <div style={alertStyle}>{alert.message}</div>;
};

export default AlertInfo;