'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { supabase, type Listing, type School, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, SIZES } from '@/lib/supabase'
import { searchSchools } from '@/lib/schoolSearch'

const PLACEHOLDER = 'https://placehold.co/400x533/e8e8f0/9999bb?text=No+photo'

// One simple marketplace. Hero -> Auto Sell -> grid. Search picks your school
// and filters the grid in place. (Per-school themed sections are archived in
// docs/archive/school-sections-2026-07-11 if we ever bring them back.)

export default function BrowseExperience() {
  const [listings, setListings] = useState<Listing[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  const [schoolId, setSchoolId] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (schoolId) query = query.eq('school_id', schoolId)
    if (category) query = query.eq('category', category)
    if (gender) query = query.eq('gender', gender)
    if (size) query = query.eq('size', size)
    if (condition) query = query.eq('condition', condition)

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }, [schoolId, category, gender, size, condition])

  useEffect(() => { fetchListings() }, [fetchListings])

  const activeFilters = [schoolId, category, gender, size, condition].filter(Boolean).length
  const clearFilters = () => { setSchoolId(''); setCategory(''); setGender(''); setSize(''); setCondition('') }
  const schoolName = schoolId ? (schools.find(s => s.id === schoolId)?.name ?? '') : ''

  return (
    <div>
      <Hero schools={schools} onPickSchool={s => setSchoolId(s.id)} />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
        <ConsignmentBand />

        <h2 id="browse" className="scroll-mt-4 text-2xl sm:text-[26px] font-extrabold tracking-tight text-gray-900 mb-4">
          {schoolName ? `Fresh from ${schoolName}` : 'Fresh listings'}
        </h2>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between sm:hidden mb-3">
            <button onClick={() => setShowFilters(!showFilters)} className="text-sm font-medium text-indigo-600">
              {showFilters ? '▲ Hide filters' : '▼ Filters'}
              {activeFilters > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center ml-1">{activeFilters}</span>
              )}
            </button>
            {activeFilters > 0 && <button onClick={clearFilters} className="text-xs text-gray-500 underline">Clear</button>}
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 ${!showFilters ? 'hidden sm:grid' : 'grid'}`}>
            <select value={schoolId} onChange={e => setSchoolId(e.target.value)} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Schools</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.state})</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={gender} onChange={e => setGender(e.target.value)} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All</option>
              {Object.entries(GENDER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={size} onChange={e => setSize(e.target.value)} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Sizes</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={condition} onChange={e => setCondition(e.target.value)} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Any Condition</option>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {activeFilters > 0 && (
            <div className="hidden sm:flex mt-3 justify-end">
              <button onClick={clearFilters} className="text-xs text-gray-500 underline hover:text-gray-700">Clear all filters</button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState schoolName={schoolName} hasFilters={activeFilters > 0} onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Hero: one headline, one search ---------------- */

function Hero({ schools, onPickSchool }: { schools: School[]; onPickSchool: (s: School) => void }) {
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const results = q.trim() ? searchSchools(schools, q).slice(0, 6) : []

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const pick = (s: School) => {
    onPickSchool(s)
    setQ(s.name)
    setFocused(false)
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="text-white bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <h1 className="text-[34px] sm:text-6xl font-black tracking-tight leading-[1.05]">
          Stop buying uniforms new.
        </h1>
        <p className="text-lg sm:text-xl mt-3 text-indigo-100 font-medium">
          Buy and sell used uniforms with families at your school.
        </p>

        <div ref={boxRef} className="relative mt-7 sm:max-w-xl">
          <input
            id="school-finder"
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={'Find your school... try "SJR" or "Bosco"'}
            autoComplete="off"
            className="w-full rounded-2xl border-0 px-5 py-4 text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/40"
          />
          {focused && results.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {results.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => pick(s)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="block text-[15px] font-bold text-gray-900 truncate">{s.name}</span>
                    <span className="block text-[13px] text-gray-500">{s.city}, {s.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-[13px] font-medium text-indigo-200">
          No fees · No shipping · Meet up locally in NJ
        </p>
      </div>
    </section>
  )
}

/* ---------------- Auto Sell: the moat, one band ---------------- */

function ConsignmentBand() {
  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-extrabold tracking-[0.18em] text-emerald-200 uppercase">Auto Sell</p>
        <p className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mt-1">You do nothing.</p>
        <p className="text-emerald-50 text-[15px] mt-1">We pick up your pile, sell it, and send you half.</p>
      </div>
      <Link href="/sell-for-me"
        className="shrink-0 text-center bg-white text-emerald-800 text-lg font-extrabold px-6 py-3.5 rounded-2xl hover:bg-emerald-50 transition-colors">
        Get a free pickup
      </Link>
    </div>
  )
}

/* ---------------- Empty state: never a dead end ---------------- */

function EmptyState({ schoolName, hasFilters, onClear }: { schoolName: string; hasFilters: boolean; onClear: () => void }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const notify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) { setState('error'); return }
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Listing waitlist',
          email: email.trim(),
          message: `Notify me when uniforms are listed${schoolName ? ` for ${schoolName}` : ''}.`,
        }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-extrabold text-gray-900">
        {schoolName ? 'Nothing here yet.' : 'No matches.'}
      </h2>

      <div className="mt-6 max-w-sm mx-auto">
        {state === 'done' ? (
          <p className="text-[15px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
            You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={notify} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
              placeholder="you@email.com"
              className="flex-1 min-w-0 rounded-2xl border-gray-300 px-4 py-3.5 text-[15px]"
              aria-label="Email for a heads-up when listings land"
            />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="shrink-0 font-bold text-[15px] px-5 py-3.5 rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {state === 'sending' ? 'Saving...' : 'Notify me'}
            </button>
          </form>
        )}
        {state === 'error' && (
          <p className="text-[13px] text-red-600 mt-2">That didn&apos;t go through. Check the email and try again.</p>
        )}
      </div>

      {hasFilters ? (
        <button onClick={onClear} className="inline-block mt-5 text-[15px] font-bold text-indigo-700 underline underline-offset-2">
          Or clear the filters
        </button>
      ) : (
        <Link href="/new" className="inline-block mt-5 text-[15px] font-bold text-indigo-700 underline underline-offset-2">
          Or be the first to sell →
        </Link>
      )}
    </div>
  )
}

/* ---------------- Card ---------------- */

function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0] || PLACEHOLDER
  const locationStr = [listing.location_city, listing.location_state].filter(Boolean).join(', ')
  const genderLabel = GENDER_LABELS[listing.gender] || listing.gender

  const conditionBadge: Record<string, string> = {
    new: 'NWT',
    good: 'Good',
    fair: 'Fair',
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={`group block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
        listing.is_verified ? 'ring-2 ring-indigo-500/70' : 'border border-gray-100'
      }`}
    >
      {/* Photo — 3:4 portrait ratio like Poshmark */}
      <div className="relative w-full" style={{ paddingBottom: '133%' }}>
        <img
          src={photo}
          alt={listing.item_type}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        />
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${
          listing.condition === 'new' ? 'bg-green-500 text-white' :
          listing.condition === 'good' ? 'bg-blue-500 text-white' :
          'bg-yellow-500 text-white'
        }`}>
          {conditionBadge[listing.condition]}
        </span>
        {listing.is_lot && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Lot
          </span>
        )}
        {listing.is_verified && (
          <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xl font-black text-gray-900 leading-tight">
          {listing.price === 0 ? 'Free' : `$${listing.price}`}
        </p>
        <p className="text-sm text-gray-800 font-medium truncate mt-1">{listing.item_type}</p>
        <p className="text-xs text-gray-500 truncate">{listing.school_name}</p>
        <p className="text-xs text-gray-400 mt-1">
          {listing.is_lot ? 'Multiple sizes' : `Size ${listing.size}`} · {genderLabel}
        </p>
        {locationStr && <p className="text-xs text-gray-400 truncate">{locationStr}</p>}
      </div>
    </Link>
  )
}
