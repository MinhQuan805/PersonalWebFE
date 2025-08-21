// lib/hooks/useArticles.ts
import useSWR from 'swr'
import { ArticleDTO } from '@/types/article.dto'

// fetcher cơ bản
const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useArticles() {
  const { data, error, isLoading } = useSWR<ArticleDTO[]>(`${process.env.NEXT_PUBLIC_API_GET}/articles`, fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  )

  console.log(data);
  return {
    articles: data || [],
    loadingArticles: isLoading,
    errorArticles: error,
  }
}
