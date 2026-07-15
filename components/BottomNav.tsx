'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Browse', icon: '🔍' },
  { href: '/sell-for-me', label: 'Auto Sell', icon: '🚗' },
  { href: '/new', label: 'Sell It Myself', icon: '➕' },
  { href: '/my-listings', label: 'My Listings', icon: '📋' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {TABS.map(t => {
          const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
          return (
            <Link key={t.href} href={t.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                active ? 'text-indigo-700' : 'text-gray-500'
              }`}>
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
