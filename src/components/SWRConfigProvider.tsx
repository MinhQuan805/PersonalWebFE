'use client'

import { SWRConfig } from 'swr'

export function SWRConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(res => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        refreshInterval: 0,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  )
}
