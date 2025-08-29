'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Upload, Select } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import useAppNotification from '@/components/useAppNotification';
import { UploadImage } from '@/components/UploadImage';

const predefinedTags = [
  { label: 'Hệ điều hành', value: 'Hệ điều hành' },
  { label: 'Mạng máy tính', value: 'Mạng máy tính' },
  { label: 'Database', value: 'Database' },
  { label: 'Bảo mật', value: 'Bảo mật' },
  { label: 'OOP', value: 'OOP' },
  { label: 'Cấu trúc dữ liệu', value: 'Cấu trúc dữ liệu' },
  { label: 'Giải thuật', value: 'Giải thuật' },
];

export default function Dashboard() {
  const router = useRouter();
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [storyContent, setStoryContent] = useState('');
  const { openNotification, contextHolder } = useAppNotification();

  const action_url = '/admin/dashboards';

  const { customUpload, onPreview } = UploadImage(action_url);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`${action_url}`);
        const data = response.data.data;
        form.setFieldsValue({
          // intro
          greeting: data.intro.greeting,
          name: data.intro.name,
          highlight: data.intro.highlight,
          description: data.intro.description.join('\n'),
          resumeFile: data.intro.resumeFile,
          headline: data.about.headline,
          story: data.about.story.join('\n'),
          birthday: data.about.info.birthday,
          age: data.about.info.age,
          address: data.about.info.address,
          phone: data.about.info.phone,
          email: data.about.info.email,
          linkedin: data.about.socials.linkedin,
          github: data.about.socials.github,
          facebook: data.about.socials.facebook,
          tags: data.about.tags || [],
        });

        if (data.intro.avatar) {
          setAvatarFileList([
            { uid: '-1', name: 'avatar', status: 'done', url: data.intro.avatar },
          ]);
        }
        if (data.about.logo) {
          setLogoFileList([
            { uid: '-2', name: 'logo', status: 'done', url: data.about.logo },
          ]);
        }

        setStoryContent(data.about.story.join('\n'));
      } catch (error) {
        openNotification('error', 'Lỗi', 'Không thể tải thông tin hồ sơ');
      }
    };
    fetchProfile();
  }, [form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        intro: {
          greeting: values.greeting,
          name: values.name,
          highlight: values.highlight,
          description: values.description.split('\n'),
          resumeFile: values.resumeFile,
          avatar: avatarFileList[0]?.url,
        },
        about: {
          name: values.name,
          headline: values.headline,
          story: values.story.split('\n'),
          logo: logoFileList[0]?.url,
          info: {
            birthday: values.birthday,
            age: values.age,
            address: values.address,
            phone: values.phone,
            email: values.email,
          },
          socials: {
            linkedin: values.linkedin,
            github: values.github,
            facebook: values.facebook,
          },
          tags: values.tags || [],
        },
      };

      const response = await api.patch(`${action_url}/update`, data);
      if (response.data.success) {
        openNotification('success', 'Thành công', response.data.message);
      } else {
        openNotification('error', 'Lỗi', response.data.message);
      }
    } catch (error: any) {
      openNotification('error', 'Lỗi', error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <>
      {contextHolder}
      <Form layout="vertical" form={form} onFinish={handleUpdate}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
          <Button onClick={() => router.push(action_url)}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </div>

        {/* Intro */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="greeting" label="Lời chào">
              <Input placeholder="Ví dụ: Welcome bạn" />
            </Form.Item>
            <Form.Item name="name" label="Tên">
              <Input />
            </Form.Item>
            <Form.Item name="highlight" label="Highlight">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả (mỗi dòng 1 câu)">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="resumeFile" label="File CV (đường dẫn)">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="avatar" label="Avatar">
              <Upload
                customRequest={customUpload}
                listType="picture-card"
                fileList={avatarFileList}
                onChange={({ file, fileList: newFileList }) => {
                  if (file.status === 'done' && file.response) {
                    file.url = file.response.url;
                  }
                  setAvatarFileList(newFileList);
                }}
                onPreview={onPreview}
                maxCount={1}
              >
                {avatarFileList.length < 1 && '+ Upload Avatar'}
              </Upload>
            </Form.Item>
            <Form.Item name="logo" label="Logo">
              <Upload
                customRequest={customUpload}
                listType="picture-card"
                fileList={logoFileList}
                onChange={({ file, fileList: newFileList }) => {
                  if (file.status === 'done' && file.response) {
                    file.url = file.response.url;
                  }
                  setLogoFileList(newFileList);
                }}
                onPreview={onPreview}
                maxCount

={1}
              >
                {logoFileList.length < 1 && '+ Upload Logo'}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* About */}
        <Form.Item name="headline" label="Headline">
          <Input />
        </Form.Item>
        <Form.Item name="story" label="Câu chuyện (mỗi dòng 1 đoạn)">
          <Input.TextArea rows={6} value={storyContent} onChange={(e) => setStoryContent(e.target.value)} />
        </Form.Item>

        {/* Tags */}
        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            placeholder="Chọn hoặc thêm tags"
            options={predefinedTags}
            allowClear
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="birthday" label="Ngày sinh">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="age" label="Tuổi">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="SĐT">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Socials */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="linkedin" label="LinkedIn">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="github" label="GitHub">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="facebook" label="Facebook">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}