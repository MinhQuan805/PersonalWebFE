// app/layout.tsx
'use client';

import { Button, Drawer, Layout, Menu } from 'antd';
import '@/styles/globals.css';
import '@/styles/client/layout/ClientLayout.css'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ContactCard from '@/components/client/ContactCard';
import { RiMenu2Fill } from 'react-icons/ri';
import { GoogleAnalytics } from '@next/third-parties/google'
import personal from '@/data/personal.json';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';

const { Header, Footer, Content } = Layout;
const nav = [
  { name: 'Trang chủ', link: '/' },
  { name: 'Bài viết', link: '/article' },
  { name: 'Sản phẩm', link: '/product' },
  // { name: 'Dịch vụ', link: '/service' },
  { name: 'About Me', link: `/article/read/${personal.about.link}` },
];
const navItems = nav.map((item) => ({
  key: item.link,
  label: <Link href={item.link}>{item.name}</Link>,
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState('/');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
      setSelectedKey(pathname);
  }, [pathname]);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,  
    });
  }, []);
  return (
    <html lang="en">
      <body>
        <Layout className="layout-main">
          <Header className="header-main" data-aos="fade-down" data-aos-delay="50">
            <Link href="/" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <img src="/image/general/logo.png" alt="logo" style={{ height: 60 }} />
            </Link>
            <div className="navigation-main">
              <Menu
                mode="horizontal"
                selectedKeys={[selectedKey]}
                items={navItems}
                style={{ flex: 1, minWidth: 0 }}
                className="desktop-menu"
              />
            </div>
            <div>
              <Button
                type="text"
                icon={<RiMenu2Fill />}
                onClick={() => setDrawerOpen(true)}
                className="mobile-menu-icon"
              />
            </div>
            <Drawer
              title="Menu"
              placement="right"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={200}
            >
              <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                items={navItems}
                onClick={() => setDrawerOpen(false)}
              />
            </Drawer>
            <div className="contact-header">
              <a href={personal.about.socials.linkedin} target="_blank" rel="noopener noreferrer"><img src="/image/logo/linkedin.png" alt="linkedin" /></a>
              <a href={personal.about.socials.github} target="_blank" rel="noopener noreferrer"><img src="/image/logo/github.png" alt="GitHub" /></a>
            </div>
          </Header>

          <Content className="content-main">
            {children}
          </Content>

          <Footer className="footer-main">
            <div className="footer-container">
              <div className="footer-left">
                <div className="footer-contact"><ContactCard /></div>
                <div className="footer-contact-text">
                  <p>Coyright &copy; {new Date().getFullYear()} {personal.intro.name}</p>
                  <p>Powered by React & Antd</p>
                </div>
              </div>
              <div className='footer-right'>
                <div className="footer-column-left">
                  <Link href="/">Trang chủ</Link>
                  <Link href="/article">Bài viết</Link>
                  <Link href="/product">Sản phẩm</Link>
                  {/* <Link href="/service">Dịch vụ</Link> */}
                </div>
                <div className="footer-column-right">
                  <Link href={`/article/read/${personal.about.link}`}>Về tác giả</Link>
                  <a href="https://docs.google.com/document/d/1RmD96OAt-Dn-pqEpEM5YUUhfyvZ3HxQfqTGAXuTDsKA/edit?tab=t.0">Điều khoản sử dụng</a>
                </div>
              </div>
            </div>
          </Footer>
        </Layout>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID!} />
      </body>
    </html>
  );
}