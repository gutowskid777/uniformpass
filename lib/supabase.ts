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
  condition: 'new' | 'good' | 'fair'
  price: number
  location_city: string
  contact_method: 'email' | 'venmo' | 'zelle' | 'cash'
  contact_info: string
  seller_name: string
  description: string | null
  photos: string[]
  status: 'active' | 'sold'
  created_at: string
}

export const SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20',
  '22', '24', '26', '28', '30', '32',
]

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

export const CONTACT_LABELS: Record<string, string> = {
  email: 'Email',
  venmo: 'Venmo',
  zelle: 'Zelle',
  cash: 'Cash only',
}
