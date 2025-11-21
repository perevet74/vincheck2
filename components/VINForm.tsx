'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateVIN, formatVIN } from '@/lib/utils'
import { Search, AlertCircle } from 'lucide-react'

export default function VINForm() {
  const [vin, setVin] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const cleaned = vin.trim().toUpperCase()

    if (!cleaned) {
      setError('Please enter a VIN')
      return
    }

    if (!validateVIN(cleaned)) {
      setError('Invalid VIN format. VIN must be 17 characters (excluding I, O, Q)')
      return
    }

    setIsLoading(true)
    router.push(`/check/${cleaned}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')
    if (value.length <= 17) {
      setVin(value)
      setError('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter 17-digit VIN (e.g., 1HGBH41JXMN109186)"
            value={vin}
            onChange={handleChange}
            className="h-12 text-lg text-gray-900 dark:text-gray-100"
            maxLength={17}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            'Checking...'
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Check VIN
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      {vin && !error && (
        <p className="mt-2 text-sm text-muted-foreground">
          Formatted: {formatVIN(vin)}
        </p>
      )}
    </form>
  )
}

