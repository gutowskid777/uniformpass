'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Small segmented toggle at the top of the flyer pages: Digital (default) ↔ Paper.
export default function FlyerTabs() {
  const path = usePathname()
  const paper = path.startsWith('/flyer/print')
  const tab = 'flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-colors'
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl max-w-[20rem]">
      <Link href="/flyer" className={`${tab} ${!paper ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
        Digital
      </Link>
      <Link href="/flyer/print" className={`${tab} ${paper ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
        Paper
      </Link>
    </div>
  )
}
