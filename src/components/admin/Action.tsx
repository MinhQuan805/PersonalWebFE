'use client';

import { Button, Dropdown, Popconfirm } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { FaInfoCircle, FaTrashRestore } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import axios from 'axios';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type ActionProps = {
  record?: any;
  onChangeData: () => void;
  url: string;
  recovery: boolean;
  openNotification: (type: NotificationType, title: string, message: string) => void;
};

function Action({ record, onChangeData, url, openNotification, recovery = false }: ActionProps) {
  const router = useRouter();
  const action_url = `${process.env.NEXT_PUBLIC_API_ADMIN}/${url}`;

  const handleDeleteSoft = async () => {
    const res = await api.delete(`${action_url}/deleteSoft/${record._id}`);
    if (res.data.success) {
      openNotification('success', 'Success', res.data.message);
    } else {
      openNotification('error', 'Error', res.data.message);
    }
    onChangeData();
  };

  const handleDeleteHard = async () => {
    const res = await api.delete(`${url === 'users' ? url : action_url}/deleteHard/${record._id}`);
    if (res.data.success) {
      openNotification('success', 'Success', res.data.message);
    } else {
      openNotification('error', 'Error', res.data.message);
    }
    onChangeData();
  };

  const handleRecovery = async () => {
    const res = await api.patch(`${action_url}/recovery/${record._id}`);
    if (res.data.success) {
      openNotification('success', 'Success', res.data.message);
    } else {
      openNotification('error', 'Error', res.data.message);
    }
    onChangeData();
  };

  const handleUpdate = () => {
    sessionStorage.setItem('id', JSON.stringify(record._id));
    router.push(`/admin/${url}/update`);
  };

  const handleDetail = async () => {
    const response = await axios.get(`${action_url}/detail/${record._id}`);
    console.log(response.data);
  };

  const items: MenuProps['items'] = recovery
    ? [
        {
          key: 'deleteHard',
          danger: true,
          label: (
            <Popconfirm
              title="Are you sure you want to permanently delete?"
              onConfirm={handleDeleteHard}
              okText="Delete"
              cancelText="Cancel"
            >
              <span>
                <DeleteOutlined style={{ color: 'red', marginRight: 8 }} />
                Delete Permanently
              </span>
            </Popconfirm>
          ),
        },
        {
          key: 'recovery',
          label: (
            <span onClick={handleRecovery}>
              <FaTrashRestore style={{ color: 'green', marginRight: 8 }} />
              Restore
            </span>
          ),
        },
      ]
    : [
        ...(url !== 'users'
          ? [
              {
                key: 'detail',
                label: (
                  <span onClick={handleDetail}>
                    <FaInfoCircle style={{ color: 'green', marginRight: 15 }} />
                    Details
                  </span>
                ),
              },
            ]
          : []),
        {
          key: 'update',
          label: (
            <span onClick={handleUpdate}>
              <EditOutlined style={{ color: 'orange', marginRight: 8 }} />
              Edit
            </span>
          ),
        },
        {
          key: 'delete',
          danger: true,
          label: (
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={url === `users` ? handleDeleteHard : handleDeleteSoft}
              okText="Delete"
              cancelText="Cancel"
            >
              <span>
                <DeleteOutlined style={{ color: 'red', marginRight: 8 }} />
                Delete
              </span>
            </Popconfirm>
          ),
        },
      ];

  return (
    <Dropdown trigger={['click']} menu={{ items }}>
      <Button
        type="text"
        icon={<MoreOutlined style={{ fontSize: '20px' }} />}
        style={{
          border: 'none',
          boxShadow: 'none',
          color: 'black',
          outline: 'none',
          padding: 0,
          background: 'transparent',
        }}
      />
    </Dropdown>
  );
}

export default Action;
