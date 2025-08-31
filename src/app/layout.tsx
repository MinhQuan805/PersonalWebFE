import '@/styles/globals.css'
import { SWRConfigProvider } from '@/components/SWRConfigProvider'
import "@/types/i18n";
import type { Metadata } from 'next';
import personal from '@/data/personal.json';

export const metadata: Metadata = {
  title: "Quan Notes",
  icons: {
    icon: personal.about.logo,
  },
};

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
