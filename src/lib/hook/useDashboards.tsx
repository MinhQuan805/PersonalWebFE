import useSWR from 'swr'
import { DashboardType } from '../models/dashboard.model'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useDashboards() {
  const { data, error, isLoading } = useSWR<DashboardType>(
    `${process.env.NEXT_PUBLIC_API_GET}/dashboards`, fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  )
  return {
    dashboard: data ?? null,
    loadingDashboard: isLoading,
    errorDashboard: error,
  }
}
