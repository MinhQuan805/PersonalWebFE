// app/layout.tsx
'use client';

import { Button, Drawer, Layout, Menu } from 'antd';
import './globals.css';
import '@/styles/client/layout/ClientLayout.css'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ContactCard from '@/components/ContactCard';
import { RiMenu2Fill } from 'react-icons/ri';

const { Header, Footer, Content } = Layout;
const nav = [
  {
    name: 'Trang chủ',
    link: '/'
  },
  {
    name: 'Bài viết',
    link: '/article'
  },
  {
    name: 'Sản phẩm',
    link: '/product',
  },
  {
    name: 'About me',
    link: '/about'
  }
]
const navItems = nav.map((item) => ({
  key: item.link,
  label: <a href={item.link}>{item.name}</a>,
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState('/');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const move = () => {
    router.push('/')
  }

  useEffect(() => {
      setSelectedKey(pathname);
  }, [pathname]);
  return (
    <html lang="en">
      <body>
        <Layout className="layout-main">
          <Header className="header-main">
            <div onClick={move} style={{ cursor: 'pointer' }}>
              <img src={'/image/general/logo.png'} alt="logo" style={{ height: 35 }} />
            </div>
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
              <a href="https://www.linkedin.com/in/qu%C3%A2n-v%C3%B5-821704325/" target="_blank" rel="noopener noreferrer"><img src="/image/logo/linkedin.png" alt="linkedin" /></a>
              <a href="https://github.com/MinhQuan805" target="_blank" rel="noopener noreferrer"><img src="/image/logo/github.png" alt="GitHub" /></a>
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
                  <p>Coyright &copy; {new Date().getFullYear()} Võ Minh Quân</p>
                  <p>Powered by React & Antd</p>
                </div>
              </div>
              <div className='footer-right'>
                <div className="footer-column-left">
                  <a onClick={() => { router.push('/') }}>Trang chủ</a>
                  <a onClick={() => { router.push('/article') }}>Bài viết</a>
                  <a onClick={() => { router.push('/product') }}>Sản phẩm</a>
                  <a onClick={() => { router.push('/donate') }}>Ủng hộ</a>
                </div>
                <div className="footer-column-right">
                  <a onClick={() => { router.push('/about') }}>Về tác giả</a>
                  <a href="https://docs.google.com/document/d/1RmD96OAt-Dn-pqEpEM5YUUhfyvZ3HxQfqTGAXuTDsKA/edit?tab=t.0">Điều khoản sử dụng</a>
                </div>
              </div>
            </div>
          </Footer>
        </Layout>
      </body>
    </html>
  );
}
