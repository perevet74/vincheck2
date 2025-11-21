import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string | null
  phone: string
  subscription_status: 'active' | 'inactive' | 'expired'
  created_at: string
  updated_at: string
}

export interface VINCheck {
  id: string
  vin: string
  user_id: string | null
  report_type: 'free' | 'paid'
  report_data: any
  created_at: string
}

export interface Payment {
  id: string
  user_id: string | null
  amount: number
  momo_ref: string | null
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  payment_type: 'one_time' | 'subscription'
  vin: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  start_date: string
  end_date: string
  status: 'active' | 'expired' | 'cancelled'
  payment_id: string | null
  created_at: string
  updated_at: string
}

