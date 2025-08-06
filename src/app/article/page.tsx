'use client';

import { Row, Col, Typography, Button, Input, Dropdown, Pagination, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArticleStyle from '@/styles/client/home/articleHighlight.module.css';
import OverrideStyle from '@/styles/client/article/overrideHighlight.module.css';
import '@/styles/client/article/article-home.css';
import '@/styles/client/main.css';
import ProductStyle from '@/styles/client/product/product.module.css';
import ArticleHighlight from '@/components/Article';
import { ArticleType } from '@/lib/models/article.model';
import { ProductType } from '@/lib/models/product.model'
import ProductCard from '@/components/ProductCard';
import { FaFilter } from 'react-icons/fa';
import { TbArrowsSort } from 'react-icons/tb';
import SupportCard from '@/components/SupportCard';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const newStyle = {
  ...ArticleStyle,
  ...OverrideStyle,
};

const PAGE_SIZE = 5;

export default function Home() {
  const [originalArticles, setOriginalArticles] = useState<ArticleType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('createdAt-desc');
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resArticle = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/articles`);
        const resProduct = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/products`);
        setArticles(resArticle.data);
        setOriginalArticles(resArticle.data);
        setProducts(resProduct.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
          setLoading(false);
        }
    };

    fetchData();
  }, []);

  // BÀI VIẾT NỔI BẬT
  const articlesHighlight = originalArticles.filter(item => item.outstand);
  const articleRow = [];
  for (let i = 0; i < 4; i += 2) {
    articleRow.push(articlesHighlight.slice(i, i + 2));
  }

  // Bộ lọc, sắp xếp và tìm kiếm
  useEffect(() => {
    let result = [...originalArticles];

    // Lọc theo tag
    if (selectedTag) {
      result = result.filter(article =>
        article.tags?.includes(selectedTag)
      );
    }

    // Tìm kiếm theo từ khóa
    if (keyword) {
      const keywordExp = new RegExp(keyword, 'i');
      result = result.filter(article => keywordExp.test(article.title ?? ''));
    }

    // Sắp xếp
    switch (selectedSort) {
      case 'title-asc':
        result.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
        break;
      case 'title-desc':
        result.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
        break;
      case 'createdAt-asc':
        result.sort((a, b) =>
          new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        );
        break;
      case 'createdAt-desc':
        result.sort((a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        break;
    }

    setArticles(result);
    setPage(1); // Reset về trang đầu khi filter/sort/search thay đổi
  }, [selectedTag, selectedSort, keyword, originalArticles]);

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const handleTagFilter = ({ key }: { key: string }) => {
    setSelectedTag(key || null);
  };

  const handleSort = ({ key }: { key: string }) => {
    setSelectedSort(key);
  };

  const tag = [
    {
      label: <span style={{ color: selectedTag === null ? '#1890ff' : undefined }}>Tất cả</span>,
      key: "",
    },
    { type: 'divider' as const },
    {
      label: <span style={{ color: selectedTag === "Finance" ? '#1890ff' : undefined }}>Tài chính</span>,
      key: "Finance",
    },
    {
      label: <span style={{ color: selectedTag === "Technology" ? '#1890ff' : undefined }}>Công nghệ</span>,
      key: "Technology",
    }
  ];

  const sort = [
    {
      label: <span style={{ color: selectedSort === "createdAt-desc" ? '#1890ff' : undefined }}>Mới nhất</span>,
      key: 'createdAt-desc',
    },
    {
      label: <span style={{ color: selectedSort === "createdAt-asc" ? '#1890ff' : undefined }}>Cũ nhất</span>,
      key: 'createdAt-asc',
    },
    {
      label: <span style={{ color: selectedSort === "title-asc" ? '#1890ff' : undefined }}>Tên A → Z</span>,
      key: 'title-asc',
    },
    {
      label: <span style={{ color: selectedSort === "title-desc" ? '#1890ff' : undefined }}>Tên Z → A</span>,
      key: 'title-desc',
    },
  ];

  const startIndex = (page - 1) * PAGE_SIZE;
  const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE);

  const readArticle = async (article: ArticleType) => {
    await router.push(`/article/read/${article.slug}.${article._id}`);
  };

  return (
    <div className="article-main">
      <div className="article-banner">
        <h1 className="hero-title">BÀI VIẾT</h1>
      </div>
      <Spin spinning={loading}>
      {/* Featured Articles */}
        <div className="highlight-container">
          <Title level={4} style={{ marginRight: 'auto' }}>BÀI VIẾT NỔI BẬT</Title>
          {articleRow.map((articleCol, rowIndex) => (
            <Row gutter={[24, 24]} className='highlight-row' key={rowIndex}>
              {articleCol.map((article, colIndex) => (
                <Col xs={24} md={12} key={colIndex} className='highlight-col' onClick={() => readArticle(article)}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          readArticle(article);
                        }}
                        className="highlight-button"
                      >
                        Đọc bài viết
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ))}
        </div>

        <Row gutter={0} className={OverrideStyle.articleMain}>
          <Col md={24} lg={16} className={OverrideStyle.columnLeft}>
            <div className={OverrideStyle.articleHeader}>
              <Title level={4} className={OverrideStyle.articleHeaderLeft}>DÀNH CHO BẠN</Title>
              <div className={OverrideStyle.articleHeaderRight}>
                <Input.Search
                  className="custom-search"
                  placeholder="Tìm kiếm"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  value={keyword}
                />
                <Dropdown menu={{ items: tag, onClick: handleTagFilter }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Button className="button-filter"><FaFilter /></Button>
                  </a>
                </Dropdown>
                <Dropdown menu={{ items: sort, onClick: handleSort }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Button className="button-filter"><TbArrowsSort /></Button>
                  </a>
                </Dropdown>
              </div>
            </div>

            <hr style={{ width: '90%', borderTop: '0.5px solid rgba(0, 0, 0, 0.2)', marginTop: '10px' }} />
            <ArticleHighlight articles={currentArticles} style={newStyle} />
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={articles.length}
              showSizeChanger={false}
              onChange={(currentPage: number) => {
                setPage(currentPage);
                const container = document.querySelector(`.${OverrideStyle.articleMain}`);
                if (container) {
                  container.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </Col>

          <Col md={24} lg={8}>
              <div className={OverrideStyle.columnRight}>
                {products.length > 0 && (
                  <ProductCard product={products[0]} style={ProductStyle} />
                )}
                <SupportCard mesNum={0} />
              </div>
          </Col>
        </Row>
      </ Spin>
    </div>
  );
}
