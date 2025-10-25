'use client';

import React, { useRef, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Switch, Upload, InputNumber } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import TextEditor from '@/components/admin/TextEditor';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import '@/styles/admin/product/product.css';
import useAppNotification from '@/components/useAppNotification';
import { UploadImage } from '@/components/UploadImage';
import { CreateNewData } from '@/components/admin/Create';

export default function CreateProduct() {
  const router = useRouter();
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([]);
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const { openNotification, contextHolder } = useAppNotification();

  const action_url = '/admin/products';

  // Upload images (thumbnail, logo)
  const { customUpload, onPreview } = UploadImage(action_url);

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const handleCreate = async () => {
    const createdAt = form.getFieldValue('createdAt');
    const data = {
      title: form.getFieldValue('title'),
      thumbnail: thumbnailFileList[0]?.url,
      logo: logoFileList[0]?.url,
      position: form.getFieldValue('position'),
      shortDescription: form.getFieldValue('shortDescription'),
      outstand: form.getFieldValue('outstand'),
      introduction: form.getFieldValue('introduction'),
      content: editorRef.current ? editorRef.current.getContent() : editorContent,
      github: form.getFieldValue('github'),
      website: form.getFieldValue('website'),
      video: form.getFieldValue('video'),
      status: form.getFieldValue('status'),
      createdAt: createdAt ? createdAt.toDate() : new Date(),
    };
    const success = await CreateNewData({ action_url, data, openNotification });
    if (success) {
      router.push(action_url);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        onFinish={handleCreate}
        initialValues={{ status: 'active', outstand: false }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginBottom: 20,
          }}
        >
          <Button
            onClick={() => router.push(action_url)}
            style={{
              outline: 'none',
              background: 'transparent',
              border: '1px solid rgb(112, 112, 112)',
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Product
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
              rules={[{ required: true, message: 'Please enter the introduction' }]}
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
              <Input placeholder="Enter Youtube URL" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
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
                onContentChange={setEditorContent}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
