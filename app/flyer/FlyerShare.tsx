'use client'

import { useState } from 'react'
import SharePanel from '@/components/SharePanel'
import PrintButton from '@/components/PrintButton'
import { getTheme, SCHOOL_CODES, SCHOOL_THEMES } from '@/lib/schoolTheme'

const ACTION = 'inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-300 text-gray-800 text-[15px] font-bold hover:border-gray-500 transition-colors no-print'

export default function FlyerShare() {
  const [code, setCode] = useState('')

  return (
    <div className="no-print">
      <p className="mt-5 text-center text-[15px] font-semibold text-gray-700">
        Forward to anyone you know who&apos;s looking to buy or sell uniforms.
      </p>

      <select
        value={code}
        onChange={e => setCode(e.target.value)}
        aria-label="School for the share link"
        className="w-full mt-3 rounded-xl border-gray-300 text-[15px] font-semibold text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All schools</option>
        {SCHOOL_CODES.map(c => (
          <option key={c} value={c}>{SCHOOL_THEMES[c].fullName}</option>
        ))}
      </select>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <a
          href="/api/flyer-image"
          download="uniformpass-flyer.png"
          className="inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-900 text-white text-[15px] font-bold hover:bg-black transition-colors"
        >
          Save image
        </a>
        <PrintButton className={ACTION} label="Print" />
        <SharePanel kind="school" theme={getTheme(code)} buttonClassName={ACTION} />
      </div>
    </div>
  )
}
