// components/AppInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchProducts } from '@/lib/redux/reducers/productsSlice';
import { fetchArticles } from '@/lib/redux/reducers/articlesSlice';

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.data);
  const articles = useSelector((state: RootState) => state.articles.data);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    if (articles.length === 0) dispatch(fetchArticles());
  }, [dispatch, products.length, articles.length]);

  return null;
}