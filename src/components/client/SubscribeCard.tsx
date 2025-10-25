import '@/styles/client/home/subscribe.css';
import { Form, Input, Button, Typography } from 'antd';
import AOS from 'aos';
import { useEffect, useState } from 'react';
import { NotificationInstance } from 'antd/es/notification/interface';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { IoCodeSharp, IoCodeSlash } from 'react-icons/io5';

const { Title } = Typography;

type Props = {
  api: NotificationInstance;
};

const SubscribeCard: React.FC<Props> = ({ api }: Props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleSubscribe = async (email: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_GET}/subscribe`, { email });
      api.success({
        message: res.data.message || 'Subscription successful!',
        placement: 'topRight',
        duration: 3,
      });
    } catch (err: any) {
      api.error({
        message: 'Error',
        description: err.response?.data?.error || 'Unable to subscribe',
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="newsletter-container"
      data-aos="fade-up"
      data-aos-delay="100"
      style={{ marginTop: 50, textAlign: 'center' }}
    >
      <Title level={2} className="newsletter-title" style={{ marginBottom: 20 }}>
        <IoCodeSharp className="newsletter-logo" />
        Do you want to explore the <span className="newsletter-highlight"> Source Code </span> of this site?
        <IoCodeSlash className="newsletter-logo" />
      </Title>

      <div className="newsletter-section">
        <p style={{ color: '#666', marginBottom: 20, fontSize: 22 }}>
          Subscribe to receive the source code directly in your inbox!
        </p>

        <Form
          layout="inline"
          onFinish={(values) => handleSubscribe(values.email)}
          style={{ justifyContent: 'center', marginTop: 20 }}
        >
          <div className="newsletter-receiver">
            <Form.Item name="email">
              <Input
                placeholder="Your email"
                size="large"
                className="newsletter-input"
                aria-label="Enter your email to subscribe to the source code"
              />
            </Form.Item>

            <Form.Item data-aos="zoom-in" data-aos-delay="100">
              <Button
                htmlType="submit"
                size="large"
                className="newsletter-btn"
                loading={loading}
                aria-label="Subscribe to receive source code"
              >
                <FaBell /> Subscribe
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SubscribeCard;
