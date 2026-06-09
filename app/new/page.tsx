'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type School, SIZES } from '@/lib/supabase'

const MAX_PHOTOS = 4
const MAX_FILE_SIZE_MB = 5

export default function NewListingPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const [form, setForm] = useState({
    school_id: '',
    school_name: '',
    category: 'uniform',
    gender: 'unisex',
    item_type: '',
    size: '',
    condition: 'good',
    price: '',
    location_city: '',
    contact_method: 'email',
    contact_info: '',
    seller_name: '',
    description: '',
  })

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [])

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId)
    set('school_id', schoolId)
    set('school_name', school?.name || '')
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
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.school_id) return setError('Please select a school.')
    if (!form.item_type.trim()) return setError('Please enter the item type.')
    if (!form.size) return setError('Please enter a size.')
    if (!form.price || Number(form.price) <= 0) return setError('Please enter a valid price.')
    if (!form.location_city.trim()) return setError('Please enter your city.')
    if (!form.contact_info.trim()) return setError('Please enter contact info.')
    if (!form.seller_name.trim()) return setError('Please enter your name.')

    setSubmitting(true)

    try {
      // Upload photos
      const photoUrls: string[] = []
      const listingId = crypto.randomUUID()

      for (const file of photoFiles) {
        const ext = file.name.split('.').pop()
        const path = `listings/${listingId}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('uniform-photos')
          .upload(path, file, { contentType: file.type })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('uniform-photos')
          .getPublicUrl(path)

        photoUrls.push(urlData.publicUrl)
      }

      // Insert listing
      const { data, error: insertError } = await supabase
        .from('listings')
        .insert({
          id: listingId,
          school_id: form.school_id,
          school_name: form.school_name,
          category: form.category,
          gender: form.gender,
          item_type: form.item_type.trim(),
          size: form.size,
          condition: form.condition,
          price: Number(form.price),
          location_city: form.location_city.trim(),
          contact_method: form.contact_method,
          contact_info: form.contact_info.trim(),
          seller_name: form.seller_name.trim(),
          description: form.description.trim() || null,
          photos: photoUrls,
          status: 'active',
        })
        .select()
        .single()

      if (insertError) throw insertError
      router.push(`/listing/${data.id}`)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
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
        {/* School */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">About the item</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
            <select
              required
              value={form.school_id}
              onChange={e => handleSchoolChange(e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a school...</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="uniform">Uniform</option>
                <option value="sport">Sport</option>
                <option value="spirit">Spirit wear</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">For *</label>
              <select
                value={form.gender}
                onChange={e => set('gender', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="unisex">Unisex</option>
                <option value="boy">Boys</option>
                <option value="girl">Girls</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item type *</label>
            <input
              type="text"
              placeholder="e.g. Navy dress pants, White polo, Gym shorts"
              value={form.item_type}
              onChange={e => set('item_type', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
              <select
                value={form.size}
                onChange={e => set('size', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select size...</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
              <select
                value={form.condition}
                onChange={e => set('condition', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="new">New / Never worn</option>
                <option value="good">Good condition</option>
                <option value="fair">Fair / Some wear</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Any details about the item..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Photos (up to {MAX_PHOTOS})</h2>

          <div className="flex flex-wrap gap-3">
            {photoPreviews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black"
                >
                  ×
                </button>
              </div>
            ))}
            {photoFiles.length < MAX_PHOTOS && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl text-gray-400">+</span>
                <span className="text-xs text-gray-400 mt-1">Add photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400">JPG or PNG, max {MAX_FILE_SIZE_MB}MB each</p>
        </div>

        {/* Pricing & Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Price & contact</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="25"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your city *</label>
              <input
                type="text"
                placeholder="Montvale"
                value={form.location_city}
                onChange={e => set('location_city', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact method *</label>
            <select
              value={form.contact_method}
              onChange={e => set('contact_method', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="email">Email</option>
              <option value="venmo">Venmo</option>
              <option value="zelle">Zelle</option>
              <option value="cash">Cash only (pickup)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {form.contact_method === 'email' ? 'Email address' :
               form.contact_method === 'venmo' ? 'Venmo handle (@...)' :
               form.contact_method === 'zelle' ? 'Zelle phone/email' :
               'Pickup instructions'} *
            </label>
            <input
              type="text"
              placeholder={
                form.contact_method === 'email' ? 'you@example.com' :
                form.contact_method === 'venmo' ? '@yourhandle' :
                form.contact_method === 'zelle' ? '555-555-5555' :
                'Contact to arrange pickup'
              }
              value={form.contact_info}
              onChange={e => set('contact_info', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your first name *</label>
            <input
              type="text"
              placeholder="Maria"
              value={form.seller_name}
              onChange={e => set('seller_name', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {submitting ? 'Posting...' : 'Post listing'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Your contact info will be visible to buyers. Never share passwords or sensitive info.
        </p>
      </form>
    </div>
  )
}
