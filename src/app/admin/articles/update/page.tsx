'use client';

import { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { Table, Form, Radio, Badge, Button, Popconfirm, Input } from 'antd';
import type { TableProps, RadioChangeEvent } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { SortOrder } from 'antd/es/table/interface';
import type { ArticleType } from '@/lib/models/article.model';
import useAppNotification from '@/components/useAppNotification';
import Action from '@/components/admin/Action';
import { PlusOutlined } from '@ant-design/icons';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import '@/styles/admin/article/article.css';
import api from '@/config/api';

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
      openNotification('error', 'Error', 'Failed to load the article list. Please try again later.');
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
      openNotification('error', 'Error', 'Please select at least one article to delete.');
      return;
    }
    try {
      setLoading(true);
      for (const id of rowSelected) {
        await api.delete(`${process.env.NEXT_PUBLIC_API_ADMIN}/articles/deleteSoft/${id}`);
      }
      openNotification('success', 'Success', 'Selected articles deleted successfully.');
      fetchAPI();
      setRowSelected([]);
      setHaveSelected(false);
    } catch (err: any) {
      openNotification('error', 'Error', err.response?.data?.message || 'Unable to delete articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: ArticleType, b: ArticleType) => a.title.localeCompare(b.title),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      sorter: (a: ArticleType, b: ArticleType) => a.position - b.position,
      sortDirections: ['descend'] as SortOrder[],
    },
    {
      title: 'Introduction',
      dataIndex: 'introduction',
      key: 'introduction',
      className: 'introduction-column',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'In Progress', value: 'ongoing' },
      ],
      filterSearch: true,
      onFilter: (value: any, record: ArticleType) => record.status === value,
      render: (_: any, record: ArticleType) => {
        let color = 'gray';
        let text = 'Unknown';
        if (record.status === 'active') {
          color = 'green';
          text = 'Active';
        } else if (record.status === 'inactive') {
          color = 'red';
          text = 'Inactive';
        } else {
          color = 'blue';
          text = 'In Progress';
        }
        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'Actions',
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

  const handleSearch = (value: string) => {
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
              <Radio.Button value="middle">Medium</Radio.Button>
              <Radio.Button value="small">Small</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>

        <div className="btn-action-container">
          <Input.Search
            placeholder="Search articles..."
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
            <span className="btn-text">Create New</span>
          </Button>

          <Button
            style={{ color: 'black', marginLeft: 20, borderRadius: 40, border: '1px solid black' }}
            size="middle"
            icon={<FaTrash />}
            onClick={() => router.push('/admin/articles/trash')}
          >
            <span className="btn-text">Trash</span>
          </Button>
        </div>

        {haveSelected && (
          <Popconfirm
            title="Are you sure you want to delete the selected articles?"
            onConfirm={handleDeleteSelected}
          >
            <Button
              style={{ color: 'red', borderRadius: 40, border: '1px solid rgb(255, 0, 0)' }}
              size="middle"
              icon={<FaTrash />}
            >
              <span className="btn-text">Delete</span>
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
