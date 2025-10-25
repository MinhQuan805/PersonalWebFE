'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Switch, Upload, InputNumber } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import TextEditor from '@/components/admin/TextEditor';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import '@/styles/admin/product/product.css';
import useAppNotification from '@/components/useAppNotification';
import { UploadImage } from '@/components/UploadImage';
import { ProductType } from '@/lib/models/product.model';
import dayjs from 'dayjs';

export default function UpdateProduct() {
  const router = useRouter();
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([]);
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const { openNotification, contextHolder } = useAppNotification();

  const action_url = '/admin/products';
  useEffect(() => {
    const fetchProduct = async () => {
      const id = sessionStorage.getItem('id');
      if (id) {
        const parseId = JSON.parse(id);
        const response = await api.get(`${action_url}/detail/${parseId}`);
        const data = response.data;
  
        form.setFieldsValue({
          title: data.title,
          position: data.position,
          status: data.status,
          createdAt: data.createdAt ? dayjs(data.createdAt) : null,
          introduction: data.introduction,
          outstand: data.outstand,
          shortDescription: data.shortDescription,
          github: data.github,
          website: data.website,
          video: data.video,
          content: data.content,
        });

        if (data.thumbnail) {
          setThumbnailFileList([{
            uid: '-1',
            name: 'thumbnail',
            status: 'done',
            url: data.thumbnail,
          } as UploadFile]);
        }
  
        if (data.logo) {
          setLogoFileList([{
            uid: '-2',
            name: 'logo',
            status: 'done',
            url: data.logo,
          } as UploadFile]);
        }
  
        setEditorContent(data.content || '');
      }
    };
    fetchProduct();
  }, [form]);
    
  // Upload images (thumbnail, logo)
  const { customUpload, onPreview } = UploadImage(action_url);

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    form.setFieldsValue({ content: newContent });
  };

  const handleUpdate = async () => {
    try {
      const id = sessionStorage.getItem('id');
      if (id) {
        const parseId = JSON.parse(id);
        const createdAt = form.getFieldValue('createdAt');
        const data = {
          title: form.getFieldValue('title'),
          thumbnail: thumbnailFileList[0]?.url || product?.thumbnail,
          logo: logoFileList[0]?.url || product?.logo,
          position: form.getFieldValue('position'),
          shortDescription: form.getFieldValue('shortDescription'),
          introduction: form.getFieldValue('introduction'),
          outstand: form.getFieldValue('outstand'),
          content: editorRef.current ? editorRef.current.getContent() : editorContent,
          github: form.getFieldValue('github'),
          website: form.getFieldValue('website'),
          video: form.getFieldValue('video'),
          status: form.getFieldValue('status'),
          createdAt: createdAt ? createdAt.toDate() : new Date(),
        };
        const response = await api.patch(`${action_url}/update/${parseId}`, data);
        if (response.data.success) {
          sessionStorage.removeItem('articleRecord');
          openNotification('success', 'Success', response.data.message);
          router.push(action_url);
        } else {
          openNotification('error', 'Error', response.data.message);
        }
      }
    } catch (error: any) {
      openNotification('error', 'Error', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      {contextHolder}
      <Form layout="vertical" form={form} onFinish={handleUpdate}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
          <Button
            onClick={() => router.push(action_url)}
            style={{ outline: 'none', background: 'transparent', border: '1px solid rgb(112, 112, 112)' }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Update Product
          </Button>
        </div>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Product Name"
              rules={[{ required: true, message: 'Please enter the product name' }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="position"
              label="Position"
              style={{ marginLeft: 100, width: '30%' }}
            >
              <InputNumber placeholder="Enter position" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="shortDescription"
              label="Short Description"
              rules={[{ required: true, message: 'Please enter a short description' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter short description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="introduction"
              label="Introduction"
              rules={[{ required: true, message: 'Please enter an introduction' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter introduction" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="thumbnail" label="Thumbnail">
              <Upload
                name="thumbnail"
                customRequest={customUpload}
                listType="picture-card"
                fileList={thumbnailFileList}
                onChange={({ file, fileList: newFileList }) => {
                  if (file.status === 'done' && file.response) {
                    file.url = file.response.url;
                  }
                  setThumbnailFileList(newFileList);
                }}
                onPreview={onPreview}
                maxCount={1}
                style={{ width: '100px', height: '100px' }}
              >
                {thumbnailFileList.length < 1 && '+ Upload Thumbnail'}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="logo" label="Logo">
              <Upload
                name="logo"
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
                maxCount={1}
                style={{ width: '100px', height: '100px' }}
              >
                {logoFileList.length < 1 && '+ Upload Logo'}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="github"
              label="GitHub URL"
              rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <Input placeholder="Enter GitHub URL" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="website" label="Website URL">
              <Input placeholder="Enter Website URL" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="video" label="Video">
              <Input placeholder="Enter YouTube URL" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status" style={{ width: 300 }}>
              <Radio.Group block options={options} defaultValue="active" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="createdAt" label="Created Date">
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="outstand" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={24}>
            <Form.Item name="content" label="Content">
              <TextEditor
                editorRef={editorRef}
                value={editorContent}
                onContentChange={handleContentChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
