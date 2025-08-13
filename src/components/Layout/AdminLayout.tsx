'use client';

import { Layout, Menu, Button } from 'antd';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { FaNewspaper, FaPlus, FaTrash, FaUser } from 'react-icons/fa';
import '@/styles/admin/layout/AdminLayout.css';

const { Header, Content, Footer, Sider } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('/admin/article');

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  const items = [
    {
      label: 'Bài viết',
      icon: <FaNewspaper />,
      key: 'article',
      children: [
        {
          label: 'Danh sách',
          icon: <FaNewspaper />,
          key: '/admin/article',
          onClick: () => router.push('/admin/article'),
        },
        {
          label: 'Tạo mới',
          icon: <FaPlus />,
          key: '/admin/article/create',
          onClick: () => router.push('/admin/article/create'),
        },
        {
          label: 'Thùng rác',
          icon: <FaTrash />,
          key: '/admin/article/trash',
          onClick: () => router.push('/admin/article/trash'),
        },
      ],
    },
    {
      label: 'Tài khoản',
      icon: <FaUser />,
      key: '/admin/user',
      onClick: () => router.push('/admin/user'),
    },
  ];

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            breakpoint="lg"
            collapsedWidth={80}
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            onBreakpoint={(broken) => setCollapsed(broken)}
            className="admin-sider"
          >
            <div
              className="logo-container"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              {!collapsed && (
                <img
                  src={'/image/general/logo.png'}
                  alt="logo"
                  style={{ width: 55, height: 55, marginLeft: 10 }}
                />
              )}
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 80,
                  height: 65,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                }}
              />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={items}
              inlineCollapsed={collapsed}
            />
          </Sider>
          <Layout>
            <Header className="admin-header" />
            <Content
              style={{
                position: 'relative',
                background: '#fff',
                padding: '24px',
                margin: 0,
                minHeight: 280,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
