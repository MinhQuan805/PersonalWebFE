'use client'

import AdminLayout from '@/components/Layout/AdminLayout'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}
