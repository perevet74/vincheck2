import { NextRequest, NextResponse } from 'next/server'
import { requestPayment } from '@/lib/momo'
import { validateCameroonPhone, normalizePhone, generatePaymentExternalId } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/momo/request-payment
 * Initiates MTN Mobile Money payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phoneNumber, paymentType, vin, userId } = body

    // Validation
    if (!amount || !phoneNumber || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, phoneNumber, paymentType' },
        { status: 400 }
      )
    }

    if (!validateCameroonPhone(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid Cameroon phone number format' },
        { status: 400 }
      )
    }

    if (!['one_time', 'subscription'].includes(paymentType)) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    // Validate amounts
    const validAmounts = paymentType === 'one_time' ? 500 : 7500
    if (amount !== validAmounts) {
      return NextResponse.json(
        { error: `Invalid amount. Expected ${validAmounts} FCFA for ${paymentType}` },
        { status: 400 }
      )
    }

    // Normalize phone number
    const normalizedPhone = normalizePhone(phoneNumber)

    // Get or create user
    let user
    if (userId) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      user = data
    }

    if (!user) {
      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          phone: normalizedPhone,
          subscription_status: 'inactive',
        })
        .select()
        .single()

      if (userError) {
        // User might already exist, try to fetch
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('phone', normalizedPhone)
          .single()
        
        if (!existingUser) {
          throw new Error('Failed to create user')
        }
        user = existingUser
      } else {
        user = newUser
      }
    }

    // Generate external ID
    const externalId = generatePaymentExternalId('VIN')

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount,
        momo_ref: externalId,
        status: 'pending',
        payment_type: paymentType,
        vin: vin ? vin.toUpperCase() : null,
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error('Failed to create payment record')
    }

    // Initiate MoMo payment
    try {
      await requestPayment(
        amount,
        normalizedPhone,
        externalId,
        paymentType === 'one_time' 
          ? `VIN Check Report - ${vin || 'N/A'}` 
          : 'camVIN Monthly Subscription',
        'camVIN Payment'
      )

      return NextResponse.json({
        paymentId: payment.id,
        momoRef: externalId,
        status: 'pending',
        message: 'Payment request initiated. Please approve on your phone.',
      })
    } catch (momoError: any) {
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id)

      return NextResponse.json(
        { error: `Payment initiation failed: ${momoError.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error requesting payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}

