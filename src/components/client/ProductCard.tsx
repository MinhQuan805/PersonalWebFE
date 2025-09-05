'use client';
import React from 'react';
import { Card, Typography, Button } from 'antd';
import "@/styles/client/main.css"
import { ProductType } from '@/lib/models/product.model';
import { sendGAEvent } from '@next/third-parties/google';
import { FaGithub } from 'react-icons/fa';
import personal from '@/data/personal.json';
const { Paragraph } = Typography;

type Props = {
  product: ProductType;
  style: { [key: string]: string };
};

const handleLearnMore = (productTitle: string, NavLink: string) => {
  sendGAEvent('event', 'product_learn_more', { product: productTitle });
  window.open(`${NavLink}`, "_blank");
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
          <Button className={style.productButton}
            onClick={() => handleLearnMore(product.title, product.github)}
            style={{ background: '#eaf3fa', color: '#222' }}
            icon={<FaGithub />}
          > Tìm hiểu
          </Button>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${personal.about.info.email}&su=${encodeURIComponent(
              `Feedback cho sản phẩm ${product.title}`
            )}&body=${encodeURIComponent(
              `Xin chào Quân,\nTôi muốn góp ý về sản phẩm ${product.title}...`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className={style.productButton}
              style={{ background: '#eaf3fa', color: '#222' }}
            >
              Feedback
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
