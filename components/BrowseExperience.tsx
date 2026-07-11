'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, type Listing, type School, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, SIZES } from '@/lib/supabase'
import { getTheme, themeForSchoolId, themeForSchoolName, scopedPath, SCHOOL_CODES, SCHOOL_THEMES, type SchoolTheme } from '@/lib/schoolTheme'
import { searchSchools } from '@/lib/schoolSearch'
import { priceSlash } from '@/lib/retailPrices'
import MonogramPatch from '@/components/MonogramPatch'
import SharePanel from '@/components/SharePanel'

const PLACEHOLDER = 'https://placehold.co/400x533/e8e8f0/9999bb?text=No+photo'

// The browse experience, school-aware. A scoped arrival (/s/sjr or /?school=sjr)
// re-dresses the hero to that school and pre-filters the grid. Unscoped arrival
// leads with ONE decision: find your school.

export default function BrowseExperience({ schoolCode }: { schoolCode?: string | null }) {
  const theme = getTheme(schoolCode)

  const [listings, setListings] = useState<Listing[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  const [schoolId, setSchoolId] = useState(theme?.dbId ?? '')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [liveCount, setLiveCount] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [])

  // Belt and suspenders: if the hardcoded school id ever drifts from the DB,
  // re-resolve it by name once the school list loads.
  useEffect(() => {
    if (!theme || schools.length === 0) return
    if (schools.some(s => s.id === schoolId)) return
    const match = schools.find(s => themeForSchoolName(s.name)?.code === theme.code)
    if (match) setSchoolId(match.id)
  }, [theme, schools, schoolId])

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

  // The hero's live proof number: this school's full available count,
  // independent of any extra filters below.
  useEffect(() => {
    if (!theme || !schoolId) return
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'available')
      .eq('school_id', schoolId)
      .then(({ count }) => setLiveCount(count ?? 0))
  }, [theme, schoolId])

  const extraFilters = [category, gender, size, condition].filter(Boolean).length
  const activeFilters = (theme ? 0 : (schoolId ? 1 : 0)) + extraFilters
  const clearFilters = () => {
    if (!theme) setSchoolId('')
    setCategory(''); setGender(''); setSize(''); setCondition('')
  }

  return (
    <div>
      {theme ? (
        <ScopedHero theme={theme} schoolId={schoolId} liveCount={liveCount} />
      ) : (
        <UnscopedHero schools={schools} onPickSchool={s => { setSchoolId(s.id) }} />
      )}

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
        <ConsignmentBand />

        {/* Grid heading */}
        <h2 id="browse" className="scroll-mt-4 text-2xl sm:text-[26px] font-extrabold tracking-tight text-gray-900 mb-4">
          {theme ? `Fresh from ${theme.shortName} families` : 'Browse uniforms'}
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

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${theme ? 'md:grid-cols-4' : 'md:grid-cols-5'} gap-3 ${!showFilters ? 'hidden sm:grid' : 'grid'}`}>
            {!theme && (
              <select value={schoolId} onChange={e => setSchoolId(e.target.value)} className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">All Schools</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.state})</option>)}
              </select>
            )}
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
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme ? theme.primary : '#6366F1', borderTopColor: 'transparent' }} />
          </div>
        ) : listings.length === 0 ? (
          theme && extraFilters === 0 ? (
            <ColdStart theme={theme} />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                {theme ? `No ${theme.shortName} matches for those filters.` : 'No matches for those filters.'}
              </h2>
              <p className="text-gray-500 mb-6">Loosen a filter or two... new items land all the time.</p>
              <button onClick={clearFilters} className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-black transition-colors">
                Clear filters
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Scoped hero: the arrival moment ---------------- */

function ScopedHero({ theme, schoolId, liveCount }: { theme: SchoolTheme; schoolId: string; liveCount: number | null }) {
  return (
    <section
      className="school-wash text-white"
      style={{ background: `linear-gradient(160deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` }}
    >
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-8 sm:pb-14">
        {/* Exit the focused school view */}
        <div className="flex justify-end mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            ← All schools
          </Link>
        </div>

        {/* Identity row: MINE + LOCAL in one glance */}
        <div className="flex items-center gap-3.5">
          <MonogramPatch theme={theme} size={72} />
          <div className="flex-1 min-w-0">
            <p className="text-lg sm:text-xl font-extrabold leading-tight">{theme.fullName}</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: theme.accent }}>
              {theme.town} · {theme.mascot} families
            </p>
          </div>
          <SharePanel
            kind="school"
            theme={theme}
            buttonClassName="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-full bg-white/15 border border-white/35 text-white hover:bg-white/25 transition-colors shrink-0"
          />
        </div>

        <h1 className="text-[34px] sm:text-6xl font-black tracking-tight leading-[1.05] mt-6 max-w-3xl">
          The {theme.shortName} uniform exchange.
        </h1>
        <p className="text-lg sm:text-xl mt-3 text-white/90 font-medium max-w-2xl">
          Skip the $80 uniform. Buy and sell with {theme.shortName} families near you.
        </p>

        {/* Live proof, huge, in the school's accent */}
        {liveCount !== null && liveCount >= 3 && (
          <p className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span className="text-6xl sm:text-7xl font-black leading-none tabular-nums" style={{ color: theme.accent }}>
              {liveCount}
            </span>
            <span className="text-lg sm:text-xl font-bold text-white/95">
              {theme.shortName} uniforms listed right now
            </span>
          </p>
        )}

        {/* One obvious next tap (and its mirror) */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:max-w-2xl">
          <a
            href="#browse"
            className="flex-1 text-center bg-white font-extrabold text-lg px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            style={{ color: theme.primaryDark }}
          >
            Shop {theme.shortName} uniforms
          </a>
          <Link
            href={`/sell-for-me${schoolId ? `?school_id=${schoolId}` : ''}`}
            className="flex-1 text-center font-extrabold text-lg px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            style={{ background: theme.accent, color: theme.accentInk }}
          >
            Sell your pile, keep 50%
          </Link>
        </div>

        <p className="mt-5 text-[13px] font-medium text-white/75">
          No fees · No shipping · Meet up locally in NJ
        </p>
      </div>
    </section>
  )
}

/* ---------------- Unscoped hero: find your school ---------------- */

function UnscopedHero({ schools, onPickSchool }: { schools: School[]; onPickSchool: (s: School) => void }) {
  const router = useRouter()
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
    const t = themeForSchoolId(s.id) || themeForSchoolName(s.name)
    if (t) {
      router.push(scopedPath(t.code))
      return
    }
    onPickSchool(s)
    setQ(s.name)
    setFocused(false)
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="text-white bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <h1 className="text-[34px] sm:text-6xl font-black tracking-tight leading-[1.05]">
          Skip the $80 uniform.
        </h1>
        <p className="text-lg sm:text-xl mt-3 text-indigo-100 font-medium">
          Buy and sell used uniforms with families at your school.
        </p>

        {/* THE one hero action */}
        <div ref={boxRef} className="relative mt-7 sm:max-w-xl">
          <label htmlFor="school-finder" className="block text-[13px] font-bold uppercase tracking-wider text-indigo-200 mb-2">
            Find your school
          </label>
          <input
            id="school-finder"
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={'Try "SJR", "Bosco", "Bergen"...'}
            autoComplete="off"
            className="w-full rounded-2xl border-0 px-5 py-4 text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/40"
          />
          {focused && results.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {results.map(s => {
                const t = themeForSchoolId(s.id) || themeForSchoolName(s.name)
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => pick(s)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      {t ? (
                        <MonogramPatch theme={t} size={36} />
                      ) : (
                        <span className="w-9 h-9 rounded-lg bg-gray-200 shrink-0" />
                      )}
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-gray-900 truncate">{s.name}</span>
                        <span className="block text-[13px] text-gray-500">{s.city}, {s.state}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* The 3 beachhead schools, one tap each... plus everyone else */}
        <div className="grid grid-cols-3 gap-3 mt-5 sm:max-w-xl">
          {SCHOOL_CODES.map(code => {
            const t = SCHOOL_THEMES[code]
            return (
              <Link
                key={code}
                href={scopedPath(code)}
                className="flex flex-col items-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 hover:bg-white/20 transition-colors"
              >
                <MonogramPatch theme={t} size={48} />
                <span className="text-[13px] font-bold text-center leading-tight px-1">{t.shortName}</span>
              </Link>
            )
          })}
        </div>
        <p className="mt-3 text-[13px] font-semibold text-indigo-200 sm:max-w-xl">
          + 40 more NJ schools... search yours above.
        </p>

        <p className="mt-6 text-[13px] font-medium text-indigo-200">
          No fees · No shipping · Meet up locally in NJ
        </p>
      </div>
    </section>
  )
}

/* ---------------- Cold start: never a dead grid ---------------- */

function ColdStart({ theme }: { theme: SchoolTheme }) {
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
          name: `${theme.shortName} waitlist`,
          email: email.trim(),
          message: `Notify me when ${theme.shortName} uniforms are listed. (school waitlist: ${theme.code})`,
        }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="rounded-3xl px-6 py-10 sm:px-12 sm:py-14 text-center" style={{ background: theme.wash }}>
      <div className="flex justify-center">
        <MonogramPatch theme={theme} size={64} />
      </div>
      <h2 className="text-[26px] sm:text-4xl font-black tracking-tight leading-tight mt-5" style={{ color: theme.ink }}>
        {theme.shortName} uniforms are just getting started here.
      </h2>
      <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-md mx-auto">
        Be the first family in... or get a ping the moment {theme.shortName} gear lands.
      </p>

      <div className="mt-7 max-w-sm mx-auto space-y-3">
        <Link
          href="/new"
          className="block w-full text-center text-white font-extrabold text-lg px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background: theme.primary }}
        >
          Be the first to sell
        </Link>

        {state === 'done' ? (
          <p className="text-[15px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
            You&apos;re on the list. We&apos;ll email you when {theme.shortName} uniforms are listed.
          </p>
        ) : (
          <form onSubmit={notify} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
              placeholder="you@email.com"
              className="flex-1 min-w-0 rounded-2xl border-gray-300 px-4 py-3.5 text-[15px] focus:ring-2"
              aria-label="Email for a heads-up when listings land"
            />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="shrink-0 font-bold text-[15px] px-5 py-3.5 rounded-2xl border-2 disabled:opacity-50 transition-colors"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              {state === 'sending' ? 'Saving...' : 'Notify me'}
            </button>
          </form>
        )}
        {state === 'error' && (
          <p className="text-[13px] text-red-600">That didn&apos;t go through. Check the email and try again.</p>
        )}
      </div>

      <p className="text-[15px] text-gray-600 mt-8 max-w-md mx-auto">
        Got a whole pile? We pick it up and sell it for you... you keep 50%.{' '}
        <Link href="/sell-for-me" className="font-bold underline underline-offset-2" style={{ color: theme.ink }}>
          Get a free pickup
        </Link>
      </p>
    </div>
  )
}

/* ---------------- Shared pieces ---------------- */

// The concierge service, named: White Glove. Lead with the do-nothing promise.
function ConsignmentBand() {
  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-extrabold tracking-[0.18em] text-emerald-200 uppercase">White Glove</p>
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

function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0] || PLACEHOLDER
  const locationStr = [listing.location_city, listing.location_state].filter(Boolean).join(', ')
  const genderLabel = GENDER_LABELS[listing.gender] || listing.gender
  const slash = priceSlash(listing.price, listing.item_type, listing.category)

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
        {/* Condition badge top-left */}
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
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <p className="text-xl font-black text-gray-900 leading-tight">
            {listing.price === 0 ? 'Free' : `$${listing.price}`}
          </p>
          {slash && (
            <span className="text-sm text-gray-400 line-through">${slash.retail}</span>
          )}
        </div>
        {slash && (
          <span className="inline-block mt-1 bg-green-600 text-white text-[13px] font-bold px-2 py-0.5 rounded-full">
            You save ${slash.save}
          </span>
        )}
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
