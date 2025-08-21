'use client';
import React from 'react';
import { Card, Typography, Button } from 'antd';
import "@/styles/client/main.css"
import { ProductType } from '@/lib/models/product.model';
const { Paragraph } = Typography;

type Props = {
  product: ProductType;
  style: { [key: string]: string };
};

const ProductCard: React.FC<Props> = ({ product, style }) => {
  return (
    <Card className={style.productCard}>
      <div className={style.productImage}>
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className={style.productContent}>
        <div className={style.productTitle}>
          <img className={style.productLogo} src={product.logo} />
          <span className={style.productLabel}>{product.title}</span>
        </div>
        <Paragraph className={`${style.description} truncate2`}>
          {product.shortDescription}
        </Paragraph>
        <div className={style.action}>
          <Button className={style.productButton} style={{ background: '#eaf3fa', color: '#222' }}>Tìm hiểu</Button>
          <a href={product.github} target="_blank" rel="noopener noreferrer"><img src="/image/logo/github.png" alt="GitHub" /></a>
          <Button className={style.productButton} style={{ background: '#eaf3fa', color: '#222' }}>Feedback</Button>    
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
