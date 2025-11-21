'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { validateCameroonPhone, normalizePhone, formatCameroonPhone } from '@/lib/utils'
import { Smartphone, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LoadingScreen from './LoadingScreen'

interface MoMoPaymentButtonProps {
  amount: number
  paymentType: 'one_time' | 'subscription'
  vin?: string
  onPaymentInitiated?: () => void
  className?: string
}

export default function MoMoPaymentButton({
  amount,
  paymentType,
  vin,
  onPaymentInitiated,
  className,
}: MoMoPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const router = useRouter()

  const handleOpen = () => {
    setIsOpen(true)
    setError('')
    setPaymentStatus('idle')
    setPhoneNumber('')
  }

  const handleClose = () => {
    if (!isProcessing) {
      setIsOpen(false)
      setError('')
      setPaymentStatus('idle')
      setPhoneNumber('')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    if (value.length <= 9) {
      setPhoneNumber(value)
      setError('')
    }
  }

  const initiatePayment = async () => {
    setError('')
    
    if (!phoneNumber) {
      setError('Please enter your phone number')
      return
    }

    if (!validateCameroonPhone(phoneNumber)) {
      setError('Invalid phone number. Please enter a valid Cameroon number (6XX XXX XXX)')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('pending')
    onPaymentInitiated?.()

    try {
      const response = await fetch('/api/momo/request-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          phoneNumber: normalizePhone(phoneNumber),
          paymentType,
          vin: vin?.toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed')
      }

      setPaymentId(data.paymentId)

      // Poll for payment status
      await pollPaymentStatus(data.paymentId, data.momoRef)
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'Failed to initiate payment. Please try again.')
      setPaymentStatus('failed')
      setIsProcessing(false)
    }
  }

  const pollPaymentStatus = async (paymentId: string, momoRef: string) => {
    const maxAttempts = 30
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/momo/check-status?paymentId=${paymentId}`)
        const data = await response.json()

        if (data.status === 'completed') {
          setPaymentStatus('success')
          setIsProcessing(false)
          
          // Redirect after 2 seconds
          setTimeout(() => {
            if (paymentType === 'one_time' && vin) {
              router.push(`/check/${vin}?paid=true`)
            } else {
              router.push('/success?type=subscription')
            }
          }, 2000)
          return
        }

        if (data.status === 'failed') {
          setPaymentStatus('failed')
          setError('Payment was declined or failed. Please try again.')
          setIsProcessing(false)
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000) // Poll every 2 seconds
        } else {
          setPaymentStatus('failed')
          setError('Payment timeout. Please check your phone and try again.')
          setIsProcessing(false)
        }
      } catch (err) {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000)
        } else {
          setPaymentStatus('failed')
          setError('Error checking payment status. Please contact support.')
          setIsProcessing(false)
        }
      }
    }

    poll()
  }

  return (
    <>
      <Button onClick={handleOpen} className={className}>
        <Smartphone className="mr-2 h-4 w-4" />
        Pay with MTN MoMo
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>MTN Mobile Money Payment</DialogTitle>
            <DialogDescription>
              Enter your MTN Mobile Money number to complete the payment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="677 123 456"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={isProcessing}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your 9-digit MTN Mobile Money number
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {paymentType === 'one_time' ? 'One-Time Report' : 'Monthly Subscription'}
                </span>
                <span className="text-lg font-semibold">
                  {amount.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {paymentStatus === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Waiting for payment approval on your phone...</span>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Payment successful! Redirecting...</span>
                </div>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>Payment failed. Please try again.</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={initiatePayment}
              disabled={isProcessing || !phoneNumber || paymentStatus === 'success'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isProcessing && paymentStatus === 'pending' && (
        <LoadingScreen message="Waiting for payment approval..." showTips={false} />
      )}
    </>
  )
}

