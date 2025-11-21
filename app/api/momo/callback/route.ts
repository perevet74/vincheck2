import { NextRequest, NextResponse } from 'next/server'
import { validateMoMoCallback, checkPaymentStatus } from '@/lib/momo'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/momo/callback
 * Webhook endpoint for MTN MoMo payment callbacks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!validateMoMoCallback(body)) {
      return NextResponse.json(
        { error: 'Invalid callback data' },
        { status: 400 }
      )
    }

    const { externalId, status } = body

    // Find payment by momo_ref
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('momo_ref', externalId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', externalId)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Update payment status
    const newStatus = status === 'SUCCESSFUL' ? 'completed' : 
                     status === 'FAILED' ? 'failed' : 'pending'

    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updateError) {
      throw new Error('Failed to update payment status')
    }

    // If subscription payment completed, create/update subscription
    if (newStatus === 'completed' && payment.payment_type === 'subscription') {
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // 1 month subscription

      // Check if user has existing subscription
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', payment.user_id)
        .eq('status', 'active')
        .single()

      if (existingSub) {
        // Extend existing subscription
        await supabase
          .from('subscriptions')
          .update({
            end_date: endDate.toISOString(),
            payment_id: payment.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSub.id)
      } else {
        // Create new subscription
        if (!payment.user_id) {
          throw new Error('Payment user_id is required for subscription')
        }
        await supabase
          .from('subscriptions')
          .insert({
            user_id: payment.user_id,
            end_date: endDate.toISOString(),
            status: 'active',
            payment_id: payment.id,
          })
      }

      // Update user subscription status
      await supabase
        .from('users')
        .update({ subscription_status: 'active' })
        .eq('id', payment.user_id)
    }

    return NextResponse.json({ 
      success: true,
      paymentId: payment.id,
      status: newStatus,
    })
  } catch (error: any) {
    console.error('Error processing callback:', error)
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    )
  }
}

