import { Card, Typography, Row, Col, Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import personal from "@/data/personal.json";
import "@/styles/client/home/testimonial.css";

const { Title, Text } = Typography;

export default function Testimonials() {
  const carouselRef = useRef<any>(null);

  const next = () => carouselRef.current?.next();
  const prev = () => carouselRef.current?.prev();

  return (
    <div className="testimonial-section">
      <Title level={2} className="testimonial-title">Trusted By Clients</Title>

      <Card className="testimonial-card">
        <Carousel
          ref={carouselRef}
          autoplay
          dots={false}
          draggable
          speed={600}
          autoplaySpeed={6000}
          effect="fade"
        >
          {personal.testimonials.map((t, i) => (
            <div key={i}>
              <Row justify="center">
                <Col span={22} className="testimonial-content">
                  <div className="testimonial-quote">❝</div>
                  <Text className="testimonial-text">{t.quote}</Text>
                  <div className="testimonial-author">
                    <strong>{t.name}</strong>
                    <br />
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </Carousel>

        {/* Navigation buttons */}
        <div className="testimonial-nav">
          <Button shape="circle" icon={<LeftOutlined />} onClick={prev} />
          <Button shape="circle" icon={<RightOutlined />} onClick={next} />
        </div>
      </Card>
    </div>
  );
}
