import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import AuthProvider from '@/components/AuthProvider'
import AuthNav from '@/components/AuthNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://uniformpass.vercel.app'),
  title: 'UniformPass · Buy & Sell School Uniforms',
  description: 'Buy and sell used school uniforms and spirit wear right in your school community. No fees, meet up local.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-xl text-indigo-700 tracking-tight">
              UniformPass
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/sell-for-me" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
                Sell it for me
              </Link>
              <Link href="/my-listings" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
                My Listings
              </Link>
              <AuthNav />
              <Link
                href="/new"
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-indigo-700 transition-colors"
              >
                + Sell
              </Link>
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-16 py-8 text-center text-sm text-gray-500">
          <p>Buy and sell school uniforms in your community.</p>
          <p className="mt-1">
            Questions, or need to take down a listing?{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline">Contact us</Link>
          </p>
          <p className="mt-1 text-gray-400">© 2026 UniformPass. All rights reserved.</p>
        </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
