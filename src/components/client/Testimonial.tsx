"use client";

import { Card, Typography, Row, Col, Button, Avatar } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import personal from "@/data/personal.json";
import "@/styles/client/home/testimonial.css";

// import css của swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { Title, Text } = Typography;

export default function Testimonials() {
  return (
    <div className="testimonial-section">
      <div className="home-heading">
        <div>Cảm nhận của khách hàng</div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        speed={600}
        loop
        breakpoints={{
          0: { slidesPerView: 1 }, 
          768: { slidesPerView: 2 }, 
        }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".testimonial-next",
          prevEl: ".testimonial-prev",
        }}
      >
        {personal.testimonials.map((t, i) => (
          <SwiperSlide key={i} className="testimonial-card">
            <Card>
              <Row justify="center" gutter={[20, 20]}>
                <Col xs={0} sm={5}>
                  <Avatar
                    src={t.avatar} 
                    size={64}  
                    shape="circle"
                    className="testimonial-avatar"
                  />
                </Col>
                <Col xs={24} sm={19} className="testimonial-content">
                  <Text className="testimonial-quote">{t.quote}</Text>
                  <div className="testimonial-author">
                    <strong>{t.name}</strong>
                    <br />
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </Col>
              </Row>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
