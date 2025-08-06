import type { FormInstance } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';
import axios from 'axios';

interface HandleContactProps {
  values: any;
  form: FormInstance;
  api: NotificationInstance;
  setLoadingContact: (val: boolean) => void;
}
export const ContactSubmit = async ({
  values,
  form,
  api,
  setLoadingContact,
}: HandleContactProps) => {
  setLoadingContact(true);
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_GET}/contact`, values);
    api.success({
      message: 'Gửi thành công!',
      description: 'Cảm ơn bạn đã liên hệ. Mình sẽ phản hồi trong thời gian sớm nhất.',
      placement: 'topRight',
      duration: 4,
    });
    form.resetFields();
  } catch (err) {
    api.error({
      message: 'Gửi thất bại!',
      description: 'Vui lòng kiểm tra kết nối hoặc thử lại sau.',
      placement: 'topRight',
      duration: 4,
    });
  } finally {
    setLoadingContact(false);
  }
};
