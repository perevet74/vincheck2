import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/momo'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/momo/check-status?paymentId=XXXXX
 * Checks payment status by polling MTN MoMo API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('paymentId')
    const momoRef = searchParams.get('momoRef')

    if (!paymentId && !momoRef) {
      return NextResponse.json(
        { error: 'paymentId or momoRef is required' },
        { status: 400 }
      )
    }

    // Get payment from database
    let payment
    if (paymentId) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        )
      }
      payment = data
    } else if (momoRef) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('momo_ref', momoRef)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        )
      }
      payment = data
    }

    if (!payment || !payment.momo_ref) {
      return NextResponse.json(
        { error: 'Payment reference not found' },
        { status: 404 }
      )
    }

    // Check status from MoMo
    const status = await checkPaymentStatus(payment.momo_ref)

    // Update payment status in database if changed
    const newStatus = status.status === 'SUCCESSFUL' ? 'completed' : 
                     status.status === 'FAILED' ? 'failed' : 'pending'

    if (payment.status !== newStatus) {
      await supabase
        .from('payments')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      // Handle subscription if payment completed
      if (newStatus === 'completed' && payment.payment_type === 'subscription') {
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', payment.user_id)
          .eq('status', 'active')
          .single()

        if (existingSub) {
          await supabase
            .from('subscriptions')
            .update({
              end_date: endDate.toISOString(),
              payment_id: payment.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.id)
        } else {
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

        await supabase
          .from('users')
          .update({ subscription_status: 'active' })
          .eq('id', payment.user_id)
      }
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: newStatus,
      momoStatus: status.status,
      amount: status.amount,
      currency: status.currency,
    })
  } catch (error: any) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    )
  }
}

