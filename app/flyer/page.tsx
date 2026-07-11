import type { Metadata } from 'next'
import Link from 'next/link'
import { SCHOOL_CODES, SCHOOL_THEMES } from '@/lib/schoolTheme'
import MonogramPatch from '@/components/MonogramPatch'

export const metadata: Metadata = {
  title: 'Print a school flyer · UniformPass',
  robots: { index: false },
}

// Flyer picker: one tap to the school's print-ready sheet.
export default function FlyerIndexPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
        Print a flyer for your school.
      </h1>
      <p className="text-gray-600 mt-3 text-lg">
        One letter-size page with a QR code straight to your school&apos;s uniforms.
        Pin it at pickup, the parish hall, the gym lobby.
      </p>

      <div className="mt-8 space-y-3">
        {SCHOOL_CODES.map(code => {
          const t = SCHOOL_THEMES[code]
          return (
            <Link
              key={code}
              href={`/flyer/${code}`}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <MonogramPatch theme={t} size={56} />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-extrabold text-gray-900 leading-tight">{t.fullName}</p>
                <p className="text-sm text-gray-500">{t.town}</p>
              </div>
              <span className="text-sm font-bold text-gray-400" aria-hidden>→</span>
            </Link>
          )
        })}
        <Link
          href="/flyer/all"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
        >
          <div className="w-14 h-14 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xl font-black shrink-0">
            All
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-extrabold text-gray-900 leading-tight">Every school</p>
            <p className="text-sm text-gray-500">The general UniformPass flyer</p>
          </div>
          <span className="text-sm font-bold text-gray-400" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}
