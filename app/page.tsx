'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase, type Listing, type School, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, SIZES } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/400x300/e8e8f0/9999bb?text=No+photo'

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
      .eq('status', 'active')
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

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const activeFilters = [schoolId, category, gender, size, condition].filter(Boolean).length
  const clearFilters = () => {
    setSchoolId(''); setCategory(''); setGender(''); setSize(''); setCondition('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">School Uniform Marketplace</h1>
        <p className="text-gray-500">Buy and sell private school uniforms — directly with other families.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between sm:hidden mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm font-medium text-indigo-600 flex items-center gap-1"
          >
            {showFilters ? '▲ Hide filters' : '▼ Show filters'}
            {activeFilters > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="text-xs text-gray-500 underline">Clear</button>
          )}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 ${!showFilters ? 'hidden sm:grid' : 'grid'}`}>
          <select
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Schools</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.state})</option>
            ))}
          </select>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All</option>
            {Object.entries(GENDER_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={size}
            onChange={e => setSize(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Sizes</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any Condition</option>
            {Object.entries(CONDITION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {activeFilters > 0 && (
          <div className="hidden sm:flex mt-3 justify-end">
            <button onClick={clearFilters} className="text-xs text-gray-500 underline hover:text-gray-700">
              Clear all filters
            </button>
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
          <p className="text-gray-500 mb-6">
            {activeFilters > 0 ? 'Try adjusting your filters.' : 'Be the first to post a listing!'}
          </p>
          <Link href="/new" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
            Post a listing
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0] || PLACEHOLDER
  const conditionColors: Record<string, string> = {
    new: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    fair: 'bg-yellow-100 text-yellow-700',
  }
  const locationStr = [listing.location_city, listing.location_state].filter(Boolean).join(', ')
  const genderLabel = GENDER_LABELS[listing.gender] || listing.gender

  return (
    <Link href={`/listing/${listing.id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        <img
          src={photo}
          alt={listing.item_type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        />
        <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${conditionColors[listing.condition]}`}>
          {listing.condition === 'new' ? 'New' : listing.condition === 'good' ? 'Good' : 'Fair'}
        </span>
        {listing.is_lot && (
          <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            Lot
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 truncate">{listing.school_name}</p>
        <p className="font-semibold text-gray-900 truncate">{listing.item_type}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {listing.is_lot ? 'Multiple sizes' : `Size ${listing.size}`} · {genderLabel}
          {locationStr ? ` · ${locationStr}` : ''}
        </p>
        <p className="font-bold text-indigo-700 mt-1">
          {listing.price === 0 ? 'Free' : `$${listing.price}`}
        </p>
      </div>
    </Link>
  )
}
