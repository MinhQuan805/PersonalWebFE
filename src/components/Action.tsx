'use client';

import { Button, Dropdown, Popconfirm } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { FaInfoCircle, FaTrashRestore } from 'react-icons/fa';

import api from '../config/api';
import { useDispatch } from 'react-redux';
import { displayAlert } from '../redux/action/alert';
import { useRouter } from 'next/navigation';

export type ActionProps<T> = {
  record: T & { _id: string };
  onChangeData: () => void;
  action_url: string;
  recovery: boolean;
};

function Action<T>({ record, onChangeData, action_url, recovery = false }: ActionProps<T>) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeleteSoft = async () => {
    const response = await api.delete(`${action_url}/deleteSoft/${record._id}`);
    dispatch(displayAlert(response.data.message, response.data.success ? 'success' : 'error'));
    onChangeData();
  };

  const handleDeleteHard = async () => {
    const response = await api.delete(`${action_url}/deleteHard/${record._id}`);
    dispatch(displayAlert(response.data.message, response.data.success ? 'success' : 'error'));
    onChangeData();
  };

  const handleRecovery = async () => {
    const response = await api.patch(`${action_url}/recovery/${record._id}`);
    dispatch(displayAlert(response.data.message, response.data.success ? 'success' : 'error'));
    onChangeData();
  };

  const handleUpdate = () => {
    router.push(`${action_url}/update?id=${record._id}`);
  };

  const handleDetail = async () => {
    const response = await api.get(`${action_url}/detail/${record._id}`);
    console.log(response.data);
  };

  const items: MenuProps['items'] = recovery
    ? [
        {
          key: 'deleteHard',
          danger: true,
          label: (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa vĩnh viễn?"
              onConfirm={handleDeleteHard}
              okText="Xóa"
              cancelText="Hủy"
            >
              <span>
                <DeleteOutlined style={{ color: 'red', marginRight: 8 }} />
                Xóa vĩnh viễn
              </span>
            </Popconfirm>
          ),
        },
        {
          key: 'recovery',
          label: (
            <span onClick={handleRecovery}>
              <FaTrashRestore style={{ color: 'green', marginRight: 8 }} />
              Phục hồi
            </span>
          ),
        },
      ]
    : [
        ...(action_url !== '/user'
          ? [
              {
                key: 'detail',
                label: (
                  <span onClick={handleDetail}>
                    <FaInfoCircle style={{ color: 'green', marginRight: 15 }} />
                    Chi tiết
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
              Sửa
            </span>
          ),
        },
        {
          key: 'delete',
          danger: true,
          label: (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={action_url === '/user' ? handleDeleteHard : handleDeleteSoft}
              okText="Xóa"
              cancelText="Hủy"
            >
              <span>
                <DeleteOutlined style={{ color: 'red', marginRight: 8 }} />
                Xóa
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
