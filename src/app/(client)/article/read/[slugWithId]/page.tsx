'use client'
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Button, Row, Typography } from 'antd';
import style from '@/styles/client/article/reading.module.css';
import type { ArticleType } from '@/lib/models/article.model';
import { useRouter } from 'next/navigation';
import '@/styles/client/main.css'
import SupportCard from '@/components/SupportCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import ContactCard from '@/components/ContactCard';

const { Title, Paragraph } = Typography;

export default function ArticleDetail() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/articles`);
        setArticles(response.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    };

    fetchData();
  }, []);
  const params = useParams();
  const slugWithId = params.slugWithId as string;
  if (!slugWithId.includes('.')) {
    notFound();
  }
  const router = useRouter();
  const readArticle = async (article: any) => {
    router.push(`/article/read/${article.slug}.${article._id}`)
  }

  const [slug, id] = slugWithId.split('.');
  const article = articles.find((a) => a._id === id);

  let relatedArticles: ArticleType[] = [];
  if (article?.tags?.length) {
    relatedArticles = articles
                        .filter((a) => a._id !== article._id && a.tags?.some((tag) => article.tags?.includes(tag)))
                        .slice(0, 3);
    if (relatedArticles.length === 0) {
      relatedArticles = articles
        .filter((a) => a._id !== article?._id && a.tags?.includes('Technology'))
        .slice(0, 3);
    }
  }
  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin tip="Đang tải bài viết..." size="large">
          <div style={{ minHeight: 200 }} />
        </Spin>
      </div>
    );
  }
  if (!article) {
    notFound();
  }
  return (
    <div className={style.readingContainer}>
      <Paragraph className={style.readingTags}>
        {article.tags?.join(' - ')}
      </Paragraph>

      <Title className={style.readingTitle}>
        {article.title}
      </Title>

      <hr className={style.readingDivider} />

      <Paragraph className={style.readingIntro}>
        {article.introduction}
      </Paragraph>

      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title ?? ''}
          className={style.readingThumbnail}
        />
      )}


      <div
        className={style.readingContent}
        dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
      ></div>
      <hr className={style.readingDivider} style={{marginTop: 40}}/>
      <div className={style.endingSection}>
        <ContactCard />
        <SupportCard mesNum={0}/>
      </div>
      {/* Hiển thị các bài viết liên quan */}
      <hr className={style.readingDivider} style={{marginTop: 20}}/>
      <Title level={4} style={{marginRight: 'auto', marginTop: 40}}>Bài viết khác</Title>
      <div className={style.articleHighlight}>
        {relatedArticles.map((article, index) => (
          <Row gutter={[24, 24]} className={style.articleRow} key={index}
                onClick={() => readArticle(article)}>
            <div className={style.articleImage}>
              <img src={article.thumbnail || undefined} />
            </div>
            <div className={style.articleContent}>
              <Paragraph style={{ color: '#919191', marginBottom: 3 }}>
                {article.tags?.[0] ?? ''}
              </Paragraph>
              <div className={`${style.articleTitle} truncate3`}>{article.title}</div>
            </div>
          </Row>
        ))}
      </div>
  </div>
  );
}
