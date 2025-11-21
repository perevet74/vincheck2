'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import LoadingScreen from '@/components/LoadingScreen'
import FreeReport from '@/components/FreeReport'
import PaidReport from '@/components/PaidReport'
import { VINFreeReport, VINFullReport } from '@/types'
import { validateVIN } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function VINCheckPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const vin = (params.vin as string)?.toUpperCase()
  const isPaid = searchParams.get('paid') === 'true'

  const [loading, setLoading] = useState(true)
  const [freeReport, setFreeReport] = useState<VINFreeReport | null>(null)
  const [fullReport, setFullReport] = useState<VINFullReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (!vin || !validateVIN(vin)) {
      setError('Invalid VIN format')
      setLoading(false)
      return
    }

    loadReport()
  }, [vin, isPaid])

  const loadReport = async () => {
    setLoading(true)
    setError(null)

    try {
      // First, get free report
      const decodeResponse = await fetch(`/api/decode?vin=${vin}`)
      if (!decodeResponse.ok) {
        const errorData = await decodeResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Failed to decode VIN (Status: ${decodeResponse.status})`)
      }
      const freeData: VINFreeReport = await decodeResponse.json()
      
      // Check if we got valid data
      if (!freeData || !freeData.basicInfo) {
        throw new Error('No vehicle data found for this VIN')
      }
      
      // Even if some fields are missing, show what we have
      setFreeReport(freeData)

      // If paid parameter is set, try to get full report
      if (isPaid) {
        try {
          const historyResponse = await fetch(`/api/history?vin=${vin}`)
          if (historyResponse.ok) {
            const fullData: VINFullReport = await historyResponse.json()
            setFullReport(fullData)
            setHasAccess(true)
          }
        } catch (err) {
          console.error('Failed to load full report:', err)
          // Continue with free report if full report fails
        }
      }

      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (err: any) {
      console.error('Error loading VIN report:', err)
      const errorMessage = err.message || 'Failed to load VIN report'
      
      // Provide more helpful error messages
      if (errorMessage.includes('fetch') || errorMessage.includes('Network') || errorMessage.includes('connect')) {
        setError('Network error: Unable to connect to the server. Please check your internet connection and try again.')
      } else if (errorMessage.includes('404') || errorMessage.includes('No data found') || errorMessage.includes('not found')) {
        setError('No data found for this VIN. Please verify the VIN is correct. Some vehicles may not be in the database.')
      } else if (errorMessage.includes('400') || errorMessage.includes('Invalid VIN format')) {
        setError('Invalid VIN format. VIN must be exactly 17 characters (no I, O, or Q).')
      } else if (errorMessage.includes('503') || errorMessage.includes('Unable to connect')) {
        setError('Service temporarily unavailable. Please try again in a few moments.')
      } else {
        setError(errorMessage || 'An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="Checking vehicle history..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!freeReport) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Data Found</CardTitle>
            <CardDescription>
              We couldn't find any information for this VIN.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {hasAccess && fullReport ? (
          <PaidReport report={fullReport} vin={vin} />
        ) : (
          <FreeReport report={freeReport} vin={vin} />
        )}
      </div>
    </div>
  )
}

