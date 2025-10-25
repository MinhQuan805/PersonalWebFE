'use client';

import { Row, Col, Typography, Button } from 'antd';
const { Title, Paragraph } = Typography;
import '@/styles/client/about/about.css';
import { TbBrandGithubFilled } from 'react-icons/tb';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="about-container">
      <Row gutter={[80, 80]} align="middle">
        <Col xs={24} md={10} className="intro-image-container">
          <div className="intro-image">
            <img src="/image/general/avatar.jpg" alt="Minh Quan" className="intro-image" />
          </div>
        </Col>

        <Col xs={24} md={14}>
          <Title className="intro-title">
            <span style={{ fontSize: 30, fontWeight: 700 }}>Welcome</span>
          </Title>

          <Title className="intro-title">
            <span style={{ fontSize: 25, fontWeight: 700 }}>I’m </span>
            <span
              style={{
                fontSize: 45,
                fontWeight: "600",
                background: "linear-gradient(to top, #FFD54F 40%, transparent 40%)",
                color: "#333b92ff",
                display: "inline-block"
              }}
            >
              Minh Quan
            </span>
          </Title>

          <Title className="intro-title">
            <span style={{ fontSize: 25, fontWeight: 700 }}>
              - A student at UIT, a young person on a journey of learning and building an income.
            </span>
          </Title>

          <div className="intro-icon">
            <Button
              href="https://www.linkedin.com/in/qu%C3%A2n-v%C3%B5-821704325/"
              icon={<FaLinkedinIn style={{ color: '#1890ff' }} />}
            />
            <Button href="https://github.com/MinhQuan805">
              <TbBrandGithubFilled style={{ color: '#1890ff', height: 20, width: 20 }} />
            </Button>
            <Button
              href="https://www.facebook.com/quan.minh.780514/"
              icon={<FaFacebookF style={{ color: '#1890ff' }} />}
            />
          </div>

          <Paragraph className="intro-description">
            During my teenage years, I always longed to create something truly meaningful and leave a mark on my youth.
          </Paragraph>

          <Paragraph className="intro-description">
            But as I grew up and faced many challenges and failures, I realized how small and inexperienced I really was.
          </Paragraph>

          <Paragraph className="intro-description">
            Now, in my 20s, I’m steadily working step by step to turn my dreams into reality — no longer just words on paper. 
            And this is the place where I share that journey.
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
}
