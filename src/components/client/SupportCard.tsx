'use client';

import { Card, Typography, Button, Modal, Form, Input, Upload } from 'antd';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
const { Text } = Typography;

const mes = [
  <Text key="mes1" style={{ fontSize: 16 }}>
    Do you like this <Text style={{ fontSize: 16, color: '#0099ffff' }}>article</Text>?<br />Do you want to make it even better?
  </Text>,
  <Text key="mes2" style={{ fontSize: 16 }}>
    Do you want to give yourself more <Text style={{ fontSize: 16, color: '#0099ffff' }}>motivation</Text> <br />to keep producing high-quality content?
  </Text>,
];

type Props = {
  mesNum: number;
};

export default function SupportCard({ mesNum }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const handleCancel = () => {
    setOpen(false);
  };
  // const [form] = Form.useForm();

  // const onChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
  //   if (file.status === 'done' && file.response) {
  //     file.url = file.response.url;
  //   }
  //   setFileList(newFileList);
  // };
  // const onPreview = async (file: UploadFile) => {
  //   let src = file.url!;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj as File);
  //       reader.onload = () => resolve(reader.result as string);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow?.document.write(image.outerHTML);
  // };

  // const customUpload = async ({ file, onSuccess, onError }: any) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   try {
  //     const response = await api.post(`/admin/articles/upload`, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     onSuccess(response.data, file);
  //   } catch (err) {
  //     onError(err);
  //   }
  // };
  return (
    <Card
      style={{
        maxWidth: 360,
        margin: '50px auto',
        textAlign: 'center',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {mes[mesNum] || mes[0]}
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            size="large"
            icon={<FaStar />}
            style={{ borderRadius: 4, width: '100%' }}
            onClick={() => setOpen(true)}
          >
            Support
          </Button>
        </div>
        <Modal
          title={<p>Support</p>}
          footer={null}
          open={open}
          onCancel={handleCancel}
        >
          <img
            src="/image/general/donate.jpg"
            alt="QR code"
            style={{ width: '100%', maxWidth: 250, margin: '0 auto', display: 'block' }}
          />
          <Typography.Title level={4} style={{ marginTop: 20, textAlign: 'center' }}>
            💖 Thank you for your support!
          </Typography.Title>
          {/* <Form
            form={form}
            id="userForm"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Your Name"
              name="title"
              rules={[{ required: true, message: 'Please enter your name!' }]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item label="Message" name="message">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="thumbnail" label="Screenshot">
              <Upload
                customRequest={customUpload}
                listType="picture"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
              >
                <Button type="primary" icon={<UploadOutlined />}>
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          </Form> */}
        </Modal>
      </div>
    </Card>
  );
}
