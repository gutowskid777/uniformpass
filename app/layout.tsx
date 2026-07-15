import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import AuthProvider from '@/components/AuthProvider'
import AuthNav from '@/components/AuthNav'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://uniformpass.shop'),
  title: 'UniformPass · Buy & Sell School Uniforms',
  description: 'Buy and sell used school uniforms and spirit wear right in your school community. No fees, meet locally.',
  openGraph: {
    title: 'UniformPass · Buy & Sell School Uniforms',
    description: 'Skip the $80 uniform. Buy and sell with families at your school. No fees, no shipping, meet locally.',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} pb-[calc(4rem_+_env(safe-area-inset-bottom))] sm:pb-0`}>
        <AuthProvider>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-indigo-700 tracking-tight">
              <svg viewBox="0 0 32 32" className="w-6 h-6" aria-hidden>
                <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 13 v-1.8 a2.3 2.3 0 1 0 -2.3 -2.3" />
                  <path d="M16 13 L6 22 H26 Z" />
                </g>
              </svg>
              UniformPass
            </Link>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Link href="/sell-for-me" className="hidden sm:inline-flex items-center h-9 text-sm font-semibold text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-3.5 rounded-full transition-colors">
                Auto Sell
              </Link>
              <Link href="/my-listings" className="hidden sm:inline-flex items-center h-9 text-sm font-semibold text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-3.5 rounded-full transition-colors">
                My Listings
              </Link>
              <AuthNav />
              <Link
                href="/new"
                className="hidden sm:inline-flex items-center h-9 bg-indigo-600 text-white text-sm font-semibold px-4 rounded-full hover:bg-indigo-700 transition-colors"
              >
                + Sell
              </Link>
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <BottomNav />
        <footer className="border-t border-gray-200 bg-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="font-semibold text-gray-600">No fees · No shipping · Meet locally</p>
            <div className="flex items-center gap-6 font-semibold">
              <Link href="/flyer" className="text-indigo-600 hover:underline">Share the flyer</Link>
              <Link href="/contact" className="text-gray-500 hover:text-indigo-700 transition-colors">Contact</Link>
              <span className="font-normal text-gray-400">© 2026</span>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
