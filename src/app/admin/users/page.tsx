'use client';

import { useEffect, useState } from 'react';
import type { UserType } from '@/lib/models/user.model';
import { Table, Form, Radio, Badge, Button, Popconfirm, Input, Modal } from 'antd';
import type { TableProps, RadioChangeEvent } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { PlusOutlined } from '@ant-design/icons';
import { FaTrash } from 'react-icons/fa';
import type { RadioGroupProps } from 'antd';
import Action from '@/components/admin/Action';
import api from '@/config/api';
import '@/styles/admin/user/user.css';
import useAppNotification from '@/components/useAppNotification'

type SizeType = TableProps['size'];

export default function User() {
  const [user, setUser] = useState<UserType[]>([]);
  const [originalUser, setOriginalUser] = useState<UserType[]>([]);
  const [size, setSize] = useState<SizeType>('large');
  const [loading, setLoading] = useState(false);
  const [haveSelected, setHaveSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<React.Key[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState('');
  const { openNotification, contextHolder } = useAppNotification();
  const [form] = Form.useForm();

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users`);
      const userData = res.data.data;
      if (userData) {
        setUser(userData);
        setOriginalUser(userData);
      }
    } catch (err) {
      openNotification('error', 'Lỗi', 'Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const rowSelection: TableRowSelection<UserType> = {
    selectedRowKeys: rowSelected,
    onChange: (selectedRowKeys: React.Key[]) => {
      setRowSelected(selectedRowKeys);
      setHaveSelected(selectedRowKeys.length > 0);
    },
  };

  const handleDeleteSelected = async () => {
    if (rowSelected.length === 0) {
      openNotification('error', 'Lỗi', 'Vui lòng chọn ít nhất một người dùng để xóa');
      return;
    }
    try {
      setLoading(true);
      for (const id of rowSelected) {
        const res = await api.delete(`/users/deleteHard/${id}`);
      }
      openNotification('success', 'Thành công', 'Xóa người dùng thành công');
      fetchAPI();
      setRowSelected([]);
      setHaveSelected(false);
    } catch (err: any) {
      openNotification('error', 'Lỗi', err.response?.data?.message || 'Không thể xóa người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: UserType, b: UserType) => a.title.localeCompare(b.title),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      filterSearch: true,
      onFilter: (value: any, record: UserType) => record.status === value,
      render: (_: any, record: UserType) => {
        let color = 'gray';
        let text = 'Không xác định';
        if (record.role === 'admin') {
          color = 'blue';
          text = 'Admin';
        } else if (record.role === 'client') {
          color = 'green';
          text = 'Client';
        }
        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      filterSearch: true,
      onFilter: (value: any, record: UserType) => record.status === value,
      render: (_: any, record: UserType) => {
        let color = 'gray';
        let text = 'Không xác định';
        if (record.status === 'active') {
          color = 'green';
          text = 'Hoạt động';
        } else if (record.status === 'inactive') {
          color = 'red';
          text = 'Không hoạt động';
        }
        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '10%',
      render: (_: any, record: UserType) => {
        return <Action record={record} onChangeData={fetchAPI} url={`users`} openNotification={openNotification} recovery={false} />;
      },
    },
  ];

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (data: any) => {
    try {
      const response = await api.post(`/users/register`, data);
      openNotification('success', 'Thành công', response.data.message);
      setOpen(false);
      form.resetFields();
      fetchAPI();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại';
      openNotification('error', 'Lỗi', errorMessage);
    }
  };

  useEffect(() => {
    let result = [...originalUser];
    if (keyword) {
      const keywordExp = new RegExp(keyword, 'i');
      result = result.filter(user => keywordExp.test(user.email ?? ''));
    }
    setUser(result);
  }, [keyword]);

  const handleSearch = async (value: string) => {
    setKeyword(value);
  };


  const isAction: RadioGroupProps['options'] = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
  ];
  const isUser: RadioGroupProps['options'] = [
    { label: 'Người dùng', value: 'client' },
    { label: 'Quản trị', value: 'admin' },
  ];

  return (
    <>
      {contextHolder}
      <div className="btn-controller">
        <Form layout="inline" className="table-demo-control-bar" style={{ marginBottom: 0 }}>
          <Form.Item label="Size">
            <Radio.Group value={size} onChange={handleSizeChange}>
              <Radio.Button value="large">Large</Radio.Button>
              <Radio.Button value="middle">Middle</Radio.Button>
              <Radio.Button value="small">Small</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
        <div className="btn-action-container">
          <Input.Search
            placeholder="Tìm kiếm"
            variant="underlined"
            style={{ width: 200 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            style={{ color: '#006effff', marginLeft: 20, borderRadius: 45, border: '1px solid #006effff' }}
            size="middle"
            icon={<PlusOutlined />}
            onClick={showLoading}
          >
            <span className="btn-text">Tạo người dùng mới</span>
          </Button>
        </div>
        {haveSelected && (
          <Popconfirm title="Bạn có chắc chắn muốn xóa người dùng đã chọn?" onConfirm={handleDeleteSelected}>
            <Button
              style={{ color: 'red', marginLeft: 20, borderRadius: 40, border: '1px solid rgb(255, 0, 0)' }}
              size="middle"
              icon={<FaTrash />}
            >
              <span className="btn-text">Xóa</span>
            </Button>
          </Popconfirm>
        )}
      </div>
      <Modal
        title={<p>Tạo người dùng</p>}
        footer={
          <>
            <Button type="primary" onClick={showLoading}>
              Tải lại
            </Button>
            <Button type="primary" htmlType="submit" form="userForm">
              Tạo tài khoản
            </Button>
          </>
        }
        open={open}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          id="userForm"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: 'client',
            status: 'active',
          }}
        >
          <Form.Item label="Tên" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập password" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Radio.Group block options={isAction} defaultValue="active" />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Radio.Group block options={isUser} defaultValue="client" />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        size={size}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          responsive: true,
          size: 'default',
          style: { fontSize: 18, padding: 16 },
        }}
        dataSource={user}
        columns={columns}
        rowKey="_id"
      />
    </>
  );
}