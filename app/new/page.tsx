'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type School, SIZES, US_STATES, PAYMENT_OPTIONS, CONTACT_METHODS } from '@/lib/supabase'

const MAX_PHOTOS = 4
const MAX_FILE_SIZE_MB = 5
const LAST_DESC_KEY = 'uniformpass_last_description'

export default function NewListingPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [lastDescription, setLastDescription] = useState('')

  const [form, setForm] = useState({
    school_id: '',
    school_name: '',
    category: 'uniform',
    gender: 'unisex',
    item_type: '',
    size: '',
    is_lot: false,
    condition: 'good',
    price: '',
    location_city: '',
    location_state: '',
    payment_methods: [] as string[],
    contact_method: 'text',
    contact_info: '',
    seller_name: '',
    description: '',
  })

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
    // Load last description from localStorage
    const saved = localStorage.getItem(LAST_DESC_KEY)
    if (saved) setLastDescription(saved)
  }, [])

  const set = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }))

  const togglePayment = (value: string) => {
    setForm(f => ({
      ...f,
      payment_methods: f.payment_methods.includes(value)
        ? f.payment_methods.filter(v => v !== value)
        : [...f.payment_methods, value],
    }))
  }

  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId)
    setForm(f => ({ ...f, school_id: schoolId, school_name: school?.name || '' }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_PHOTOS - photoFiles.length
    const toAdd = files.slice(0, remaining).filter(f => {
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`${f.name} is too large (max ${MAX_FILE_SIZE_MB}MB)`)
        return false
      }
      return true
    })
    setPhotoFiles(prev => [...prev, ...toAdd])
    setPhotoPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => { URL.revokeObjectURL(prev[index]); return prev.filter((_, i) => i !== index) })
  }

  const buildPayload = (listingId: string, photoUrls: string[], status: string) => ({
    id: listingId,
    school_id: form.school_id,
    school_name: form.school_name,
    category: form.category,
    gender: form.gender,
    item_type: form.item_type.trim(),
    size: form.is_lot ? 'Multiple sizes' : form.size,
    is_lot: form.is_lot,
    condition: form.condition,
    price: Number(form.price) || 0,
    location_city: form.location_city.trim(),
    location_state: form.location_state,
    payment_methods: form.payment_methods,
    seller_name: form.seller_name.trim(),
    description: form.description.trim() || null,
    contact_method: form.contact_info.trim() ? form.contact_method : null,
    contact_info: form.contact_info.trim() || null,
    photos: photoUrls,
    status,
  })

  const validate = (requireLocation = true) => {
    if (!form.school_id) return 'Please select a school.'
    if (!form.item_type.trim()) return 'Please describe the item.'
    if (!form.is_lot && !form.size) return 'Please select a size, or check "Multiple sizes (lot)".'
    if (requireLocation && !form.location_city.trim()) return 'Please enter your city.'
    if (requireLocation && !form.location_state) return 'Please select a state.'
    if (!form.seller_name.trim()) return 'Please enter your name.'
    return null
  }

  const uploadPhotos = async (listingId: string) => {
    const urls: string[] = []
    for (const file of photoFiles) {
      const ext = file.name.split('.').pop()
      const path = `listings/${listingId}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('uniform-photos').upload(path, file, { contentType: file.type })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('uniform-photos').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) return setError(err)
    setSubmitting(true)
    try {
      const listingId = crypto.randomUUID()
      const photoUrls = await uploadPhotos(listingId)
      const { error: insertError } = await supabase
        .from('listings')
        .insert(buildPayload(listingId, photoUrls, 'available'))
      if (insertError) throw insertError
      // Save description for reuse
      if (form.description.trim()) localStorage.setItem(LAST_DESC_KEY, form.description.trim())
      // Create a secret manage token so the seller can edit / take down later (no account needed)
      const manageToken = crypto.randomUUID()
      const { error: tokenError } = await supabase
        .from('listing_tokens')
        .insert({ listing_id: listingId, token: manageToken })
      if (tokenError) {
        // Listing is still posted; just fall back to the public page if the token failed.
        router.push(`/listing/${listingId}`)
        return
      }
      localStorage.setItem(`uniformpass_manage_${listingId}`, manageToken)
      router.push(`/listing/${listingId}/manage?token=${manageToken}&new=1`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Post a Listing</h1>
        <p className="text-gray-500">List your uniform in under 3 minutes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Item details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">About the item</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
            <select required value={form.school_id} onChange={e => handleSchoolChange(e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select a school...</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.state})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="uniform">Uniform</option>
                <option value="sport">Sport</option>
                <option value="spirit">Spirit wear</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="unisex">Unisex</option>
                <option value="boy">Boys</option>
                <option value="girl">Girls</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item description *</label>
            <input type="text" placeholder="e.g. Navy dress pants, White polo, Gym shorts"
              value={form.item_type} onChange={e => set('item_type', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="block text-sm font-medium text-gray-700">Size *</label>
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.is_lot} onChange={e => set('is_lot', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                Multiple sizes (lot)
              </label>
            </div>
            {!form.is_lot ? (
              <select value={form.size} onChange={e => set('size', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select size...</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                Describe the sizes included in the comments below.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
            <select value={form.condition} onChange={e => set('condition', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="new">New / Never worn (NWT)</option>
              <option value="good">Good condition</option>
              <option value="fair">Fair / Some wear</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Comments <span className="text-gray-400 font-normal">(condition, stains, pickup, sizes in lot, etc.)</span>
              </label>
              {lastDescription && lastDescription !== form.description && (
                <button type="button" onClick={() => set('description', lastDescription)}
                  className="text-xs text-indigo-600 hover:underline shrink-0 ml-2">
                  Reuse last description
                </button>
              )}
            </div>
            <textarea rows={3}
              placeholder="e.g. Small stain on sleeve, only worn twice. Happy to meet at school parking lot."
              value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Photos (up to {MAX_PHOTOS})</h2>
          <div className="flex flex-wrap gap-3">
            {photoPreviews.map((src, i) => (
              <div key={i} className="relative w-24 h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black">
                  ×
                </button>
              </div>
            ))}
            {photoFiles.length < MAX_PHOTOS && (
              <label className="w-24 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl text-gray-400">+</span>
                <span className="text-xs text-gray-400 mt-1">Add photo</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400">JPG or PNG, max {MAX_FILE_SIZE_MB}MB each</p>
        </div>

        {/* Price, location, payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Price & location</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input type="number" min="0" step="0.01" placeholder="25"
              value={form.price} onChange={e => set('price', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            <p className="text-xs text-gray-400 mt-1">Enter 0 for free.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" placeholder="Montvale"
                value={form.location_city} onChange={e => set('location_city', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select value={form.location_state} onChange={e => set('location_state', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select...</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment accepted <span className="text-gray-400 font-normal">(check all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_OPTIONS.map(opt => (
                <label key={opt.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors text-sm font-medium ${
                  form.payment_methods.includes(opt.value)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}>
                  <input type="checkbox" checked={form.payment_methods.includes(opt.value)}
                    onChange={() => togglePayment(opt.value)} className="hidden" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your first name *</label>
            <input type="text" placeholder="Maria"
              value={form.seller_name} onChange={e => set('seller_name', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        {/* Contact — how buyers reach you */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-800">How buyers reach you</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Buyers contact you directly and arrange payment (cash/Venmo) in person. Nothing goes through the site.
              Listings with contact info sell much faster.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-3">
            <select value={form.contact_method} onChange={e => set('contact_method', e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              {CONTACT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <input type="text"
              placeholder={CONTACT_METHODS.find(m => m.value === form.contact_method)?.placeholder}
              value={form.contact_info} onChange={e => set('contact_info', e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <p className="text-xs text-gray-400">
            This will be shown publicly on your listing. Leave blank to only be reachable through the comments.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors text-lg">
          {submitting ? 'Posting...' : 'Post listing'}
        </button>

        <p className="text-center text-xs text-gray-400">
          No accounts, no fees. Buyers reach out directly and you meet up to complete the sale.
        </p>
      </form>
    </div>
  )
}
