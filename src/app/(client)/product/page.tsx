'use client'

import { Row, Col, Button, Spin } from 'antd'
import styles from '@/styles/client/product/product.module.css'
import '@/styles/client/main.css'
import { useState, useEffect } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import ProductCard from '@/components/client/ProductCard'
import { useProducts } from '@/lib/hook/useProducts'
export default function Product() {
  const [currentProduct, setCurrentProduct] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const { products, loadingProducts, errorProducts } = useProducts();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loadingProducts || !products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin tip="Đang tải..." size="large">
          <div style={{ minHeight: 200 }} />
        </Spin>
      </div>
    )
  }

  return (
    <div className={styles.productContainer}>
      {/* Tiêu đề */}
      <div className={styles.titleHeader}>
        <div>Sản Phẩm Và Dịch Vụ</div>
      </div>

      {isMobile && (
        <div className="transition" style={{ marginBottom: 20 }}>
          <Button
            onClick={() =>
              setCurrentProduct((prev) => (prev === 0 ? products.length - 1 : prev - 1))
            }
            className="button-transition"
          >
            <LeftOutlined />
          </Button>
          <Button
            onClick={() =>
              setCurrentProduct((prev) => (prev === products.length - 1 ? 0 : prev + 1))
            }
            className="button-transition"
          >
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
  )
}
