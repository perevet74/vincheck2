import { NextRequest, NextResponse } from 'next/server'
import { validateVIN } from '@/lib/utils'
import { VINFullReport } from '@/types'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/history?vin=XXXXX
 * Gets full VIN history report (paid)
 * This is a placeholder - replace with actual VehicleDatabases.com API call
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vin = searchParams.get('vin')
    const userId = searchParams.get('userId')

    if (!vin) {
      return NextResponse.json(
        { error: 'VIN parameter is required' },
        { status: 400 }
      )
    }

    if (!validateVIN(vin)) {
      return NextResponse.json(
        { error: 'Invalid VIN format' },
        { status: 400 }
      )
    }

    // Check if user has access (paid or subscription)
    if (userId) {
      // Check subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString())
        .single()

      // Check one-time payment for this VIN
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('vin', vin.toUpperCase())
        .eq('status', 'completed')
        .eq('payment_type', 'one_time')
        .single()

      if (!subscription && !payment) {
        return NextResponse.json(
          { error: 'Payment required to access full report' },
          { status: 403 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      )
    }

    // TODO: Replace this with actual VehicleDatabases.com API call
    // For now, return mock data structure with actual vehicle photos
    const mockReport: VINFullReport = {
      basicInfo: {
        vin: vin.toUpperCase(),
        year: '2020',
        make: 'Toyota',
        model: 'Camry',
        trim: 'LE',
        bodyClass: 'Sedan',
        engineModel: '2.5L I4',
        fuelType: 'Gasoline',
        plantCountry: 'USA',
        plantCompanyName: 'Toyota Motor Manufacturing',
        plantState: 'Kentucky',
        series: 'Camry',
        vehicleType: 'PASSENGER CAR',
        // Actual vehicle photos from records
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80',
            date: '2024-01-15',
            source: 'insurance',
            description: 'Insurance inspection photo',
            location: 'Douala, Cameroon',
          },
          {
            url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
            date: '2023-06-20',
            source: 'service',
            description: 'Service center inspection',
            location: 'Yaoundé, Cameroon',
          },
        ],
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80',
      },
      recalls: [],
      hasAccidents: true,
      accidents: [
        {
          date: '2022-05-15',
          severity: 'moderate',
          description: 'Rear-end collision',
          location: 'Douala, Cameroon',
        },
      ],
      hasSalvageTitle: false,
      titleBrands: [],
      hasTheftRecord: false,
      theftDate: null,
      multipleOwners: true,
      ownerCount: 3,
      ownershipHistory: [
        {
          ownerNumber: 1,
          purchaseDate: '2020-01-15',
          saleDate: '2021-08-20',
          ownerType: 'personal',
          location: 'Yaoundé, Cameroon',
        },
        {
          ownerNumber: 2,
          purchaseDate: '2021-08-20',
          saleDate: '2023-03-10',
          ownerType: 'commercial',
          location: 'Douala, Cameroon',
        },
        {
          ownerNumber: 3,
          purchaseDate: '2023-03-10',
          saleDate: null,
          ownerType: 'personal',
          location: 'Buea, Cameroon',
        },
      ],
      odometerReading: 45000,
      odometerStatus: 'normal',
      serviceHistory: [
        {
          date: '2020-06-01',
          mileage: 5000,
          serviceType: 'Oil Change',
          description: 'Regular maintenance',
        },
        {
          date: '2021-01-15',
          mileage: 15000,
          serviceType: 'Full Service',
          description: 'Oil change, tire rotation, inspection',
        },
      ],
      estimatedValue: 8500000,
      valueCurrency: 'XAF',
      lastSeenDate: '2024-01-15',
      registrationStatus: 'active',
    }

    // Save to database
    if (userId) {
      await supabase.from('vin_checks').insert({
        vin: vin.toUpperCase(),
        user_id: userId,
        report_type: 'paid',
        report_data: mockReport,
      })
    }

    return NextResponse.json(mockReport)
  } catch (error) {
    console.error('Error fetching VIN history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch VIN history' },
      { status: 500 }
    )
  }
}

