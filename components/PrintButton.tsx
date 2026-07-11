'use client'

export default function PrintButton({ style }: { style?: React.CSSProperties }) {
  return (
    <button
      onClick={() => window.print()}
      style={style}
      className="no-print w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gray-900 hover:bg-black transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V4h12v5M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-12-3h12v7H6v-7Z" />
      </svg>
      Print this flyer
    </button>
  )
}
