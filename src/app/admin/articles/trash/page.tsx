'use client';

import { useEffect, useState } from 'react';
import api from '@/config/api';
import type { ArticleType } from '@/lib/models/article.model';
import { Button, Form, Popconfirm, Radio, Table, type RadioChangeEvent, type TableProps } from 'antd';
import { FaArrowLeft, FaTrash, FaTrashRestore } from 'react-icons/fa';
import Action from '@/components/admin/Action';
import { useRouter } from 'next/navigation';
import useAppNotification from '@/components/useAppNotification';

type SizeType = TableProps['size'];
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export default function Trash() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>('middle');
  const [haveSelected, setHaveSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<React.Key[]>([]);
  const { openNotification, contextHolder } = useAppNotification();
  const router = useRouter();

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const resArticle = await api.get(`${process.env.NEXT_PUBLIC_API_ADMIN}/articles`, {
        params: { deleted: true },
      });
      setArticles(resArticle.data.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      openNotification('error', 'Error', 'Failed to load article list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const rowSelection: TableRowSelection<ArticleType> = {
    selectedRowKeys: rowSelected,
    onChange: (selectedRowKeys) => {
      setRowSelected(selectedRowKeys);
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
        await api.delete(`${process.env.NEXT_PUBLIC_API_ADMIN}/articles/deleteHard/${id}`);
      }
      openNotification('success', 'Success', 'Articles deleted permanently.');
      fetchAPI();
      setRowSelected([]);
      setHaveSelected(false);
    } catch (err: any) {
      openNotification(
        'error',
        'Error',
        err.response?.data?.message || 'Unable to delete articles. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySelected = async () => {
    if (rowSelected.length === 0) {
      openNotification('error', 'Error', 'Please select at least one article to restore.');
      return;
    }

    try {
      setLoading(true);
      for (const id of rowSelected) {
        await api.patch(`${process.env.NEXT_PUBLIC_API_ADMIN}/articles/recovery/${id}`);
      }
      openNotification('success', 'Success', 'Articles restored successfully.');
      fetchAPI();
      setRowSelected([]);
      setHaveSelected(false);
    } catch (err: any) {
      openNotification(
        'error',
        'Error',
        err.response?.data?.message || 'Unable to restore articles. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '35%',
      key: 'title',
      sorter: (a: ArticleType, b: ArticleType) => a.title.localeCompare(b.title),
    },
    {
      title: 'Introduction',
      dataIndex: 'introduction',
      key: 'introduction',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: ArticleType) => (
        <Action
          record={record}
          onChangeData={fetchAPI}
          url={'articles'}
          openNotification={openNotification}
          recovery={true}
        />
      ),
    },
  ];

  const tableProps: TableProps<ArticleType> = {
    size,
    columns,
    dataSource: articles,
    rowKey: '_id',
    loading,
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        <Button
          onClick={() => router.push('/admin/articles')}
          style={{
            borderRadius: 90,
            color: 'black',
            border: '0.5px solid rgb(112, 112, 112)',
            outline: 'none',
            background: 'transparent',
          }}
          icon={<FaArrowLeft />}
        ></Button>

        <Form layout="inline" className="table-demo-control-bar" style={{ marginBottom: 0 }}>
          <Form.Item label="Table Size">
            <Radio.Group value={size} onChange={handleSizeChange}>
              <Radio.Button value="large">Large</Radio.Button>
              <Radio.Button value="middle">Medium</Radio.Button>
              <Radio.Button value="small">Small</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>

        <Popconfirm
          title="Are you sure you want to permanently delete the selected articles?"
          onConfirm={() => handleDeleteSelected()}
        >
          <Button
            style={{
              color: 'red',
              marginLeft: 20,
              borderRadius: 40,
              border: '1px solid rgb(255, 0, 0)',
            }}
            size="middle"
            icon={<FaTrash />}
          >
            <span className="btn-text">Delete</span>
          </Button>
        </Popconfirm>

        <Button
          onClick={handleRecoverySelected}
          style={{
            borderRadius: 45,
            color: 'green',
            border: '1px solid #00ff4cff',
          }}
          size="middle"
          icon={<FaTrashRestore />}
        >
          Restore
        </Button>
      </div>

      <Table
        {...tableProps}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          responsive: true,
          size: 'default',
          style: { fontSize: 18, padding: 16 },
        }}
        rowKey="_id"
      />
    </>
  );
}