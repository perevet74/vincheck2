'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentType, setPaymentType] = useState<'one_time' | 'subscription'>('one_time')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'subscription') {
      setPaymentType('subscription')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            {paymentType === 'subscription'
              ? 'Your monthly subscription is now active. You can check unlimited VINs!'
              : 'Your payment has been processed successfully.'}
          </p>
        </div>

        <div className="space-y-4">
          {paymentType === 'subscription' ? (
            <Button
              onClick={() => router.push('/')}
              className="w-full"
              size="lg"
            >
              Start Checking VINs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/')}
              className="w-full"
              size="lg"
            >
              Check Another VIN
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

