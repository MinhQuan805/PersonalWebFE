'use client';

import { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { Table, Form, Radio, Badge, Button, Popconfirm, Input, notification } from 'antd';
import type { TableProps, RadioChangeEvent } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { SortOrder } from 'antd/es/table/interface';
import type { ProductType } from '@/lib/models/product.model';
import useAppNotification from '@/components/useAppNotification';
import Action from '@/components/admin/Action';
import { useRouter } from 'next/navigation';
import { PlusOutlined } from '@ant-design/icons';
import { FaTrash } from 'react-icons/fa';
import '@/styles/admin/product/product.css';
import api from '@/config/api';
import { RxUpdate } from 'react-icons/rx';
import axios from 'axios';

type SizeType = TableProps['size'];

export default function Products() {
  const [originalProducts, setOriginalProducts] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
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
      const resProducts = await api.get(`${process.env.NEXT_PUBLIC_API_ADMIN}/products`);
      const productData = resProducts.data.data;
      if (productData) {
        setProducts(productData);
        setOriginalProducts(productData);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      openNotification('error', 'Lỗi', 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const rowSelection: TableRowSelection<ProductType> = {
    selectedRowKeys: rowSelected,
    onChange: (selectedRowKeys: React.Key[]) => {
      setRowSelected(selectedRowKeys);
      setHaveSelected(selectedRowKeys.length > 0);
    },
  };

  const handleDeleteSelected = async () => {
    if (rowSelected.length === 0) {
      openNotification('error', 'Lỗi', 'Vui lòng chọn ít nhất một sản phẩm để xóa');
      return;
    }
    try {
      setLoading(true);
      for (const id of rowSelected) {
        await api.delete(`${process.env.NEXT_PUBLIC_API_ADMIN}/products/deleteSoft/${id}`);
      }
      openNotification('success', 'Thành công', 'Xóa sản phẩm thành công');
      fetchAPI();
      setRowSelected([]);
      setHaveSelected(false);
    } catch (err: any) {
      openNotification('error', 'Lỗi', err.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: ProductType, b: ProductType) => a.title.localeCompare(b.title),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      sorter: (a: ProductType, b: ProductType) => a.position - b.position,
      sortDirections: ['descend'] as SortOrder[],
    },
    {
      title: 'Mô tả ngắn',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      className: 'shortDescription-column',
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
      onFilter: (value: any, record: ProductType) => record.status === value,
      render: (_: any, record: ProductType) => {
        let color = 'gray';
        let text = 'Không xác định';
        if (record.status === 'active') {
          color = 'green';
          text = 'Hoạt động';
        } else if (record.status === 'inactive') {
          color = 'red';
          text = 'Không hoạt động';
        } else if (record.status === 'ongoing') {
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
      render: (_: any, record: ProductType) => (
        <Action
          record={record}
          onChangeData={fetchAPI}
          url="products"
          openNotification={openNotification}
          recovery={false}
        />
      ),
    },
  ];

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  useEffect(() => {
    let result = [...originalProducts];
    if (keyword) {
      const keywordExp = new RegExp(keyword, 'i');
      result = result.filter(product => keywordExp.test(product.title ?? ''));
    }
    setProducts(result);
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
            onClick={() => router.push('/admin/products/create')}
          >
            <span className="btn-text">Tạo mới</span>
          </Button>

          <Button
            style={{ color: 'black', marginLeft: 20, borderRadius: 40, border: '1px solid black' }}
            size="middle"
            icon={<FaTrash />}
            onClick={() => router.push('/admin/products/trash')}
          >
            <span className="btn-text">Thùng rác</span>
          </Button>
        </div>

        {haveSelected && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm đã chọn?"
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
        dataSource={products}
        columns={columns}
        rowKey="_id"
      />
    </>
  );
}