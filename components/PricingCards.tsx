'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Check, Zap } from 'lucide-react'
import MoMoPaymentButton from './MoMoPaymentButton'

interface PricingCardsProps {
  vin?: string
  onPaymentInitiated?: (paymentType: 'one_time' | 'subscription') => void
}

export default function PricingCards({ vin, onPaymentInitiated }: PricingCardsProps) {
  const oneTimeFeatures = [
    'Full vehicle history report',
    'Accident records',
    'Ownership history',
    'Title brand checks',
    'Odometer verification',
    'Service records',
    'PDF download',
  ]

  const subscriptionFeatures = [
    'Everything in one-time report',
    'Unlimited VIN checks',
    'No per-report fees',
    'Priority support',
    'Monthly email summaries',
    'Bulk check discounts',
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* One-Time Payment */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-2xl">One-Time Report</CardTitle>
          <CardDescription>Perfect for single vehicle checks</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{formatCurrency(500)}</span>
            <span className="text-muted-foreground ml-2">one-time</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {oneTimeFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <MoMoPaymentButton
            amount={500}
            paymentType="one_time"
            vin={vin}
            onPaymentInitiated={() => onPaymentInitiated?.('one_time')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="relative border-blue-600 border-2">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Best Value
          </span>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Monthly Subscription</CardTitle>
          <CardDescription>Unlimited reports for dealers & importers</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{formatCurrency(7500)}</span>
            <span className="text-muted-foreground ml-2">per month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {subscriptionFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <MoMoPaymentButton
            amount={7500}
            paymentType="subscription"
            onPaymentInitiated={() => onPaymentInitiated?.('subscription')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          />
        </CardContent>
      </Card>
    </div>
  )
}

