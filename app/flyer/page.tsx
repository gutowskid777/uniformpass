import type { Metadata } from 'next'
import SharePanel from '@/components/SharePanel'
import PrintButton from '@/components/PrintButton'
import './flyer.css'

export const metadata: Metadata = {
  title: 'The UniformPass flyer · save, print, share',
  robots: { index: false },
}

// One flyer, three jobs: save the image to drop in a parent group, print it for
// a corkboard, or share it. Same artwork for all three (the /api/flyer-image PNG).
const ACTION = 'inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-300 text-gray-800 text-[15px] font-bold hover:border-gray-500 transition-colors no-print'

export default function FlyerPage() {
  return (
    <div className="flyer-print-wrap max-w-xl mx-auto px-4 py-8">
      <p className="no-print text-center text-[15px] font-semibold text-gray-700">
        Forward to anyone you know who&apos;s looking to buy or sell uniforms.
      </p>

      <div className="no-print mt-4 grid grid-cols-3 gap-2">
        <a
          href="/api/flyer-image"
          download="uniformpass-flyer.png"
          className="inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-900 text-white text-[15px] font-bold hover:bg-black transition-colors"
        >
          Save image
        </a>
        <PrintButton className={ACTION} label="Print" />
        <SharePanel kind="school" theme={null} buttonClassName={ACTION} />
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/flyer-image"
        alt="UniformPass flyer: turn uniforms into cash, buy and sell with families at your school"
        className="flyer-print-img w-full rounded-2xl shadow-lg mt-4 border border-gray-200"
        style={{ aspectRatio: '1080 / 1350' }}
      />
    </div>
  )
}
