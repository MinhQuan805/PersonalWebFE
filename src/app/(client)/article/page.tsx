'use client';

import { Row, Col, Typography, Button, Input, Dropdown, Pagination, Spin } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { sendGAEvent } from '@next/third-parties/google';
import ArticleStyle from '@/styles/client/home/articleHighlight.module.css';
import OverrideStyle from '@/styles/client/article/overrideHighlight.module.css';
import '@/styles/client/article/article-home.css';
import '@/styles/client/main.css';
import ProductStyle from '@/styles/client/product/product.module.css';
import ArticleHighlight from '@/components/client/Article';
import ProductCard from '@/components/client/ProductCard';
import SupportCard from '@/components/client/SupportCard';
import { FaFilter } from 'react-icons/fa';
import { TbArrowsSort } from 'react-icons/tb';

const { Title, Paragraph } = Typography;
const newStyle = { ...ArticleStyle, ...OverrideStyle };
const PAGE_SIZE = 5;

export default function Home() {
  const router = useRouter();
  
  // Lấy dữ liệu từ Redux
  const { data: products, loading: loadingProducts } = useSelector((state: RootState) => state.products);
  const { data: articles, loading: loadingArticles } = useSelector((state: RootState) => state.articles);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('createdAt-desc');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  // Lọc + sort articles
  const filteredArticles = (() => {
    let result = [...articles];

    if (selectedTag) {
      result = result.filter(article => article.tags?.includes(selectedTag));
    }
    if (keyword) {
      const keywordExp = new RegExp(keyword, 'i');
      result = result.filter(article => keywordExp.test(article.title ?? ''));
    }
    switch (selectedSort) {
      case 'title-asc':
        result.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
        break;
      case 'title-desc':
        result.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
        break;
      case 'createdAt-asc':
        result.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
        break;
      case 'createdAt-desc':
        result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
        break;
    }
    return result;
  })();

  const startIndex = (page - 1) * PAGE_SIZE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);

  const readArticle = async (article: any) => {
    sendGAEvent('event', 'read_article', {
      article_id: article._id,
      article_title: article.title,
    });
    await router.push(`/article/read/${article.slug}.${article._id}`);
  };

  return (
    <div className="article-main">
      <div className="article-banner">
        <h1 className="hero-title">BÀI VIẾT</h1>
      </div>
      <Spin spinning={loadingProducts || loadingArticles}>
        <div className="highlight-container">
          <Title level={4} style={{ marginRight: 'auto' }}>BÀI VIẾT NỔI BẬT</Title>
          <Row gutter={[24, 24]} className='highlight-row'>
            {articles
              .filter(item => item.outstand)
              .slice(0, 4)
              .map((article, index) => (
                <Col xs={24} md={12} key={index} className='highlight-col' onClick={() => readArticle(article)}>
                  <div className="highlight-box">
                    <div className="highlight-image">
                      <img src={article.thumbnail ?? ''} alt={article.title ?? ''} />
                    </div>
                    <div className="highlight-content">
                      <Paragraph style={{ color: '#919191', marginBottom: 3 }}>{article.tags?.[0] ?? ''}</Paragraph>
                      <div className="highlight-title truncate3">{article.title}</div>
                      <Paragraph className="highlight-introduction truncate2">
                        {article.introduction}
                      </Paragraph>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); readArticle(article); }}
                        className="highlight-button"
                      >
                        Đọc bài viết
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </div>

        {/* Danh sách bài viết */}
        <Row gutter={0} className={OverrideStyle.articleMain}>
          <Col md={24} lg={16} className={OverrideStyle.columnLeft}>
            {/* Bộ lọc */}
            <div className={OverrideStyle.articleHeader}>
              <Title level={4} className={OverrideStyle.articleHeaderLeft}>DÀNH CHO BẠN</Title>
              <div className={OverrideStyle.articleHeaderRight}>
                <Input.Search
                  className="custom-search"
                  placeholder="Tìm kiếm"
                  onSearch={setKeyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
                <Dropdown menu={{ items: [
                  { label: <span style={{ color: selectedTag === null ? '#1890ff' : undefined }}>Tất cả</span>, key: "" },
                  { type: 'divider' as const },
                  { label: <span style={{ color: selectedTag === "Finance" ? '#1890ff' : undefined }}>Tài chính</span>, key: "Finance" },
                  { label: <span style={{ color: selectedTag === "Technology" ? '#1890ff' : undefined }}>Công nghệ</span>, key: "Technology" },
                ], onClick: ({ key }) => setSelectedTag(key || null) }} trigger={['click']}>
                  <Button className="button-filter"><FaFilter /></Button>
                </Dropdown>
                <Dropdown menu={{ items: [
                  { label: <span style={{ color: selectedSort === "createdAt-desc" ? '#1890ff' : undefined }}>Mới nhất</span>, key: 'createdAt-desc' },
                  { label: <span style={{ color: selectedSort === "createdAt-asc" ? '#1890ff' : undefined }}>Cũ nhất</span>, key: 'createdAt-asc' },
                  { label: <span style={{ color: selectedSort === "title-asc" ? '#1890ff' : undefined }}>Tên A → Z</span>, key: 'title-asc' },
                  { label: <span style={{ color: selectedSort === "title-desc" ? '#1890ff' : undefined }}>Tên Z → A</span>, key: 'title-desc' },
                ], onClick: ({ key }) => setSelectedSort(key) }} trigger={['click']}>
                  <Button className="button-filter"><TbArrowsSort /></Button>
                </Dropdown>
              </div>
            </div>

            <ArticleHighlight articles={currentArticles} style={newStyle} />
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={filteredArticles.length}
              showSizeChanger={false}
              onChange={(p) => {
                setPage(p);
                document.querySelector(`.${OverrideStyle.articleMain}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </Col>

          <Col md={24} lg={8}>
            <div className={OverrideStyle.columnRight}>
              {products.length > 0 && <ProductCard product={products[0]} style={ProductStyle} />}
              <SupportCard mesNum={0} />
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
