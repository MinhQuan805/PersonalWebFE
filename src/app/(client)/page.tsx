'use client';

// React / Next.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Ant Design
import { Card, Row, Col, Typography, Button, Steps, Input, Form, Spin, notification, Tabs } from 'antd';
import { EnvironmentOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons';

// React Icons
import { FaLightbulb, FaPencilRuler, FaSeedling, FaShieldAlt, FaLinkedinIn, FaFacebookF, FaLink } from 'react-icons/fa';
import { TbBrandGithubFilled } from 'react-icons/tb';

// Styles
import '@/styles/globals.css';
import '@/styles/client/main.css';
import '@/styles/client/home/intro-home.css';
import '@/styles/client/home/mission-home.css';
import '@/styles/client/home/product-home.css';
import '@/styles/client/home/article-home.css';
import '@/styles/client/home/contact-home.css';
import '@/styles/client/home/pricing-home.css';
import '@/styles/client/home/about-home.css';
import ArticleStyle from '@/styles/client/home/articleHighlight.module.css';

// Components
import ArticleHighlight from '@/components/client/Article';
import Testimonials from '@/components/client/Testimonial';

// Data & Redux & Utils
import personal from '@/data/personal.json';
import { ContactSubmit } from '@/utils/SubmitContact';

// External libraries
import { motion, AnimatePresence } from "framer-motion";
import { sendGAEvent } from '@next/third-parties/google';
import Typewriter from "typewriter-effect";
import AOS from 'aos';
import 'aos/dist/aos.css';
import SubscribeCard from '@/components/client/SubscribeCard';
import { IoExpand } from 'react-icons/io5';
import { IoMdRocket } from 'react-icons/io';
import { useArticles } from '@/lib/hook/useArticles';
import { useProducts } from '@/lib/hook/useProducts';


const { Title, Paragraph } = Typography;

const missions = [
  { 
    color: "#f5dc00ff",
    icon: <FaLightbulb className="mission-home-icon" />, 
    title: 'Solve', 
    description: (color: string) => (
      <>Luôn <span style={{ color, fontWeight: 700 }}>đổi mới</span> giải quyết thách thức.</>
    )
  },
  { 
    color: "#be18ffff",
    icon: <FaPencilRuler className="mission-home-icon" />, 
    title: 'UX', 
    description: (color: string) => (
      <>Sản phẩm <span style={{ color, fontWeight: 700 }}>thân thiện</span> với người dùng.</>
    )
  },
  { 
    color: "#00e426ff",
    icon: <FaSeedling className="mission-home-icon" />, 
    title: 'Grow', 
    description: (color: string) => (
      <>Không ngừng <span style={{ color, fontWeight: 700 }}>học hỏi</span> và phát triển.</>
    )
  },
  { 
    color: "#1890ff",
    icon: <FaShieldAlt className="mission-home-icon" />, 
    title: 'Secure', 
    description: (color: string) => (
      <>Đặt <span style={{ color, fontWeight: 700 }}>an toàn</span> lên hàng đầu.</>
    )
  }
];




export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingContact, setLoadingContact] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const { products, loadingProducts } = useProducts();
  const { articles, loadingArticles } = useArticles();

  const newArticles = articles.slice(0, 4);

  useEffect(() => {
  AOS.init({
    duration: 800,
    once: true,  
  });
}, []);

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

  return (
    <div style={{ backgroundColor: '#fff', marginBottom: 150 }}>
      {contextHolder}

      {/* Intro Section */}
      <div className="intro-container" data-aos="fade-down" data-aos-delay="100">
        <Row gutter={[32, 32]} align="middle" className="intro-left">
          <Col xs={24} md={12}>
            <Title className="intro-title">
              <span style={{ fontSize: 40, fontWeight: 700 }}>{personal.intro.greeting}</span>
            </Title>

            <Title className="intro-title">
              <span style={{ fontSize: 30, fontWeight: 700 }}>Mình là </span>
              <span
                style={{
                  fontSize: 55,
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
              <span style={{ fontSize: 50, color: "#333b92ff", fontWeight: 700 }}>
                <Typewriter
                  options={{
                    strings: personal.intro.roles,
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 40,
                  }}
                />
              </span>
            </Title>

            {personal.intro.description.map((d, i) => (
              <Paragraph key={i} className="intro-description">{d}</Paragraph>
            ))}
            <div className="intro-button">
              <Button onClick={handleDownload} type="primary" size="large">
                Get My Resume
              </Button>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="intro-image">
              <img src={personal.intro.avatar} alt={personal.intro.name} className="intro-image" />
            </div>
          </Col>
        </Row>
      </div>

      {/* About Section */}
      <div className="about-container" data-aos="fade-up" data-aos-delay="100" style={{ marginTop: 100 }}>
        <Row gutter={[20,20]} align="middle">
          <Col xs={24} lg={10} style={{ textAlign: "center" }}>
            <div className="about-avatar-wrapper">
              <img src={personal.about.logo} alt="Profile" className="about-avatar" />
              <div className="about-social">
                <Button shape="circle" href={personal.about.socials.linkedin} icon={<FaLinkedinIn />} />
                <Button shape="circle" href={personal.about.socials.github}><TbBrandGithubFilled style={{ height: 20, width: 20 }} /></Button>
                <Button shape="circle" href={personal.about.socials.facebook} icon={<FaFacebookF />} />
              </div>
            </div>
            <Title level={3} className="about-name">{personal.about.name}</Title>
          </Col>

          <Col xs={24} lg={14}>
            <Title level={3} className="about-headline">{personal.about.headline}</Title>
            {personal.about.story.map((d, i) => (
              <Paragraph key={i} className="about-story">{d}</Paragraph>
            ))}
          </Col>
        </Row>
      </div>

      {/* Missions Section */}
      <div className="missions-container">
        <div className="home-heading">
          <div>Nguyên tắc</div>
        </div>
        <div className="missions-section">
          <Row gutter={[20, 20]} justify="center">
            {missions.map((m, i) => (
              <Col md={12} lg={6} key={i}>
                <Card className="mission-home-card">
                  <div className="mission-home-header">
                    {React.cloneElement(m.icon, { style: { color: m.color } })} 
                    <Title level={3} className="mission-home-title" style={{ color: m.color }}>
                      {m.title}
                    </Title>
                  </div>
                  <Paragraph className="mission-home-description">
                    {m.description(m.color)}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <SubscribeCard api={api}/>
      
      {/* Products Section */}
      <div className="product-home-container" data-aos="fade-up" data-aos-delay="100">
        <div className="home-heading">
          <div>Sản Phẩm</div>
        </div>
        <Spin tip="Đang tải sản phẩm..." size="large" spinning={loadingProducts}>
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
              <AnimatePresence mode="wait">
                <Row gutter={[48, 0]} align="middle">
                  <Col xs={24} lg={10}>
                    <motion.div
                      key={`left-${currentStep}`}
                      initial={{ opacity: 0, x: -20 }}   
                      animate={{ opacity: 1, x: 0 }}    
                      exit={{ opacity: 0, x: -20 }} 
                      transition={{ duration: 0.5, ease: "easeIn" }}
                    >
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
                    </motion.div>
                  </Col>
                  <Col xs={24} lg={14}>
                    <motion.div
                      key={`right-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, ease: "easeIn" }}
                    >
                      <div className="product-home-image">
                        <img src={products[currentStep].thumbnail} />
                      </div>
                    </motion.div>
                  </Col>
                </Row>
              </AnimatePresence>
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
                      style={{ fontSize: 17, width: 150, height: 40, paddingLeft: 30, paddingRight: 30 }}>Cùng đồng hành</Button>
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
        <Spin tip="Đang tải bài viết..." size="large" spinning={loadingArticles} className="inLoading">
          <ArticleHighlight articles={newArticles} style={ArticleStyle} />
        </Spin>
      </div>
      <Testimonials />

      {/* Pricing Section */}
      <div className="pricing-container" data-aos="fade-up" data-aos-delay="100">
        <div className="home-heading">
          <div>Dịch vụ</div>
        </div>
        <div className="pricing-description">
          <p>
            Bạn phát triển dự án phần mềm chất lượng và đang tìm người đồng hành?
          </p>
        </div>
        <Card className="pricing-card">
          <Row gutter={[32, 16]} align="middle">
            <Col xs={24} md={12}>
              <Title level={3}>Backend Development</Title>
              <ul className="pricing-features">
                <li><IoMdRocket className="pricing-icon"/>   Hiệu suất cao</li>
                <li><FaLink className="pricing-icon"/>   Tích hơp dễ dàng</li>
                <li><IoExpand className="pricing-icon"/>   Mở rộng linh hoạt</li>
                <li><FaShieldAlt className="pricing-icon"/>   Bảo mật mạnh mẽ</li>
              </ul>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: "center" }}>
              <div className="pricing-price">
                <span className="price-amount">$5</span>
                <span className="price-unit">/ngày</span>
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
      </div>


      {/* Contact Section */}
      <div className="contact-container" data-aos="fade-up" data-aos-delay="100">
        <div className="home-heading">
          <div>Đồng hành cùng mình</div>
        </div>
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