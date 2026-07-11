'use client'

import { useEffect, useState } from 'react'
import { type SchoolTheme } from '@/lib/schoolTheme'
import { buyMessage, sellMessage, listingMessage } from '@/lib/shareMessages'

// The share moment: before anything gets posted, show the ACTUAL link
// preview (the real OG card) plus a paste-ready human message. Seeing the
// legit preview is what gives a parent the confidence to hit post.

type ShareProps =
  | { kind: 'school'; theme: SchoolTheme | null; buttonClassName?: string; buttonStyle?: React.CSSProperties }
  | {
      kind: 'listing'
      theme: SchoolTheme | null
      listing: { id: string; itemType: string; price: number; schoolName: string }
      buttonClassName?: string
      buttonStyle?: React.CSSProperties
    }

export default function SharePanel(props: ShareProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const message =
    props.kind === 'listing'
      ? listingMessage({
          id: props.listing.id,
          itemType: props.listing.itemType,
          price: props.listing.price,
          schoolShort: props.theme ? props.theme.shortName : props.listing.schoolName,
        })
      : tab === 'buy'
        ? buyMessage(props.theme)
        : sellMessage(props.theme)

  const previewSrc =
    props.kind === 'listing'
      ? `/api/og/listing?id=${props.listing.id}`
      : props.theme
        ? `/api/og?school=${props.theme.code}`
        : '/api/og'

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard blocked: select-all fallback is the textarea itself.
    }
  }

  const doNativeShare = async () => {
    try {
      await navigator.share({ text: message })
    } catch {
      // User dismissed the sheet. Nothing to do.
    }
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setCopied(false) }}
        className={props.buttonClassName || 'inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-full bg-white/15 border border-white/40 text-white hover:bg-white/25 transition-colors'}
        style={props.buttonStyle}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.2 10.9a3 3 0 1 0 0 2.2m0-2.2 9.6-4.8m-9.6 7 9.6 4.8m0 0a3 3 0 1 0 2.7-1.7 3 3 0 0 0-2.7 1.7Zm2.7-13.6a3 3 0 1 1-2.7 1.7" />
        </svg>
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Share">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {props.kind === 'listing' ? 'Share this find' : 'Share with your school'}
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold">
                ✕
              </button>
            </div>

            {/* The real preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Link preview"
              className="w-full rounded-xl border border-gray-200 shadow-sm"
              style={{ aspectRatio: '1200 / 630', objectFit: 'cover' }}
            />
            <p className="text-sm text-gray-500 mt-2">
              This is the exact preview the group will see when you paste the link.
            </p>

            {/* Buy / sell message toggle (school shares only) */}
            {props.kind === 'school' && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {(['buy', 'sell'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'buy' ? 'For buyers' : 'For sellers'}
                  </button>
                ))}
              </div>
            )}

            <textarea
              readOnly
              value={message}
              rows={5}
              onFocus={e => e.currentTarget.select()}
              className="w-full mt-3 rounded-xl border-gray-300 text-[15px] leading-relaxed text-gray-800 bg-gray-50"
            />

            <div className="mt-4 space-y-2">
              {canNativeShare && (
                <button onClick={doNativeShare}
                  className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-lg font-bold hover:bg-black transition-colors">
                  Share...
                </button>
              )}
              <button onClick={doCopy}
                className={`w-full py-3.5 rounded-2xl text-lg font-bold border-2 transition-colors ${
                  copied ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300 text-gray-800 hover:border-gray-500'
                }`}>
                {copied ? 'Copied. Go paste it in the group chat.' : 'Copy message + link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
