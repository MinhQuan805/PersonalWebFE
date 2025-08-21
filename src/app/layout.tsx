import '@/styles/globals.css'
import { SWRConfigProvider } from '@/components/SWRConfigProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SWRConfigProvider>
          {children}
        </SWRConfigProvider>
      </body>
    </html>
  )
}
