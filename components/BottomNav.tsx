'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Stroke icons, not emoji: they inherit the active color and match the icons the
// homepage already uses (cash = Auto Sell, tag = list it yourself).
function Icon({ d }: { d: React.ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="w-[22px] h-[22px]" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {d}
    </svg>
  )
}

const TABS = [
  {
    href: '/', label: 'Browse',
    icon: <><circle cx="14" cy="14" r="8.5" /><path d="M20.5 20.5 L27 27" /></>,
  },
  {
    href: '/sell-for-me', label: 'Auto Sell',
    icon: <><rect x="3" y="9" width="26" height="14" rx="2.5" /><circle cx="16" cy="16" r="4" /><path d="M7.5 13v6M24.5 13v6" /></>,
  },
  {
    href: '/new', label: 'Sell It Myself',
    icon: <path d="M16 7v18M7 16h18" />,
  },
  {
    href: '/my-listings', label: 'My Listings',
    icon: <><rect x="7" y="5" width="18" height="23" rx="2.5" /><path d="M12 12h8M12 17h8M12 22h5" /></>,
  },
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
              className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors ${
                active ? 'text-indigo-700' : 'text-gray-500'
              }`}>
              <Icon d={t.icon} />
              {t.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
