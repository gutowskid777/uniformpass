'use client'

import { useEffect, useRef, useState } from 'react'

// Scales the fixed 816x1056px flyer sheet down to fit the viewport for
// preview. Print CSS removes the transform so paper output is exact.
const SHEET_W = 816
const SHEET_H = 1056

export default function FlyerScale({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / SHEET_W))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="flyer-scale-outer w-full" style={{ height: SHEET_H * scale }}>
      <div className="flyer-scale-inner" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: SHEET_W }}>
        {children}
      </div>
    </div>
  )
}
