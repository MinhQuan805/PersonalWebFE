'use client'

import ClientLayout from '@/components/client/ClientLayout'

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>)
}
