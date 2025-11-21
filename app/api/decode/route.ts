import { NextRequest, NextResponse } from 'next/server'
import { validateVIN } from '@/lib/utils'
import { VINBasicInfo, VINRecall, VINFreeReport, VehiclePhoto } from '@/types'

/**
 * GET /api/decode?vin=XXXXX
 * Decodes VIN using multiple API sources with fallback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vin = searchParams.get('vin')

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

    const cleanedVin = vin.toUpperCase().trim()

    // Use NHTSA vPIC API (official, free, reliable)
    let basicInfo: VINBasicInfo | null = null
    let recalls: VINRecall[] = []

    try {
      const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${cleanedVin}?format=json`
      const response = await fetch(nhtsaUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      })

      if (!response.ok) {
        throw new Error(`NHTSA API returned status ${response.status}`)
      }

      const data = await response.json()
      
      // Check if we got any results
      if (data.Count === 0 || !data.Results || data.Results.length === 0) {
        return NextResponse.json(
          { error: 'No data found for this VIN. Please verify the VIN is correct.' },
          { status: 404 }
        )
      }

      const results = data.Results
      const getValue = (variable: string): string | null => {
        const item = results.find((r: any) => r.Variable === variable)
        return item?.Value && item.Value !== 'Not Applicable' && item.Value !== 'Not Provided' 
          ? item.Value 
          : null
      }

      // Create basic info - return even if some fields are missing
      const year = getValue('Model Year')
      const make = getValue('Make')
      const model = getValue('Model')
      
      basicInfo = {
        vin: cleanedVin,
        year,
        make,
        model,
        trim: getValue('Trim'),
        bodyClass: getValue('Body Class'),
        engineModel: getValue('Engine Model'),
        fuelType: getValue('Fuel Type - Primary'),
        plantCountry: getValue('Plant Country'),
        plantCompanyName: getValue('Plant Company Name'),
        plantState: getValue('Plant State'),
        series: getValue('Series'),
        vehicleType: getValue('Vehicle Type'),
        imageUrl: undefined, // Will be set below
      }

      // Get vehicle photos from actual records (insurance, service, etc.)
      // This requires a vehicle history API that provides photos
      const vehiclePhotos: VehiclePhoto[] = []
      
      // Try to get actual vehicle photos from VehicleDatabases or similar API
      const vehicleHistoryApiKey = process.env.VEHICLE_DATABASES_API_KEY
      
      if (vehicleHistoryApiKey) {
        try {
          //c69ea410c65f11f088300242ac120002
          const historyUrl = `https://api.vehicledatabases.com/v1/vin/${cleanedVin}/photos`
          const photosResponse = await fetch(historyUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${vehicleHistoryApiKey}`,
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000),
          })
          
          if (photosResponse.ok) {
            const photosData = await photosResponse.json()
            if (photosData.photos && Array.isArray(photosData.photos)) {
              photosData.photos.forEach((photo: any) => {
                vehiclePhotos.push({
                  url: photo.url || photo.imageUrl,
                  date: photo.date || photo.takenDate || null,
                  source: photo.source || 'other',
                  description: photo.description || photo.notes || undefined,
                  location: photo.location || undefined,
                })
              })
            }
          }
        } catch (photoError) {
          console.error('Error fetching vehicle photos:', photoError)
          // Continue without photos - not critical for free report
        }
      }
      
      // Set primary image (first photo or fallback)
      if (vehiclePhotos.length > 0) {
        basicInfo.imageUrl = vehiclePhotos[0].url
        basicInfo.photos = vehiclePhotos
      } else if (year && make && model) {
        // Fallback to generic image if no actual photos available
        try {
          const imaginApiKey = process.env.IMAGIN_API_KEY
          const vehicleType = getValue('Vehicle Type')?.toLowerCase() || ''
          
          if (imaginApiKey) {
            basicInfo.imageUrl = `https://cdn.imagin.studio/getImage?customer=${imaginApiKey}&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(model)}&modelYear=${year}&angle=01&paintId=pspc0124&paintDescription=white`
          } else {
            // Generic placeholder based on vehicle type
            if (vehicleType.includes('truck') || vehicleType.includes('pickup')) {
              basicInfo.imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80'
            } else if (vehicleType.includes('suv')) {
              basicInfo.imageUrl = 'https://images.unsplash.com/photo-1606664515524-ed4f00c0ef84?w=800&h=600&fit=crop&q=80'
            } else {
              basicInfo.imageUrl = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80'
            }
          }
        } catch (imageError) {
          console.error('Error getting vehicle image:', imageError)
          basicInfo.imageUrl = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80'
        }
      }

      // Get recalls from NHTSA (optional - don't fail if this doesn't work)
      try {
        const recallsUrl = `https://api.nhtsa.gov/recalls/recallsByVin?vin=${cleanedVin}`
        const recallsResponse = await fetch(recallsUrl, {
          signal: AbortSignal.timeout(5000),
        })
        if (recallsResponse.ok) {
          const recallsData = await recallsResponse.json()
          if (recallsData.results && Array.isArray(recallsData.results)) {
            recalls = recallsData.results.map((recall: any) => ({
              NHTSACampaignNumber: recall.NHTSACampaignNumber || '',
              Component: recall.Component || '',
              Summary: recall.Summary || '',
              Consequence: recall.Consequence || '',
              Remedy: recall.Remedy || '',
              Notes: recall.Notes || '',
              ModelYear: recall.ModelYear || '',
              Make: recall.Make || '',
              Model: recall.Model || '',
            }))
          }
        }
      } catch (recallError) {
        console.error('Error fetching recalls (non-critical):', recallError)
        // Continue without recalls - this is not critical
      }

      // Return data even if make is missing (some VINs might have partial data)
      if (!basicInfo) {
        return NextResponse.json(
          { error: 'Unable to decode VIN. Please verify the VIN is correct.' },
          { status: 404 }
        )
      }

    } catch (apiError: any) {
      console.error('Error calling NHTSA API:', apiError)
      return NextResponse.json(
        { error: 'Unable to connect to VIN database. Please check your internet connection and try again.' },
        { status: 503 }
      )
    }

    const report: VINFreeReport = {
      basicInfo,
      recalls,
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error decoding VIN:', error)
    return NextResponse.json(
      { error: 'Failed to decode VIN. Please try again later.' },
      { status: 500 }
    )
  }
}

