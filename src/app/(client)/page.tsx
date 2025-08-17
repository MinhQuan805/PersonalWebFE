'use client';

import { Card, Row, Col, Typography, Button, Steps, Input, Form, Spin, notification, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { EnvironmentOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons';
import { FaLightbulb, FaPencilRuler, FaSeedling, FaShieldAlt, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import { TbBrandGithubFilled } from 'react-icons/tb';
import '@/styles/globals.css';
import '@/styles/client/home/mission-home.css';
import '@/styles/client/home/product-home.css';
import ArticleStyle from '@/styles/client/home/articleHighlight.module.css';
import '@/styles/client/home/article-home.css';
import '@/styles/client/home/contact-home.css';
import '@/styles/client/home/intro-home.css';
import '@/styles/client/home/pricing-home.css';
import '@/styles/client/main.css';
import ArticleHighlight from '@/components/client/Article';
import { useRouter } from 'next/navigation';
import type { ArticleType } from '@/lib/models/article.model';
import type { ProductType } from '@/lib/models/product.model';
import axios from 'axios';
import { ContactSubmit } from '@/utils/SubmitContact';
import { sendGAEvent } from '@next/third-parties/google';

// Import dữ liệu cá nhân
import personal from '@/data/personal.json';
import Testimonials from '@/components/client/Testimonial';

const { Title, Paragraph } = Typography;

const missions = [
  { icon: <FaLightbulb className="mission-home-icon" />, title: 'Solve', description: 'Ứng dụng công nghệ để giải quyết các vấn đề thực tế một cách hiệu quả.' },
  { icon: <FaPencilRuler className="mission-home-icon" />, title: 'UX', description: 'Phát triển sản phẩm mượt mà, thân thiện và hữu ích cho người dùng.' },
  { icon: <FaSeedling className="mission-home-icon" />, title: 'Grow', description: 'Liên tục học hỏi, cập nhật công nghệ và nâng cao kỹ năng.' },
  { icon: <FaShieldAlt className="mission-home-icon" />, title: 'Secure', description: 'Đảm bảo chất lượng mã, hiệu suất ổn định và bảo mật dữ liệu.' }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const router = useRouter();

  const onFinish = (values: any) => {
    sendGAEvent('event', 'contact_form_submitted', { subject: values.subject || '' });
    ContactSubmit({ values, form, api, setLoadingContact });
  };

  const handleDownload = () => {
    sendGAEvent('event', 'resume_downloaded');
    const link = document.createElement('a');
    link.href = personal.intro.resumeFile;
    link.download = 'CV.pdf';
    link.click();
  };

  const handleLearnMore = (productTitle: string) => {
    sendGAEvent('event', 'product_learn_more', { product: productTitle });
  };

  const handleArticleClick = () => {
    sendGAEvent('event', 'article_section_viewed');
    router.push('/article');
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

  const newArticles = articles.slice(0, 4);

  return (
    <div style={{ backgroundColor: '#fff', marginBottom: 150 }}>
      {contextHolder}

      {/* Intro Section */}
      <div className="intro-container">
        <Row gutter={[32, 32]} align="middle" className="intro-left">
          <Col xs={24} md={12}>
            <Title className="intro-title">
              <span style={{ fontSize: 30, fontWeight: 700 }}>{personal.intro.greeting}</span>
            </Title>

            <Title className="intro-title">
              <span style={{ fontSize: 25, fontWeight: 700 }}>Mình là </span>
              <span
                style={{
                  fontSize: 45,
                  fontWeight: "600",
                  background: "linear-gradient(to top, #FFD54F 40%, transparent 40%)",
                  color: "#333b92ff",
                  display: "inline-block"
                }}
              >
                {personal.intro.name}
              </span>
            </Title>

            <Title className="intro-title">
              <span style={{ fontSize: 25, fontWeight: 700 }}>- {personal.intro.highlight}</span>
            </Title>

            {personal.intro.description.map((d, i) => (
              <Paragraph key={i} className="intro-description">{d}</Paragraph>
            ))}
          </Col>
          <Col xs={24} md={12}>
            <div className="intro-image">
              <img src={personal.intro.avatar} alt={personal.intro.name} className="intro-image" />
            </div>
          </Col>
        </Row>
        <div className="intro-button">
          <Button onClick={handleDownload} type="primary" size="large">
            Get My Resume
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="about-container" data-aos="fade-up" data-aos-delay="100" style={{ marginTop: 100 }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={8} style={{ textAlign: "center" }}>
            <div className="about-avatar-wrapper">
              <img src={personal.about.logo} alt="Profile" className="about-avatar" />
              <div className="about-social">
                <Button shape="circle" href={personal.about.socials.linkedin} icon={<FaLinkedinIn />} />
                <Button shape="circle" href={personal.about.socials.github}><TbBrandGithubFilled style={{ height: 20, width: 20 }} /></Button>
                <Button shape="circle" href={personal.about.socials.facebook} icon={<FaFacebookF />} />
              </div>
            </div>
            <Paragraph className="about-role">{personal.about.role}</Paragraph>
            <Title level={3} className="about-name">{personal.about.name}</Title>
          </Col>

          <Col xs={24} lg={16}>
            <div className="about-bio">
              <div className="about-bio-heading">
                <span className="about-bio-icon">●</span>
                <Title level={3}>Biography</Title>
              </div>
              {personal.about.bio.map((b, i) => (
                <Paragraph key={i}>{b}</Paragraph>
              ))}

              <Row gutter={[32, 16]} className="about-info">
                <Col xs={24} sm={12}>
                  <p><strong>Name:</strong> {personal.about.name}</p>
                  <p><strong>Birthday:</strong> {personal.about.info.birthday}</p>
                  <p><strong>Age:</strong> {personal.about.info.age} years</p>
                  <p><strong>Address:</strong> {personal.about.info.address}</p>
                </Col>
                <Col xs={24} sm={12}>
                  <p><strong>Phone:</strong> {personal.about.info.phone}</p>
                  <p><strong>Email:</strong> {personal.about.info.email}</p>
                  <p><strong>Freelance:</strong> {personal.about.info.freelance}</p>
                </Col>
              </Row>
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
        <div className="product-home-heading">
          <div>Sản Phẩm</div>
        </div>
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
                    <Button type="primary" size="large" className="product-home-button"
                      onClick={() => handleLearnMore(products[currentStep].title)}>Khám phá</Button>
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
          <Card className="article-home-card" onClick={handleArticleClick}>
            <Row align="middle" gutter={[24, 0]}>
              <Col xs={24} md={13}>
                <div className="article-home-content">
                  <Title level={2}>Hành trình tích lũy kiến thức và tài chính của tôi</Title>
                  <Paragraph className='product-home-description'>
                    Việc phát triển năng lực là một hành trình dài, và đây là nơi để tôi chia sẻ hành trình phát triển kỹ năng của mình
                  </Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      onClick={handleArticleClick} className={ArticleStyle.articleButton}
                      style={{ fontSize: 17, width: 150, height: 40 }}>Cùng đồng hành</Button>
                  </div>
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
        <Spin tip="Đang tải bài viết..." size="large" spinning={loadingArticle} style={{ margin: 50 }}>
          <ArticleHighlight articles={newArticles} style={ArticleStyle} />
        </Spin>
      </div>

      <Testimonials />

      {/* Pricing Section */}
      <div className="pricing-container">
        <Title level={2} className="pricing-title">My Pricing</Title>

        <Tabs defaultActiveKey="1" centered className="pricing-tabs">
          {/* Standard Plan */}
          <Tabs.TabPane tab="Standard Plan" key="1">
            <Card className="pricing-card">
              <Row gutter={[32, 16]} align="middle">
                <Col xs={24} md={12}>
                  <Title level={3}>Standard Plan</Title>
                  <ul className="pricing-features">
                    <li>✔ 60 keywords</li>
                    <li>✔ 6,000 monthly website visitors</li>
                    <li>✔ 8 blogs / month</li>
                    <li>✔ 10 quality backlinks / month</li>
                  </ul>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: "center" }}>
                  <div className="pricing-price">
                    <span className="price-amount">$29</span>
                    <span className="price-unit">/per hour</span>
                  </div>
                  <Button 
                    type="primary" size="large" shape="round" className="pricing-button" 
                    onClick={() => {
                      document.querySelector(".contact-container")?.scrollIntoView({ behavior: "smooth" });
                    }}>
                    Get Started !
                  </Button>
                </Col>
              </Row>
            </Card>
          </Tabs.TabPane>

          {/* Premium Plan */}
          <Tabs.TabPane tab="Premium Plan" key="2">
            <Card className="pricing-card">
              <Row gutter={[32, 16]} align="middle">
                <Col xs={24} md={12}>
                  <Title level={3}>Premium Plan</Title>
                  <ul className="pricing-features">
                    <li>✔ 150 keywords</li>
                    <li>✔ 20,000 monthly website visitors</li>
                    <li>✔ 20 blogs / month</li>
                    <li>✔ 30 quality backlinks / month</li>
                  </ul>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: "center" }}>
                  <div className="pricing-price">
                    <span className="price-amount">$59</span>
                    <span className="price-unit">/per hour</span>
                  </div>
                  <Button 
                    type="primary" size="large" shape="round" className="pricing-button" 
                    onClick={() => {
                      document.querySelector(".contact-container")?.scrollIntoView({ behavior: "smooth" });
                    }}>
                    Get Started !
                  </Button>
                </Col>
              </Row>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </div>


      {/* Contact Section */}
      <div className="contact-container">
        <Row className="contact-wrapper">
          <Col xs={24} md={10} className="contact-info">
            <h2>Thông tin liên hệ</h2>
            <div className="contact-detail">
              <PhoneOutlined />
              <span>{personal.about.info.phone}</span>
            </div>
            <div className="contact-detail">
              <MailOutlined />
              <span>{personal.about.info.email}</span>
            </div>
            <div className="contact-detail">
              <EnvironmentOutlined />
              <span>{personal.about.info.address}</span>
            </div>
            <div className="contact-icons">
              <Button href={personal.about.socials.linkedin} icon={<FaLinkedinIn style={{ color: '#fff' }} />} />
              <Button href={personal.about.socials.github}><TbBrandGithubFilled style={{ color: '#fff', height: 20, width: 20 }} /></Button>
              <Button href={personal.about.socials.facebook} icon={<FaFacebookF style={{ color: '#fff' }} />} />
            </div>
          </Col>

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
