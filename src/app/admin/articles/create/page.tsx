'use client';

import React, { useRef, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Switch,
  Upload,
  InputNumber,
  Select,
} from 'antd';
import type { UploadProps } from 'antd/es/upload/interface';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import TextEditor from '@/components/admin/TextEditor';
import { useRouter } from 'next/navigation';
import '@/styles/admin/article/article.css';
import useAppNotification from '@/components/useAppNotification';
import { UploadImage } from '@/components/UploadImage';
import { CreateNewData } from '@/components/admin/Create';
import articles from '@/data/articles.json';

export default function CreateArticle() {
  const router = useRouter();
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState('');

  const action_url = '/admin/articles';
  const { openNotification, contextHolder } = useAppNotification();

  // Handle image upload
  const onChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    if (file.status === 'done' && file.response) {
      file.url = file.response.url;
    }
    setFileList(newFileList);
  };

  const { customUpload, onPreview } = UploadImage(action_url);

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'In Progress', value: 'ongoing' },
  ];

  const handleCreate = async () => {
    const createdAt = form.getFieldValue('createdAt');
    const data = {
      title: form.getFieldValue('title'),
      thumbnail: fileList[0]?.url,
      outstand: form.getFieldValue('outstand'),
      introduction: form.getFieldValue('introduction'),
      content: editorRef.current
        ? editorRef.current.getContent()
        : editorContent,
      position: form.getFieldValue('position'),
      status: form.getFieldValue('status'),
      createdAt: createdAt ? createdAt.toDate() : new Date(),
      tags: form.getFieldValue('tags') || [],
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
        initialValues={{ status: 'ongoing', outstand: false }}
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
            Create Article
          </Button>
        </div>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter the title' }]}
            >
              <Input placeholder="Enter article title" />
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
          <Col span={24}>
            <Form.Item name="introduction" label="Introduction">
              <Input.TextArea rows={4} placeholder="Enter a short introduction" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="thumbnail" label="Thumbnail">
              <Upload
                customRequest={customUpload}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
                style={{ width: '150px', height: '150px' }}
              >
                {fileList.length < 1 && '+ Upload'}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="createdAt" label="Created Date">
              <DatePicker />
            </Form.Item>
            <Form.Item name="outstand" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Radio.Group block options={options} defaultValue="ongoing" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={18}>
            <Form.Item name="tags" label="Tags">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select article tags"
                options={articles.tags}
              />
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
