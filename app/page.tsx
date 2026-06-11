'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase, type Listing, type School, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, SIZES } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/400x533/e8e8f0/9999bb?text=No+photo'

export default function BrowsePage() {
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
      .in('status', ['available', 'pending'])
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">School Uniform Marketplace</h1>
        <p className="text-gray-500">Buy and sell private school uniforms directly with other families.</p>
      </div>

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
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h2>
          <p className="text-gray-500 mb-6">{activeFilters > 0 ? 'Try adjusting your filters.' : 'Be the first to post!'}</p>
          <Link href="/new" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">Post a listing</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        </>
      )}
    </div>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0] || PLACEHOLDER
  const isPending = listing.status === 'pending'
  const locationStr = [listing.location_city, listing.location_state].filter(Boolean).join(', ')
  const genderLabel = GENDER_LABELS[listing.gender] || listing.gender

  const conditionBadge: Record<string, string> = {
    new: 'NWT',
    good: 'Good',
    fair: 'Fair',
  }

  return (
    <Link href={`/listing/${listing.id}`} className="group block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
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
        {/* Status badges */}
        {isPending && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Pending
          </span>
        )}
        {listing.is_lot && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Lot
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-lg font-bold text-gray-900 leading-tight">
          {listing.price === 0 ? 'Free' : `$${listing.price}`}
        </p>
        <p className="text-sm text-gray-800 font-medium truncate mt-0.5">{listing.item_type}</p>
        <p className="text-xs text-gray-500 truncate">{listing.school_name}</p>
        <p className="text-xs text-gray-400 mt-1">
          {listing.is_lot ? 'Multiple sizes' : `Size ${listing.size}`} · {genderLabel}
        </p>
        {locationStr && <p className="text-xs text-gray-400 truncate">{locationStr}</p>}
      </div>
    </Link>
  )
}
