import useSWR from 'swr'
import { ProductType } from '../models/product.model'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useProducts() {
  const { data, error, isLoading } = useSWR<ProductType[]>(
    `${process.env.NEXT_PUBLIC_API_GET}/products`, fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  )
  return {
    products: data || [],
    loadingProducts: isLoading,
    errorProducts: error,
  }
}
