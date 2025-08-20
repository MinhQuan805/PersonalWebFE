'use client';

import { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { Table, Form, Radio, Badge, Button, Popconfirm, Input, notification } from 'antd';
import type { TableProps, RadioChangeEvent } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { SortOrder } from 'antd/es/table/interface';
import type { ArticleType } from '@/lib/models/article.model';
import useAppNotification from '@/components/useAppNotification'
import Action from '@/components/admin/Action';
import { PlusOutlined } from '@ant-design/icons';
import { FaTrash } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import '@/styles/admin/article/article.css';
import api from '@/config/api';
import axios from 'axios';
import { RxUpdate } from 'react-icons/rx';
type SizeType = TableProps['size'];

export default function Article() {
  const [originalArticles, setOriginalArticles] = useState<ArticleType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [size, setSize] = useState<SizeType>('large');
  const [loading, setLoading] = useState(false);
  const [haveSelected, setHaveSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<React.Key[]>([]);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const { openNotification, contextHolder } = useAppNotification();

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const resArticle = await api.get(`${process.env.NEXT_PUBLIC_API_ADMIN}/articles`);
      const articleData = resArticle.data.data;
      if (articleData) {
        setArticles(articleData);
        setOriginalArticles(articleData);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      openNotification('error', 'Lỗi', 'Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const rowSelection: TableRowSelection<ArticleType> = {
    selectedRowKeys: rowSelected,
    onChange: (selectedRowKeys: React.Key[]) => {
      setRowSelected(selectedRowKeys);
      setHaveSelected(selectedRowKeys.length > 0);
    },
  };

  const handleDeleteSelected = async () => {
    if (rowSelected.length === 0) {
      openNotification('error', 'Lỗi', 'Vui lòng chọn ít nhất một bài viết để xóa');
      return;
    }
    try {
      setLoading(true);
      for (const id of rowSelected) {
        await api.delete(`${process.env.NEXT_PUBLIC_API_ADMIN}/articles/deleteSoft/${id}`);
      }
      openNotification('success', 'Thành công', 'Xóa bài viết thành công');
      fetchAPI();
      setRowSelected([]);
      setHaveSelected(false);
    } catch (err: any) {
      openNotification('error', 'Lỗi', err.response?.data?.message || 'Không thể xóa bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: ArticleType, b: ArticleType) => a.title.localeCompare(b.title),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      sorter: (a: ArticleType, b: ArticleType) => a.position - b.position,
      sortDirections: ['descend'] as SortOrder[],
    },
    {
      title: 'Giới thiệu',
      dataIndex: 'introduction',
      key: 'introduction',
      className: 'introduction-column',
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
        { text: 'Đang hoàn thành', value: 'ongoing' },
      ],
      filterSearch: true,
      onFilter: (value: any, record: ArticleType) => record.status === value,
      render: (_: any, record: ArticleType) => {
        let color = 'gray';
        let text = 'Không xác định';
        if (record.status === 'active') {
          color = 'green';
          text = 'Hoạt động';
        } else if (record.status === 'inactive') {
          color = 'red';
          text = 'Không hoạt động';
        } else {
          color = 'blue';
          text = 'Đang hoàn thành';
        }
        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'Hành động',
      key: 'actions', 
      width: '10%',
      render: (_: any, record: ArticleType) => (
        <Action record={record} onChangeData={fetchAPI} url={`articles`} openNotification={openNotification} recovery={false} />
      ),
    },
  ];

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  useEffect(() => {
    let result = [...originalArticles];
    if (keyword) {
      const keywordExp = new RegExp(keyword, 'i');
      result = result.filter(article => keywordExp.test(article.title ?? ''));
    }
    setArticles(result);
  }, [keyword]);

  const handleSearch = async (value: string) => {
    setKeyword(value);
  };

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
            onClick={() => router.push('/admin/articles/create')}
          >
            <span className="btn-text">Tạo mới</span>
          </Button>

          <Button
            style={{ color: 'black', marginLeft: 20, borderRadius: 40, border: '1px solid black' }}
            size="middle"
            icon={<FaTrash />}
            onClick={() => router.push('/admin/articles/trash')}
          >
            <span className="btn-text">Thùng rác</span>
          </Button>
          <Button
            style={{ color: 'green', border: '1px solid #00ff4cff', marginLeft: 20, borderRadius: 40, }}
            size="middle"
            icon={<RxUpdate />}
            onClick={async () => {
              try {
                await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/articles/refresh`);
                openNotification('success', 'Thành công', 'Đã cập nhật dữ liệu phía client');
              } catch (err) {
                console.error(err);
                openNotification('error', 'Lỗi', 'Không thể cập nhật dữ liệu phía client');
              }
            }}
          >
            <span className="btn-text">Cập nhật phía client</span>
          </Button>
        </div>

        {haveSelected && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết đã chọn?"
            onConfirm={handleDeleteSelected}
          >
            <Button
              style={{ color: 'red', borderRadius: 40, border: '1px solid rgb(255, 0, 0)' }}
              size="middle"
              icon={<FaTrash />}
            >
              <span className="btn-text">Xóa</span>
            </Button>
          </Popconfirm>
        )}
      </div>

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
        dataSource={articles}
        columns={columns}
        rowKey="_id"
      />
    </>
  );
}