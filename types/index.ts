// VIN Data Types
export interface NHTSADecodeResponse {
  Count: number
  Message: string
  SearchCriteria: string
  Results: Array<{
    Variable: string
    Value: string | null
    ValueId?: string
    VariableId: number
  }>
}

export interface VehiclePhoto {
  url: string
  date: string | null
  source: 'insurance' | 'service' | 'inspection' | 'accident' | 'auction' | 'dealer' | 'other'
  description?: string
  location?: string
}

export interface VINBasicInfo {
  vin: string
  year: string | null
  make: string | null
  model: string | null
  trim: string | null
  bodyClass: string | null
  engineModel: string | null
  fuelType: string | null
  plantCountry: string | null
  plantCompanyName: string | null
  plantState: string | null
  series: string | null
  vehicleType: string | null
  imageUrl?: string // Main/primary image
  photos?: VehiclePhoto[] // Array of actual vehicle photos from records
}

export interface VINRecall {
  NHTSACampaignNumber: string
  Component: string
  Summary: string
  Consequence: string
  Remedy: string
  Notes: string
  ModelYear: string
  Make: string
  Model: string
}

export interface VINFreeReport {
  basicInfo: VINBasicInfo
  recalls: VINRecall[]
}

// Full History Report Types (VehicleDatabases placeholder)
export interface AccidentRecord {
  date: string
  severity: 'minor' | 'moderate' | 'severe' | 'totaled'
  description: string
  location: string
}

export interface OwnershipRecord {
  ownerNumber: number
  purchaseDate: string
  saleDate: string | null
  ownerType: 'personal' | 'commercial' | 'fleet' | 'rental'
  location: string
}

export interface TitleBrand {
  type: 'salvage' | 'flood' | 'fire' | 'theft' | 'rebuilt' | 'hail' | 'lemon'
  date: string
  state: string
}

export interface ServiceRecord {
  date: string
  mileage: number
  serviceType: string
  description: string
}

export interface VINFullReport {
  basicInfo: VINBasicInfo
  recalls: VINRecall[]
  // Red flags
  hasAccidents: boolean
  accidents: AccidentRecord[]
  hasSalvageTitle: boolean
  titleBrands: TitleBrand[]
  hasTheftRecord: boolean
  theftDate: string | null
  multipleOwners: boolean
  ownerCount: number
  ownershipHistory: OwnershipRecord[]
  // Odometer
  odometerReading: number | null
  odometerStatus: 'normal' | 'rollback' | 'inconsistent' | 'unknown'
  // Service
  serviceHistory: ServiceRecord[]
  // Market value
  estimatedValue: number | null
  valueCurrency: string
  // Additional
  lastSeenDate: string | null
  registrationStatus: 'active' | 'expired' | 'suspended' | 'unknown'
}

// Payment Types
export interface MoMoPaymentRequest {
  amount: string // MTN MoMo API expects amount as string
  currency: string
  externalId: string
  payer: {
    partyIdType: string
    partyId: string
  }
  payerMessage: string
  payeeNote: string
}

export interface MoMoPaymentResponse {
  financialTransactionId: string
  externalId: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED'
}

export interface MoMoPaymentStatus {
  amount: number
  currency: string
  financialTransactionId: string
  externalId: string
  payer: {
    partyId: string
    partyIdType: string
  }
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED'
  reason?: {
    code: string
    message: string
  }
}

// Payment Flow Types
export interface PaymentOption {
  type: 'one_time' | 'subscription'
  amount: number
  currency: string
  label: string
  description: string
}

export interface PaymentSession {
  paymentId: string
  momoRef: string | null
  status: 'pending' | 'completed' | 'failed'
  paymentType: 'one_time' | 'subscription'
  vin?: string
}

