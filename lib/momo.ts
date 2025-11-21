import { MoMoPaymentRequest, MoMoPaymentResponse, MoMoPaymentStatus } from '@/types'

// MTN MoMo API Configuration
const MOMO_API_BASE_URL = process.env.MOMO_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'
const MOMO_SUBSCRIPTION_KEY = process.env.MOMO_SUBSCRIPTION_KEY || ''
const MOMO_API_USER = process.env.MOMO_API_USER || ''
const MOMO_API_KEY = process.env.MOMO_API_KEY || ''
const MOMO_TARGET_ENVIRONMENT = process.env.MOMO_TARGET_ENVIRONMENT || 'sandbox'

/**
 * Gets MTN MoMo API token for authentication
 */
export async function getMoMoToken(): Promise<string> {
  const url = `${MOMO_API_BASE_URL}/collection/token/`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': MOMO_SUBSCRIPTION_KEY,
      'Authorization': `Basic ${Buffer.from(`${MOMO_API_USER}:${MOMO_API_KEY}`).toString('base64')}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get MoMo token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Initiates a payment request (RequestToPay)
 */
export async function requestPayment(
  amount: number,
  phoneNumber: string,
  externalId: string,
  payerMessage: string = 'VIN Check Payment',
  payeeNote: string = 'camVIN Report'
): Promise<MoMoPaymentResponse> {
  const token = await getMoMoToken()
  
  const requestBody: MoMoPaymentRequest = {
    amount: amount.toString(),
    currency: 'XAF',
    externalId,
    payer: {
      partyIdType: 'MSISDN',
      partyId: phoneNumber,
    },
    payerMessage,
    payeeNote,
  }

  const url = `${MOMO_API_BASE_URL}/collection/v1_0/requesttopay`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Target-Environment': MOMO_TARGET_ENVIRONMENT,
      'X-Reference-Id': externalId,
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': MOMO_SUBSCRIPTION_KEY,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to request payment: ${error}`)
  }

  // RequestToPay returns 202 Accepted, we need to poll for status
  return {
    financialTransactionId: externalId,
    externalId,
    status: 'PENDING',
  }
}

/**
 * Checks payment status
 */
export async function checkPaymentStatus(
  externalId: string
): Promise<MoMoPaymentStatus> {
  const token = await getMoMoToken()
  
  const url = `${MOMO_API_BASE_URL}/collection/v1_0/requesttopay/${externalId}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Target-Environment': MOMO_TARGET_ENVIRONMENT,
      'Ocp-Apim-Subscription-Key': MOMO_SUBSCRIPTION_KEY,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to check payment status: ${error}`)
  }

  const data = await response.json()
  
  return {
    amount: parseFloat(data.amount),
    currency: data.currency,
    financialTransactionId: data.financialTransactionId,
    externalId: data.externalId,
    payer: {
      partyId: data.payer.partyId,
      partyIdType: data.payer.partyIdType,
    },
    status: data.status,
    reason: data.reason || undefined,
  }
}

/**
 * Polls payment status until completion or timeout
 */
export async function pollPaymentStatus(
  externalId: string,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<MoMoPaymentStatus> {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      const status = await checkPaymentStatus(externalId)
      
      if (status.status === 'SUCCESSFUL' || status.status === 'FAILED') {
        return status
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, intervalMs))
      attempts++
    } catch (error) {
      // If error, wait and retry
      await new Promise(resolve => setTimeout(resolve, intervalMs))
      attempts++
      
      if (attempts >= maxAttempts) {
        throw error
      }
    }
  }
  
  // Timeout - return pending status
  return {
    amount: 0,
    currency: 'XAF',
    financialTransactionId: externalId,
    externalId,
    payer: {
      partyId: '',
      partyIdType: 'MSISDN',
    },
    status: 'PENDING',
    reason: {
      code: 'TIMEOUT',
      message: 'Payment status check timed out',
    },
  }
}

/**
 * Validates webhook callback signature (if MTN provides one)
 * For now, we'll validate the callback data structure
 */
export function validateMoMoCallback(data: any): boolean {
  return (
    data &&
    typeof data === 'object' &&
    'externalId' in data &&
    'status' in data &&
    ['PENDING', 'SUCCESSFUL', 'FAILED'].includes(data.status)
  )
}

