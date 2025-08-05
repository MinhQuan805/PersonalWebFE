'use client';
import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { ArticleType } from '@/lib/models/article.model';
import { useRouter } from 'next/navigation';

const { Paragraph } = Typography;

type Props = {
  articles: ArticleType[];
  style: { [key: string]: string };
};

const ArticleHighlight: React.FC<Props> = ({ articles, style }) => {
  const router = useRouter();
  const readArticle = async (article: any) => {
    router.push(`/article/read/${article.slug}.${article._id}`)
  }
  return (
    <div className={style.articleHighlight}>
      {articles.map((article, index) => (
        <Row gutter={[24, 24]} className={style.articleRow} key={index} onClick={() => readArticle(article)}>
          <Col xs={24} md={6}>
            <div className={style.articleImage}>
              <img src={article.thumbnail ?? ''} />
            </div>
          </Col>
          <Col xs={24} md={18}>
            <div className={style.articleContent}>
              <Paragraph style={{ color: '#919191', marginBottom: 3 }}>
                {article.tags?.[0] ?? ''}
              </Paragraph>
              <div className={`${style.articleTitle} truncate3`}>{article.title}</div>
              <Paragraph className={`${style.articleIntroduction} truncate2`}>
                {article.introduction}
              </Paragraph>
              <Button onClick={() => readArticle(article)} className={style.articleButton}>Đọc bài viết</Button>
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default ArticleHighlight;
