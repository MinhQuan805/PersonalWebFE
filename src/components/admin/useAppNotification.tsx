import { notification } from 'antd';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export default function useAppNotification() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 3,
      style: {
        borderRadius: '8px',
      },
    });
  };

  return { openNotification, contextHolder };
}
