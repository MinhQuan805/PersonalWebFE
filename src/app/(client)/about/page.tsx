'use client';

import { Row, Col, Typography, Button} from 'antd';
const { Title, Paragraph } = Typography;
import '@/styles/client/about/about.css';
import { TbBrandGithubFilled } from 'react-icons/tb';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
export default function Home() {
  return (
    <div className="about-container">
      <Row gutter={[80, 80]} align="middle">
        <Col xs={24} md={10} className="intro-image-container">
          <div className="intro-image">
            <img src="/image/general/avatar.jpg" alt="Minh Quan" className="intro-image" />
          </div>
        </Col>
        <Col xs={24} md={14}>
          <Title className="intro-title">
            <span style={{ fontSize: 30, fontWeight: 700 }}>Welcome bạn</span>
          </Title>

          <Title className="intro-title">
            <span style={{ fontSize: 25, fontWeight: 700 }}>Mình là </span>
            <span
              style={{
                fontSize: 45,
                fontWeight: "600",
                background: "linear-gradient(to top, #FFD54F 40%, transparent 40%)",
                color: "#333b92ff",
                display: "inline-block"
              }}
            >
              Minh Quân
            </span>
          </Title>

          <Title
            className="intro-title"
          >
            <span style={{ fontSize: 25, fontWeight: 700}}>- Sinh viên trường UIT, một người trẻ trên hành trình học hỏi và kiếm thu nhập</span>
          </Title>

          <div className="intro-icon">
              <Button href="https://www.linkedin.com/in/qu%C3%A2n-v%C3%B5-821704325/" icon={<FaLinkedinIn style={{ color: '#1890ff' }} />} />
              <Button href="https://github.com/MinhQuan805"><TbBrandGithubFilled style={{ color: '#1890ff', height: 20, width: 20 }} /></Button>
              <Button href="https://www.facebook.com/quan.minh.780514/" icon={<FaFacebookF style={{ color: '#1890ff' }} />} />
          </div>
          <Paragraph className="intro-description">
            Ở những năm tuổi thiếu niên thì mình luôn khát khao tạo nên một điều gì đó thật sự có ý nghĩa và tạo dấu ấn cho những năm tháng của mình.
          </Paragraph>

          <Paragraph className="intro-description">
            Nhưng khi lớn lên, va chạm với rất nhiều thử thách và thất bại rất nhiều lần thì mình mới thấy bản thân thật sự nhỏ bé biết bao.
          </Paragraph>

          <Paragraph className="intro-description">
            Giờ đây, ở những tuổi 20s, mình đang cặm cụi từng bước một để biến những giấc mơ của mình không chỉ còn trong những trang giấy. Và đây là nơi để mình chia sẻ hành trình đó.
          </Paragraph>

        </Col>
      </Row>
    </div>
  )
}