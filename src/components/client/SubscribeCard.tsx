import '@/styles/client/home/subscribe.css';
import { Form, Input, Button, Typography } from 'antd';
import AOS from 'aos';
import { useEffect } from 'react';
import { NotificationInstance } from 'antd/es/notification/interface';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

const { Title } = Typography;

type Props = {
  api: NotificationInstance;
};

const SubscribeCard: React.FC<Props> = ({ api }: Props) => {
  useEffect(() => {
    AOS.init();
  }, []);

  const handleSubscribe = async (email: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_GET}/subscribe`, { email });
      api.success({message: res.data.message || 'Đăng ký thành công!', placement: 'topRight', duration: 3 });
    } catch (err: any) {
      api.error({message: 'Lỗi', description: err.response?.data?.error || 'Không thể đăng ký', placement: 'topRight', duration: 3, });
    }
  };

  return (
    <div
      className="newsletter-container"
      data-aos="fade-up"
      data-aos-delay="100"
      style={{ marginTop: 50, textAlign: 'center' }}
    >
      <div className="newsletter-section">
        <Title level={3} className="newsletter-title">Đăng ký nhận bài viết mới nhất</Title>

        <Form
          layout="inline"
          onFinish={(values) => handleSubscribe(values.email)}
          style={{ justifyContent: 'center', marginTop: 20 }}
        >
          <div className="newsletter-receiver">
            <Form.Item name="email">
              <Input placeholder="Email của bạn" size="large" className="newsletter-input" />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" size="large" className="newsletter-btn">
                <FaBell /> Đăng ký
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SubscribeCard;
