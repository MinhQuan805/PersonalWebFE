'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Switch, Upload, InputNumber, notification } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import TextEditor from '@/components/TextEditor';
import api from '@/config/api';
import { useRouter } from 'next/navigation';
import '@/styles/admin/product/product.css';
import useAppNotification from '@/components/useAppNotification';
import { UploadImage } from '@/components/UploadImage';
import { CreateNewData } from '@/components/admin/Create';
import { ProductType } from '@/lib/models/product.model';
import dayjs from 'dayjs';

export default function CreateProduct() {
  const router = useRouter();
  const [fileList, setFileList] = useState<any[]>([]);
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
      const data = sessionStorage.getItem('record');
      if (data) {
        const parsedProduct: ProductType = JSON.parse(data);
        setProduct(parsedProduct);
  
        form.setFieldsValue({
          title: parsedProduct.title,
          position: parsedProduct.position,
          status: parsedProduct.status,
          createdAt: parsedProduct.createdAt ? dayjs(parsedProduct.createdAt) : null,
          introduction: parsedProduct.introduction,
          outstand: parsedProduct.outstand,
          shortDescription: parsedProduct.shortDescription,
          github: parsedProduct.github,
          website: parsedProduct.website,
          video: parsedProduct.video,
          content: parsedProduct.content,
        });

        if (parsedProduct.thumbnail) {
          setThumbnailFileList([
            {
              uid: '-1',
              name: 'thumbnail',
              status: 'done',
              url: parsedProduct.thumbnail,
            } as UploadFile,
          ]);
        }
  
        if (parsedProduct.logo) {
          setLogoFileList([
            {
              uid: '-2',
              name: 'logo',
              status: 'done',
              url: parsedProduct.logo,
            } as UploadFile,
          ]);
        }
  
        setEditorContent(parsedProduct.content || '');
      }
    };
    fetchProduct();
  }, [form]);
    

  // Upload ảnh (thumbnail, logo)
  const { customUpload, onPreview } = UploadImage(action_url);

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
  ];

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    form.setFieldsValue({ content: newContent });
  };
  const handleUpdate = async () => {
    try {
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
      const response = await api.patch(`${action_url}/update/${product?._id}`, data);
      if (response.data.success) {
        sessionStorage.removeItem('articleRecord');
        openNotification('success', 'Thành công', response.data.message);
        router.push(action_url);
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
      <Form
        layout="vertical"
        form={form}
        onFinish={handleUpdate}
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
            Sửa sản phẩm
          </Button>
        </div>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="position"
              label="Vị trí"
              style={{ marginLeft: 100, width: '30%' }}
            >
              <InputNumber placeholder="Nhập vị trí" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="shortDescription"
              label="Mô tả ngắn"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn' }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="introduction"
              label="Giới thiệu"
              rules={[{ required: true, message: 'Vui lòng nhập phần giới thiệu' }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập phần giới thiệu" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="thumbnail" label="Ảnh bìa">
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
              rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
            >
              <Input placeholder="Nhập URL GitHub" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="website"
              label="Website URL"
            >
              <Input placeholder="Nhập URL Website" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item
              name="video"
              label="Video"
            >
              <Input placeholder="Nhập Url Youtube" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="createdAt" label="Ngày tạo">
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="status" label="Trạng thái" style={{width: 300}}>
              <Radio.Group block options={options} defaultValue="ongoing" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Form.Item name="createdAt" label="Ngày tạo">
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="outstand" label="Nổi bật" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={24}>
            <Form.Item name="content" label="Nội dung">
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