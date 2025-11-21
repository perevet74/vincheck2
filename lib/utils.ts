import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates a VIN (Vehicle Identification Number)
 * VIN must be exactly 17 characters, alphanumeric (excluding I, O, Q)
 */
export function validateVIN(vin: string): boolean {
  if (!vin) return false
  
  // Remove spaces and convert to uppercase
  const cleaned = vin.trim().toUpperCase()
  
  // Must be exactly 17 characters
  if (cleaned.length !== 17) return false
  
  // Must be alphanumeric (excluding I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/
  return vinRegex.test(cleaned)
}

/**
 * Formats a VIN for display (adds spaces for readability)
 */
export function formatVIN(vin: string): string {
  const cleaned = vin.trim().toUpperCase()
  // Add space every 5 characters for readability
  return cleaned.replace(/(.{5})/g, '$1 ').trim()
}

/**
 * Validates Cameroon phone number
 * Format: 6xx xxx xxx or 6xxxxxxxxx (9 digits starting with 6)
 */
export function validateCameroonPhone(phone: string): boolean {
  if (!phone) return false
  
  // Remove spaces, dashes, and plus signs
  const cleaned = phone.replace(/[\s\-+]/g, '')
  
  // Must be 9 digits starting with 6
  const phoneRegex = /^6\d{8}$/
  return phoneRegex.test(cleaned)
}

/**
 * Formats Cameroon phone number for display
 * Input: 677123456 or 677 123 456
 * Output: 677 123 456
 */
export function formatCameroonPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-+]/g, '')
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Normalizes phone number for API calls (removes formatting)
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+]/g, '')
}

/**
 * Formats currency (FCFA)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-CM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Formats date and time for display
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-CM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Generates a unique external ID for payment
 */
export function generatePaymentExternalId(prefix: string = 'VIN'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Extracts VIN from URL or string
 */
export function extractVIN(input: string): string | null {
  const cleaned = input.trim().toUpperCase()
  if (validateVIN(cleaned)) {
    return cleaned
  }
  return null
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Checks if user has active subscription
 */
export function isSubscriptionActive(endDate: string): boolean {
  return new Date(endDate) > new Date()
}

/**
 * Gets days remaining in subscription
 */
export function getSubscriptionDaysRemaining(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

