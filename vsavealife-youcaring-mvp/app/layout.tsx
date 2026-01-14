import './globals.css'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'V Save a Life Foundation — vsavealife.org',
  description: 'YouCaring-style crowdfunding MVP for urgent needs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <Header />
        {children}
      </body>
    </html>
  )
}
