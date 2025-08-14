'use client';

import { Row, Col, Button, Spin } from 'antd';
import styles from '@/styles/client/product/product.module.css';
import '@/styles/client/main.css'
import { useState, useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/lib/models/product.model';
import axios from 'axios';

export default function Product() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/products`);
        setProducts(resProduct.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    };
    fetchData();
  }, [])
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin tip="Đang tải..." size="large">
          <div style={{ minHeight: 200 }} />
        </Spin>
      </div>
    );
  }
  return (
      <div className={styles.productContainer}>
        {/* Bài viết nổi bật */}
        <div className={styles.titleHeader}>
          <div>Sản Phẩm Và Dịch Vụ</div>
        </div>
        {isMobile && (
            <div className="transition" style={{marginBottom: 20,}}>
              <Button onClick={() => setCurrentProduct(prev => (prev === 0 ? products.length - 1 : prev - 1))} className="button-transition">
                <LeftOutlined />
              </Button>
              <Button onClick={() => setCurrentProduct(prev => (prev === products.length - 1 ? 0 : prev + 1))} className="button-transition">
                <RightOutlined />
              </Button>
            </div>
          )}
        <Row gutter={[24, 24]}>
          {(isMobile ? [products[currentProduct]] : products).map((product, idx) => (
            <Col xs={24} lg={8} md={12} key={idx}>
              <ProductCard product={product} style={styles} />
            </Col>
          ))}
        </Row>
      </div>
  );
} 