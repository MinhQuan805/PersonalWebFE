'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Switch, Upload, InputNumber, Select } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import TextEditor from '@/components/admin/TextEditor';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import '@/styles/admin/article/article.css';
import useAppNotification from '@/components/useAppNotification';
import dayjs from 'dayjs';
import { ArticleType } from '@/lib/models/article.model';
import { UploadImage } from '@/components/UploadImage';
import articles from '@/data/articles.json';

export default function UpdateArticle() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const [article, setArticle] = useState<ArticleType | null>(null);
  const action_url = '/admin/articles';
  const { openNotification, contextHolder } = useAppNotification();

  useEffect(() => {
    const fetchArticle = async () => {
      const id = sessionStorage.getItem('id');
      if (id) {
        const parseId = JSON.parse(id);
        const response = await api.get(`${action_url}/detail/${parseId}`);
        const data = response.data;
        setArticle(data);
        setEditorContent(data.content);
        form.setFieldsValue({
          title: data.title,
          position: data.position,
          status: data.status,
          outstand: data.outstand,
          createdAt: data.createdAt ? dayjs(data.createdAt) : null,
          introduction: data.introduction,
          content: data.content,
          tags: data.tags || []
        });

        if (data.thumbnail) {
          setFileList([
            {
              uid: '-1',
              name: 'thumbnail',
              status: 'done',
              url: data.thumbnail,
            } as UploadFile,
          ]);
        }
      }
    };
    fetchArticle();
  }, []);

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

  const handleCancel = () => {
    router.push(action_url);
  };

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    form.setFieldsValue({ content: newContent });
  };

  const updateArticle = async () => {
    try {
      const createdAt = form.getFieldValue('createdAt');
      const data = {
        title: form.getFieldValue('title'),
        thumbnail: fileList[0]?.url,
        outstand: form.getFieldValue('outstand'),
        introduction: form.getFieldValue('introduction'),
        content: editorRef.current ? editorRef.current.getContent() : editorContent,
        position: form.getFieldValue('position'),
        tags: form.getFieldValue('tags') || [],
        status: form.getFieldValue('status'),
        createdAt: createdAt ? createdAt.toDate() : new Date(),
      };

      const response = await api.patch(`${action_url}/update/${article?._id}`, data);
      if (response.data.success) {
        sessionStorage.removeItem('articleRecord');
        openNotification('success', 'Success', response.data.message);
        router.push(action_url);
      } else {
        openNotification('error', 'Error', response.data.message);
      }
    } catch (error: any) {
      openNotification('error', 'Error', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      {contextHolder}
      {article && 
        <Form
          layout="vertical"
          form={form}
          onFinish={updateArticle}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter the title' }]}
              >
                <Input placeholder="Enter the article title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="Position" style={{ marginLeft: 100, width: '30%' }}>
                <InputNumber placeholder="Enter position" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={24}>
              <Form.Item name="introduction" label="Introduction">
                <Input.TextArea rows={4} placeholder="Enter introduction" />
              </Form.Item>
            </Col>
          </Row>

          {/* Upload thumbnail */}
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
              <Form.Item name="createdAt" label="Created At">
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
                <Radio.Group options={options} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={18}>
              <Form.Item
                name="tags"
                label="Tags"
              >
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
                    onContentChange={handleContentChange}
                  />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
    </>
  );
}
