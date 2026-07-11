'use client'

import { useState, useRef, useEffect } from 'react'
import type { School } from '@/lib/supabase'

type Val = { school_id: string; school_name: string; custom_school: string }

// Searchable school picker: type to filter, or add one that isn't listed.
// Custom school → school_id 'other' + custom_school text (stored as free-text school_name).
export default function SchoolPicker({
  schools, value, onChange,
}: {
  schools: School[]
  value: Val
  onChange: (v: Val) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const committedLabel =
    value.school_id === 'other' ? value.custom_school
    : value.school_id ? value.school_name
    : ''

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const q = query.trim().toLowerCase()
  const matches = (q ? schools.filter(s => s.name.toLowerCase().includes(q)) : schools).slice(0, 8)

  const pick = (s: School) => {
    onChange({ school_id: s.id, school_name: s.name, custom_school: '' })
    setQuery('')
    setOpen(false)
  }
  const useCustom = () => {
    onChange({ school_id: 'other', school_name: '', custom_school: query.trim() })
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={open ? query : committedLabel}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => { setQuery(''); setOpen(true) }}
        placeholder="Search your school…"
        className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {matches.map(s => (
            <button
              type="button" key={s.id} onClick={() => pick(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50"
            >
              {s.name} <span className="text-gray-400">({s.state})</span>
            </button>
          ))}
          {q && matches.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">No match — add it below.</p>
          )}
          {query.trim() && (
            <button
              type="button" onClick={useCustom}
              className="w-full text-left px-3 py-2 text-sm border-t border-gray-100 hover:bg-indigo-50 text-indigo-700 font-medium"
            >
              + Use &ldquo;{query.trim()}&rdquo; (not listed)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
