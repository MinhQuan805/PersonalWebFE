'use client';

import { useEffect, useState } from 'react';
import api from '@/config/api';
import { Badge, Button, Form, Popconfirm, Radio, Table, type RadioChangeEvent, type TableProps } from 'antd';
import { FaArrowLeft, FaTrash, FaTrashRestore } from 'react-icons/fa';
import Action from '@/components/admin/Action';
import { useRouter } from 'next/navigation';
import useAppNotification from '@/components/useAppNotification';
import { ProductType } from '@/lib/models/product.model';

type SizeType = TableProps['size'];
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export default function Trash() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>('middle');
  const [rowSelected, setRowSelected] = useState<React.Key[]>([]);
  const { openNotification, contextHolder } = useAppNotification();
  const router = useRouter();

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const resProduct = await api.get(`${process.env.NEXT_PUBLIC_API_ADMIN}/products`, {
        params: { deleted: true },
      });
      setProducts(resProduct.data.data);
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
    onChange: (selectedRowKeys) => {
      setRowSelected(selectedRowKeys);
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
        await api.delete(`${process.env.NEXT_PUBLIC_API_ADMIN}/products/deleteHard/${id}`);
      }
      openNotification('success', 'Thành công', 'Xóa sản phẩm thành công');
      fetchAPI();
      setRowSelected([]);
    } catch (err: any) {
      openNotification('error', 'Lỗi', err.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySelected = async () => {
    if (rowSelected.length === 0) {
      openNotification('error', 'Lỗi', 'Vui lòng chọn ít nhất một sản phẩm để phục hồi');
      return;
    }
    try {
      setLoading(true);
      for (const id of rowSelected) {
        await api.patch(`${process.env.NEXT_PUBLIC_API_ADMIN}/products/recovery/${id}`);
      }
      openNotification('success', 'Thành công', 'Phục hồi sản phẩm thành công');
      fetchAPI();
      setRowSelected([]);
    } catch (err: any) {
      openNotification('error', 'Lỗi', err.response?.data?.message || 'Không thể phục hồi sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: ProductType, b: ProductType) => a.title.localeCompare(b.title),
    },
    {
      title: 'Mô tả ngắn',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      className: 'shortDescription-column',
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
          recovery={true}
        />
      ),
    },
  ];

  const tableProps: TableProps<ProductType> = {
    size,
    columns,
    dataSource: products,
    rowKey: '_id',
    loading,
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        <Button
          onClick={() => router.push('/admin/products')}
          style={{
            borderRadius: 90,
            color: 'black',
            border: '0.5px solid rgb(112, 112, 112)',
            outline: 'none',
            background: 'transparent',
          }}
          icon={<FaArrowLeft />}
        />

        <Form layout="inline" style={{ marginBottom: 0 }}>
          <Form.Item label="Size">
            <Radio.Group value={size} onChange={handleSizeChange}>
              <Radio.Button value="large">Large</Radio.Button>
              <Radio.Button value="middle">Middle</Radio.Button>
              <Radio.Button value="small">Small</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>

        <Popconfirm
          title="Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm đã chọn?"
          onConfirm={handleDeleteSelected}
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
            Xóa
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
          Phục hồi
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
