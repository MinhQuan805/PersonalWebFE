import api from '@/config/api';
import { NotificationType } from '../useAppNotification';

interface CreateNewDataProps {
  action_url: string;
  data: any;
  openNotification: (type: NotificationType, title: string, message: string) => void;
}

export const CreateNewData = async ({ action_url, data, openNotification }: CreateNewDataProps) => {
  try {
    const response = await api.post(`${action_url}/create`, data);

    if (response.data.success) {
      openNotification('success', 'Thành công', response.data.message);
      return true;
    } else {
      openNotification('error', 'Lỗi', response.data.message);
      return false;
    }
  } catch (error: any) {
    openNotification('error', 'Lỗi', error.response?.data?.message || 'Có lỗi xảy ra');
    return false;
  }
};
