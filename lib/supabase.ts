import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type School = {
  id: string
  name: string
  city: string
  state: string
}

export type Listing = {
  id: string
  school_id: string | null
  school_name: string
  category: 'uniform' | 'sport' | 'spirit' | 'alumni'
  gender: 'boy' | 'girl' | 'unisex'
  item_type: string
  size: string
  is_lot: boolean
  condition: 'new' | 'good' | 'fair'
  price: number
  location_city: string
  location_state: string
  payment_methods: string[]
  contact_info: string | null
  contact_method: string | null
  seller_name: string
  description: string | null
  photos: string[]
  status: 'available' | 'pending' | 'sold' | 'draft'
  is_verified: boolean
  created_at: string
}

export type ContactMessage = {
  id: string
  name: string | null
  email: string | null
  message: string
  status: 'new' | 'read' | 'done'
  created_at: string
}

export type PickupRequest = {
  id: string
  name: string
  contact: string
  school_id: string | null
  school_name: string | null
  town: string | null
  item_summary: string
  est_items: number | null
  notes: string | null
  status: 'new' | 'scheduled' | 'picked_up' | 'listed' | 'done' | 'declined'
  created_at: string
}

export const SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20',
  '22', '24', '26', '28', '30', '32',
]

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

export const PAYMENT_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'cash', label: 'Cash' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'zelle', label: 'Zelle' },
]

export const CONTACT_METHODS = [
  { value: 'text', label: 'Text / Call', placeholder: 'e.g. (201) 555-0134' },
  { value: 'email', label: 'Email', placeholder: 'e.g. maria@email.com' },
  { value: 'venmo', label: 'Venmo', placeholder: 'e.g. @maria-r' },
  { value: 'other', label: 'Other', placeholder: 'e.g. Instagram @…' },
]

export const CONTACT_METHOD_LABELS: Record<string, string> = {
  text: 'Text / Call',
  email: 'Email',
  venmo: 'Venmo',
  other: 'Contact',
}

export const CONDITION_LABELS: Record<string, string> = {
  new: 'New / Never worn',
  good: 'Good condition',
  fair: 'Fair / Some wear',
}

export const CATEGORY_LABELS: Record<string, string> = {
  uniform: 'Uniform',
  sport: 'Sport',
  spirit: 'Spirit wear',
  alumni: 'Alumni',
}

export const GENDER_LABELS: Record<string, string> = {
  boy: 'Boys',
  girl: 'Girls',
  unisex: 'Unisex',
}
