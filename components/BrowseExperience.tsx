'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, type Listing, type School, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, SIZES } from '@/lib/supabase'
import { searchSchools } from '@/lib/schoolSearch'
import VerifiedBadge from '@/components/VerifiedBadge'

const PLACEHOLDER = 'https://placehold.co/400x533/e8e8f0/9999bb?text=No+photo'

// One simple marketplace. Hero -> Auto Sell -> grid. Search picks your school
// and filters the grid in place. (Per-school themed sections are archived in
// docs/archive/school-sections-2026-07-11 if we ever bring them back.)

export default function BrowseExperience() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  const [schoolId, setSchoolId] = useState(() => searchParams.get('school') || '')
  const [category, setCategory] = useState(() => searchParams.get('category') || '')
  const [gender, setGender] = useState(() => searchParams.get('gender') || '')
  const [size, setSize] = useState(() => searchParams.get('size') || '')
  const [condition, setCondition] = useState(() => searchParams.get('condition') || '')
  const [search, setSearch] = useState(() => searchParams.get('q') || '')
  const [item, setItem] = useState(() => searchParams.get('item') || '')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setSchoolId(searchParams.get('school') || '')
    setCategory(searchParams.get('category') || '')
    setGender(searchParams.get('gender') || '')
    setSize(searchParams.get('size') || '')
    setCondition(searchParams.get('condition') || '')
    setSearch(searchParams.get('q') || '')
    setItem(searchParams.get('item') || '')
  }, [searchParams])

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    const query = params.toString()
    router.replace(query ? `/?${query}` : '/', { scroll: false })
  }

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

    // A school view also surfaces generic basics (plain, no-logo items that fit any school).
    if (schoolId) query = query.or(`school_id.eq.${schoolId},is_generic.eq.true`)
    if (category) query = query.eq('category', category)
    if (gender) query = query.eq('gender', gender)
    if (size) query = query.eq('size', size)
    if (condition) query = query.eq('condition', condition)

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }, [schoolId, category, gender, size, condition])

  useEffect(() => { fetchListings() }, [fetchListings])

  const activeFilters = [category, gender, size, condition, item.trim()].filter(Boolean).length
  const clearFilters = () => {
    setCategory(''); setGender(''); setSize(''); setCondition(''); setItem('')
    updateUrl({ category: '', gender: '', size: '', condition: '', item: '' })
  }
  const clearSchool = () => {
    setSchoolId(''); setSearch('')
    updateUrl({ school: '', q: '' })
  }
  const schoolName = schoolId ? (schools.find(s => s.id === schoolId)?.name ?? '') : ''

  const itemQuery = item.trim().toLowerCase()
  const visible = itemQuery
    ? listings.filter(l => `${l.item_type} ${l.description ?? ''}`.toLowerCase().includes(itemQuery))
    : listings

  return (
    <div>
      <Hero
        schools={schools}
        query={search}
        onQueryChange={value => { setSearch(value); updateUrl({ q: value }) }}
        onPickSchool={s => {
          setSchoolId(s.id)
          setSearch(s.name)
          updateUrl({ school: s.id, q: s.name })
        }}
      />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
        <SellDoors />

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 id="browse" className="scroll-mt-4 text-2xl sm:text-[26px] font-extrabold tracking-tight text-gray-900">
            {schoolName ? `Fresh from ${schoolName}` : 'Fresh listings'}
          </h2>
          {schoolName && (
            <button onClick={clearSchool} className="shrink-0 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 hover:bg-indigo-100 transition-colors">
              ✕ All schools
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-6 shadow-sm">
          {/* Search stays OUT of the collapse on mobile. Burying it behind a
              "Filters" toggle hid the one control a buyer came to use. */}
          <div className="flex items-center gap-2 sm:hidden">
            <input
              type="search"
              value={item}
              onChange={e => { setItem(e.target.value); updateUrl({ item: e.target.value }) }}
              placeholder="Search items"
              className="flex-1 min-w-0 rounded-lg border-gray-300 text-sm placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Search items"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                activeFilters > 0 ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-600'
              }`}
            >
              Filters
              {activeFilters > 0 && (
                <span className="bg-indigo-600 text-white text-[11px] font-bold rounded-full w-[18px] h-[18px] inline-flex items-center justify-center">{activeFilters}</span>
              )}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2"
                className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
              </svg>
            </button>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3 mt-3 sm:mt-0 ${!showFilters ? 'hidden sm:grid' : 'grid'}`}>
            <input
              type="search"
              value={item}
              onChange={e => { setItem(e.target.value); updateUrl({ item: e.target.value }) }}
              placeholder="Search items"
              className="hidden sm:block rounded-lg border-gray-300 text-sm placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Search items"
            />
            <select value={category} onChange={e => { setCategory(e.target.value); updateUrl({ category: e.target.value }) }} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={gender} onChange={e => { setGender(e.target.value); updateUrl({ gender: e.target.value }) }} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All</option>
              {Object.entries(GENDER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={size} onChange={e => { setSize(e.target.value); updateUrl({ size: e.target.value }) }} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Sizes</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={condition} onChange={e => { setCondition(e.target.value); updateUrl({ condition: e.target.value }) }} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Any Condition</option>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {activeFilters > 0 && (
            <div className="flex mt-3 justify-end">
              <button onClick={clearFilters} className="text-xs text-gray-500 underline hover:text-gray-700">Clear all filters</button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState schoolName={schoolName} hasFilters={activeFilters > 0} onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {visible.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Hero: one headline, one search ---------------- */

function Hero({ schools, query, onQueryChange, onPickSchool }: {
  schools: School[]
  query: string
  onQueryChange: (value: string) => void
  onPickSchool: (s: School) => void
}) {
  const [focused, setFocused] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const results = query.trim() ? searchSchools(schools, query).slice(0, 6) : []

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const pick = (s: School) => {
    onPickSchool(s)
    setFocused(false)
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="text-white bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        <h1 className="text-[30px] sm:text-6xl font-black tracking-tight leading-[1.05]">
          Turn uniforms into cash.
        </h1>
        <p className="text-[15px] sm:text-xl mt-2.5 sm:mt-3 text-indigo-100 font-medium">
          Buy and sell used uniforms with families at your school.
        </p>

        <div ref={boxRef} className="relative mt-7 sm:max-w-xl">
          <input
            id="school-finder"
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={'Find your school'}
            autoComplete="off"
            className="w-full rounded-2xl border-0 px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/40"
          />
          {focused && query.trim() && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {results.length > 0 ? (
                <ul>
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
              ) : (
                <div className="px-4 py-4">
                  <p className="text-[15px] font-bold text-gray-900">No match for &ldquo;{query.trim()}&rdquo; yet.</p>
                  <p className="text-[13px] text-gray-500 mt-1">Leave your email and we&apos;ll add it.</p>
                  <div className="mt-3">
                    <NotifyForm topic={query.trim()} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-[13px] font-medium text-indigo-200">
          No fees · No shipping · Meet locally
        </p>
      </div>
    </section>
  )
}

/* ---------------- Two doors: we sell it, or you do ---------------- */

function SellDoors() {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
      <div className="sm:col-span-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 ring-1 ring-white/25 shrink-0">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="#FDE68A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="26" height="14" rx="2.5" /><circle cx="16" cy="16" r="4" /><path d="M7.5 13v6M24.5 13v6" />
              </svg>
            </span>
            <h2 className="text-[26px] sm:text-4xl font-black tracking-tight leading-none">Auto&nbsp;Sell</h2>
          </div>
          <p className="text-emerald-50 text-[14px] sm:text-base mt-2 sm:mt-2.5 font-medium">
            You do nothing. We pick up your pile, sell it, and send you half.
          </p>
        </div>
        <Link href="/sell-for-me"
          className="shrink-0 text-center bg-white text-emerald-800 text-base sm:text-lg font-extrabold px-6 py-3 sm:py-3.5 rounded-2xl hover:bg-emerald-50 transition-colors">
          Get a free pickup
        </Link>
      </div>

      {/* Same anatomy as the band above: icon chip + wordmark, one line of copy,
          white CTA. Only the axis changes, because this column is 1/4 wide. */}
      <Link href="/new"
        className="sm:col-span-1 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-800 text-white px-6 py-6 sm:py-7 flex flex-col gap-5 hover:from-indigo-600 hover:to-indigo-800 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 ring-1 ring-white/25 shrink-0">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="#C7D2FE" strokeWidth="2.8" strokeLinecap="round">
                <path d="M16 7v18M7 16h18" />
              </svg>
            </span>
            <h2 className="text-[26px] sm:text-[23px] font-black tracking-tight leading-none">List it yourself</h2>
          </div>
          <p className="text-indigo-100 text-[14px] sm:text-[15px] mt-2 sm:mt-2.5 font-medium">
            Post it in two minutes.
          </p>
        </div>
        <div className="shrink-0 text-center bg-white text-indigo-800 text-base sm:text-lg font-extrabold px-6 py-3 sm:py-3.5 rounded-2xl">
          Post an item
        </div>
      </Link>
    </div>
  )
}

/* ---------------- Notify: no automated alerts, a person reads these ---------------- */

function NotifyForm({ topic }: { topic: string }) {
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
          message: `Notify me when uniforms are listed${topic ? ` for ${topic}` : ''}.`,
        }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="text-[15px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
        Got it. We&apos;ll email you when one lands.
      </p>
    )
  }

  return (
    <>
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
      {state === 'error' && (
        <p className="text-[13px] text-red-600 mt-2">That didn&apos;t go through. Check the email and try again.</p>
      )}
    </>
  )
}

/* ---------------- Empty state: never a dead end ---------------- */

function EmptyState({ schoolName, hasFilters, onClear }: { schoolName: string; hasFilters: boolean; onClear: () => void }) {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {schoolName ? `No matches for these filters at ${schoolName}.` : 'No matches for these filters.'}
        </h2>
        <button onClick={onClear} className="inline-block mt-5 text-[15px] font-bold text-indigo-700 underline underline-offset-2">
          Clear the filters
        </button>
      </div>
    )
  }

  return (
    <div className="py-14 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-extrabold text-gray-900">
        {schoolName ? `Be the first to sell for ${schoolName}.` : 'Be the first to sell.'}
      </h2>

      <Link href="/new"
        className="inline-block mt-5 bg-indigo-600 text-white text-base sm:text-lg font-extrabold px-6 py-3 sm:py-3.5 rounded-2xl hover:bg-indigo-700 transition-colors">
        Post an item
      </Link>

      <p className="mt-4 text-[15px] text-gray-500 font-medium">
        Or let us do it:{' '}
        <Link href="/sell-for-me" className="font-bold text-emerald-700 underline underline-offset-2">get a free pickup</Link>
      </p>

      <div className="mt-10 pt-8 border-t border-gray-200">
        <p className="text-[15px] text-gray-600 font-medium">Just looking to buy?</p>
        <div className="mt-3">
          <NotifyForm topic={schoolName} />
        </div>
      </div>
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
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
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
          <span className="absolute bottom-2 right-2"><VerifiedBadge compact /></span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xl font-black text-gray-900 leading-tight">
          {listing.price === 0 ? 'Free' : `$${listing.price}`}
        </p>
        <p className="text-sm text-gray-800 font-medium truncate mt-1">{listing.item_type}</p>
        {listing.is_generic
          ? <p className="text-xs font-semibold text-emerald-700 truncate">Basics · fits any school</p>
          : <p className="text-xs text-gray-500 truncate">{listing.school_name}</p>}
        <p className="text-xs text-gray-400 mt-1">
          {listing.is_lot ? 'Multiple sizes' : `Size ${listing.size}`} · {genderLabel}
        </p>
        {locationStr && <p className="text-xs text-gray-400 truncate">{locationStr}</p>}
      </div>
    </Link>
  )
}
