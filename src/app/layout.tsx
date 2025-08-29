import '@/styles/globals.css'
import { SWRConfigProvider } from '@/components/SWRConfigProvider'
import "@/types/i18n";
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
