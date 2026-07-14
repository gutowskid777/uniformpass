import type { Metadata } from 'next'
import SharePanel from '@/components/SharePanel'
import FlyerTabs from '@/components/FlyerTabs'

export const metadata: Metadata = {
  title: 'The UniformPass flyer · save and share',
  robots: { index: false },
}

// The digital flyer: one school-neutral image to drop in any parent group.
// Save / share sit above the image so they're reachable without scrolling.
export default function FlyerPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <FlyerTabs />

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a
          href="/api/flyer-image"
          download="uniformpass-flyer.png"
          className="text-center py-3.5 rounded-2xl bg-gray-900 text-white text-base font-bold hover:bg-black transition-colors"
        >
          Save image
        </a>
        <SharePanel
          kind="school"
          theme={null}
          buttonClassName="inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-300 text-gray-800 text-base font-bold hover:border-gray-500 transition-colors"
        />
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/flyer-image"
        alt="UniformPass flyer: turn uniforms into cash, buy and sell with families at your school"
        className="w-full rounded-2xl shadow-lg mt-4 border border-gray-200"
        style={{ aspectRatio: '1080 / 1350' }}
      />
    </div>
  )
}
