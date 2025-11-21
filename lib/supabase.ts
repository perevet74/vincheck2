import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build, env vars might not be available - create a placeholder client
  // This will fail at runtime if env vars are missing, but won't break the build
  if (!supabaseUrl || !supabaseAnonKey) {
    // Check if we're likely in a build context (no env vars)
    // Create a minimal client that will error when used, but won't break build
    supabaseClient = createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
    )
    return supabaseClient
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Export a proxy that lazily initializes the client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient()
    const value = client[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})

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

