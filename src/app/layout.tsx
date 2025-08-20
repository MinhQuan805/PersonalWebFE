import '@/styles/globals.css'
import { Providers } from '@/app/providers'
import AppInitializer from '@/utils/AppInitializer'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
