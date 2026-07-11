import type { Metadata } from 'next'
import Link from 'next/link'
import SharePanel from '@/components/SharePanel'

export const metadata: Metadata = {
  title: 'The UniformPass flyer · save and share',
  robots: { index: false },
}

// The digital flyer: one school-neutral image to drop in any parent group.
// Save it, or share it with the ready-made message. Paper version linked below.
export default function FlyerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
        The flyer.
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        Save the image and drop it in a parent group with the message below.
        One flyer for every school... nobody feels left out.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/flyer-image"
        alt="UniformPass flyer: skip the $80 uniform, buy and sell with families at your school"
        className="w-full rounded-2xl shadow-lg mt-6 border border-gray-200"
        style={{ aspectRatio: '1080 / 1350' }}
      />

      <div className="mt-6 space-y-2">
        <a
          href="/api/flyer-image"
          download="uniformpass-flyer.png"
          className="block w-full text-center py-4 rounded-2xl bg-gray-900 text-white text-lg font-bold hover:bg-black transition-colors"
        >
          Save image
        </a>
        <SharePanel
          kind="school"
          theme={null}
          buttonClassName="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-300 text-gray-800 text-lg font-bold hover:border-gray-500 transition-colors"
        />
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Pinning it on a real corkboard?{' '}
        <Link href="/flyer/print" className="font-semibold text-indigo-600 underline underline-offset-2">
          Print the paper version
        </Link>{' '}
        ... letter size, with tear-off tabs.
      </p>
    </div>
  )
}
