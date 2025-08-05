'use client';

import { Row, Col, Typography, Button} from 'antd';
const { Title, Paragraph } = Typography;
import '@/styles/client/about/about.css';
import { TbBrandGithubFilled } from 'react-icons/tb';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
export default function Home() {
  return (
    <div className="intro-container">
      <Row gutter={[32, 32]} align="middle">
        <Col xs={0} md={12} className="intro-image-container">
          <div className="intro-image">
            <img src="/image/avatar.jpg" alt="Minh Quan" className="intro-image" />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Title level={2} className="intro-title">
            Hello, welcome bạn<br />Mình là Minh Quân
          </Title>
          <div className="intro-icon">
              <Button href="https://www.linkedin.com/in/qu%C3%A2n-v%C3%B5-821704325/" icon={<FaLinkedinIn style={{ color: '#1890ff' }} />} />
              <Button href="https://github.com/MinhQuan805"><TbBrandGithubFilled style={{ color: '#1890ff', height: 20, width: 20 }} /></Button>
              <Button href="https://www.facebook.com/quan.minh.780514/" icon={<FaFacebookF style={{ color: '#1890ff' }} />} />
          </div>
          <Paragraph className="intro-description">
            Join the millions of companies that use Stripe to accept payments online and in person, embed financial services, power custom revenue models, and build a more profitable business.
          </Paragraph>
          <Paragraph className="intro-description">
            Join the millions of companies that use Stripe to accept payments online and in person, embed financial services, power custom revenue.
          </Paragraph>
        </Col>
      </Row>
    </div>
  )
}