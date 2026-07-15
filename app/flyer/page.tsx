import type { Metadata } from 'next'
import FlyerShare from './FlyerShare'
import './flyer.css'

export const metadata: Metadata = {
  title: 'The UniformPass flyer · save, print, share',
  robots: { index: false },
}

// One flyer, three jobs: save the image to drop in a parent group, print it for
// a corkboard, or share it. Same artwork for all three (the /api/flyer-image PNG).

export default function FlyerPage() {
  return (
    <div className="flyer-print-wrap max-w-xl mx-auto px-4 py-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/flyer-image"
        alt="UniformPass flyer: turn uniforms into cash, buy and sell with families at your school"
        className="flyer-print-img w-full rounded-2xl shadow-lg border border-gray-200"
        style={{ aspectRatio: '1080 / 1350' }}
      />

      <FlyerShare />

      <p className="no-print mt-5 text-center text-[13px] leading-relaxed text-gray-500">
        An independent, parent-run service. Not affiliated with or endorsed by the school. No money changes hands through the site.
      </p>
    </div>
  )
}
