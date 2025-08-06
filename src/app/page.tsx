'use client';

import { Card, Row, Col, Typography, Button, Steps, Input, Form, Spin, notification} from 'antd';
import { useEffect, useState } from 'react';
import { EnvironmentOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons';
import { FaLightbulb, FaPencilRuler, FaSeedling, FaShieldAlt, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import { TbBrandGithubFilled } from 'react-icons/tb';
import '@/styles/client/home/mission-home.css';
import '@/styles/client/home/product-home.css';
import ArticleStyle from '@/styles/client/home/articleHighlight.module.css';
import '@/styles/client/home/article-home.css';
import '@/styles/client/home/contact-home.css'; 
import '@/styles/client/home/intro-home.css';
import '@/styles/client/main.css';
import ArticleHighlight from '@/components/Article';
import { useRouter } from 'next/navigation';
import SupportCard from '@/components/SupportCard';
import type { ArticleType } from '@/lib/models/article.model';
import type { ProductType } from '@/lib/models/product.model';
import axios from 'axios';
const { Title, Paragraph } = Typography;
import { ContactSubmit } from '@/utils/SubmitContact';

const missions = [
  { icon: <FaLightbulb className="mission-home-icon" />, title: 'Solve', description: 'Ứng dụng công nghệ để giải quyết các vấn đề thực tế một cách hiệu quả.' },
  { icon: <FaPencilRuler className="mission-home-icon" />, title: 'UX', description: 'Phát triển sản phẩm mượt mà, thân thiện và hữu ích cho người dùng.' },
  { icon: <FaSeedling className="mission-home-icon" />, title: 'Grow', description: 'Liên tục học hỏi, cập nhật công nghệ và nâng cao kỹ năng.' },
  { icon: <FaShieldAlt className="mission-home-icon" />, title: 'Secure', description: 'Đảm bảo chất lượng mã, hiệu suất ổn định và bảo mật dữ liệu.' }
];  

// Dữ liệu mẫu

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = (values: any) => {
    ContactSubmit({ values, form, api, setLoadingContact });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/products`);
        setProducts(resProduct.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resArticle = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/articles`);
        setArticles(resArticle.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/files/CV.pdf`; 
    link.download = 'CV.pdf';
    link.click();
  };

  const newArticles = articles.slice(0, 4);


  return (
    <div style={{ backgroundColor: '#fff', marginBottom: 150 }}>
      {/* Intro Section */}
      {contextHolder}
      <div className="intro-container">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <Title level={2} className="intro-title">
              Hello, welcome bạn<br />Mình là Minh Quân
            </Title>
            <Paragraph className="intro-description">
              Join the millions of companies that use Stripe to accept payments online and in person, embed financial services, power custom revenue models, and build a more profitable business.
            </Paragraph>
            <Paragraph className="intro-description">
              Join the millions of companies that use Stripe to accept payments online and in person, embed financial services, power custom revenue.
            </Paragraph>
            <div className="intro-button">
              <Button onClick={handleDownload} type="primary" size="large" className="intro-button">
                Get My Resume
              </Button>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="intro-image">
              <img src="/image/general/logo.png" alt="Minh Quan" className="intro-image" />
            </div>
          </Col>
        </Row>
      </div>

      {/* Missions Section */}
      <div className="missions-container">
        <div className="missions-section">
          <Row gutter={0}>
            {missions.map((m, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card className="mission-home-card">
                  <div className="mission-home-header">
                    {m.icon}
                    <Title level={3} className="mission-home-title">{m.title}</Title>
                  </div>
                  <Paragraph className="mission-home-description">{m.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Products Section */}
      <div className="product-home-container">
        <Spin tip="Đang tải sản phẩm..." size="large" spinning={loadingProduct}>
          <div className="product-home-section">
            <div className="transition">
              <Steps
                progressDot
                current={currentStep}
                onChange={setCurrentStep}
                direction="horizontal"
                responsive
                items={products.map(() => ({ title: '' }))}
                className="product-home-step"
              />
              <Button onClick={() => setCurrentStep((prev) => (prev === 0 ? products.length - 1 : prev - 1))} className="button-transition">
                <LeftOutlined />
              </Button>
              <Button onClick={() => setCurrentStep((prev) => (prev === products.length - 1 ? 0 : prev + 1))} className="button-transition">
                <RightOutlined />
              </Button>
            </div>
            {products.length > 0 && (
            <Row gutter={[48, 0]} align="middle">
              <Col xs={24} lg={10}>
                <div className="product-home-content">
                  <div className="product-home-header">
                    <img src={products[currentStep].logo} />
                    <span className="product-home-label">{products[currentStep].title}</span>
                  </div>
                  <Title level={1} className="product-home-title">{products[currentStep].shortDescription}</Title>
                  <Paragraph className="product-home-description">{products[currentStep].introduction}</Paragraph>
                  <Button type="primary" size="large" className="product-home-button">Learn more</Button>
                </div>
              </Col>
              <Col xs={24} lg={14}>
                <div className="product-home-image">
                  <img src={products[currentStep].thumbnail} />
                </div>
              </Col>
            </Row>
            )}
          </div>
        </Spin>
      </div>

      {/* Articles Section */}
      <div className="article-container">
        <div className="article-home-wrapper">
          <Card className="article-home-card">
            <Row align="middle" gutter={[24, 0]}>
              <Col xs={24} md={13}>
                <div className="article-home-content">
                  <Title level={2}>Hành trình tích lũy kiến thức và tài chính của tôi</Title>
                  <Paragraph className='product-home-description'>
                    Việc phát triển năng lực là một hành trình dài, và đây là nơi để tôi tiếp tục phá triển kỹ năng của mình
                  </Paragraph>
                  <Button onClick={() => router.push('/article')}className={ArticleStyle.articleButton} style={{ fontSize: 17, width: 150, height: 40 }}>Tìm hiểu</Button>
                </div>
              </Col>
              <Col xs={24} md={11}>
                <div className="article-home-image">
                  <img src="/image/home/business.jpg" alt="Business Plan" />
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Featured Articles */}
        <Spin tip="Đang tải bài viết..." size="large" spinning={loadingArticle} style={{margin: 50}}>
          <ArticleHighlight articles={newArticles} style={ArticleStyle}/>
        </Spin>
      </div>

      {/* Contact Section */}
      <div className="contact-container">
        <Row className="contact-wrapper">
          {/* Left - Contact Info */}
          <Col xs={24} md={10} className="contact-info">
            <h2>Thông tin liên hệ</h2>
            <div className="contact-detail">
              <PhoneOutlined />
              <span>0946008580</span>
            </div>
            <div className="contact-detail">
              <MailOutlined />
              <span>minhquan8052006@gmail.com</span>
            </div>
            <div className="contact-detail">
              <EnvironmentOutlined />
              <span>Quận Bình Thành, Thành Phố Hồ Chí Minh</span>
            </div>
            <div className="contact-icons">
              <Button href="https://www.linkedin.com/in/qu%C3%A2n-v%C3%B5-821704325/" icon={<FaLinkedinIn style={{ color: '#fff' }} />} />
              <Button href="https://github.com/MinhQuan805"><TbBrandGithubFilled style={{ color: '#fff', height: 20, width: 20 }} /></Button>
              <Button href="https://www.facebook.com/quan.minh.780514/" icon={<FaFacebookF style={{ color: '#fff' }} />} />
            </div>
          </Col>

          {/* Right - Form */}
          <Col xs={24} md={14} className="contact-form">
            <Spin spinning={loadingContact}>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                      <Input variant="borderless" className="underline-input" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                      <Input variant="borderless" className="underline-input" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Tiêu đề" name="subject">
                  <Input variant="borderless" className="underline-input" />
                </Form.Item>
                <Form.Item label="Lời nhắn" name="message">
                  <Input.TextArea rows={5} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="send-button">
                    Gửi
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  );
}