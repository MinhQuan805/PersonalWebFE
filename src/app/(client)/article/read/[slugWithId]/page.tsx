'use client'
import { notFound, useParams } from 'next/navigation';
import { Button, Row, Typography, Spin } from 'antd';
import style from '@/styles/client/article/reading.module.css';
import { useRouter } from 'next/navigation';
import '@/styles/client/main.css'
import SupportCard from '@/components/client/SupportCard';
import ContactCard from '@/components/client/ContactCard';
import { useArticles } from '@/lib/hook/useArticles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ArticleType } from '@/lib/models/article.model';

const { Title, Paragraph } = Typography;

export default function ArticleDetail() {
  const { articles, loadingArticles } = useArticles();
  const params = useParams();
  const slugWithId = params.slugWithId as string;

  if (!slugWithId.includes('.')) {
    notFound();
  }

  const [slug, id] = slugWithId.split('.');
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/articles?id=${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        notFound();
      } finally {
        setLoadingArticle(false);
      }
    };
    fetchArticle();
  }, [id]);

  const readArticle = (article: ArticleType) => {
    router.push(`/article/read/${article.slug}.${article._id}`);
  }

  if (loadingArticles || loadingArticle) {
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

  // Lọc các bài viết liên quan
  let relatedArticles: ArticleType[] = [];

  if (article.tags?.length) {
    // 1. Các bài viết có ít nhất 1 tag giống
    const sameTagArticles = articles.filter(
      a => a._id !== article._id && a.tags?.some(tag => article.tags?.includes(tag))
    );

    // 2. Nếu ít hơn 3  thì lấy thêm các bài khác
    if (sameTagArticles.length < 3) {
      const otherArticles = articles.filter(
        a => a._id !== article._id && !sameTagArticles.includes(a)
      );
      relatedArticles = [...sameTagArticles, ...otherArticles].slice(0, 3);
    } else {
      relatedArticles = sameTagArticles.slice(0, 3);
    }
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
