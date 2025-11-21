# Vehicle Photos Setup Guide

This guide explains how to set up actual vehicle photos from insurance and service records.

## Overview

The system is designed to display **actual photos** of the specific vehicle taken by:
- Insurance companies
- Service centers
- Inspection stations
- Accident reports
- Auction houses
- Dealerships

These photos show when and where the vehicle was last seen, building user confidence.

## Current Implementation

### Free Report
- Shows vehicle photos if available from API
- Displays photo metadata (date, source, location)
- Encourages users to unlock full report for more photos

### Paid Report
- Shows all available vehicle photos
- Full metadata for each photo
- Organized gallery view

## API Integration Required

To get **actual vehicle photos**, you need to integrate with a vehicle history API that provides photos:

### Option 1: VehicleDatabases.com (Recommended)
- Provides actual vehicle photos from records
- Photos from insurance, service, inspection records
- Includes metadata (date, location, source)

**Setup:**
1. Sign up at [vehicledatabases.com](https://vehicledatabases.com)
2. Get API key
3. Add to `.env.local`:
   ```env
   VEHICLE_DATABASES_API_KEY=your-api-key-here
   ```

**Update `app/api/decode/route.ts`:**
The code already includes integration for VehicleDatabases API. Just add your API key.

### Option 2: VINData API
- Provides vehicle photos and history
- [vindata.com](https://vindata.com)

### Option 3: VinAudit API
- Vehicle photos and specifications
- [vinaudit.com](https://www.vinaudit.com)

## Photo Data Structure

Each photo includes:
```typescript
{
  url: string              // Photo URL
  date: string | null      // When photo was taken
  source: 'insurance' | 'service' | 'inspection' | 'accident' | 'auction' | 'dealer' | 'other'
  description?: string     // Optional description
  location?: string        // Where photo was taken
}
```

## How It Works

1. **User enters VIN**
2. **System fetches vehicle data** from NHTSA
3. **If API key exists**, fetches actual photos from VehicleDatabases
4. **Displays photos** with metadata:
   - Date taken
   - Source (insurance, service, etc.)
   - Location
   - Description

## Current Status

### Without API Key:
- Shows generic vehicle image (placeholder)
- Still shows vehicle information
- Encourages subscription for actual photos

### With API Key:
- Fetches actual vehicle photos
- Shows photos from insurance/service records
- Displays when and where photos were taken
- Builds user confidence

## Example API Integration

### VehicleDatabases.com API Call:
```typescript
const response = await fetch(
  `https://api.vehicledatabases.com/v1/vin/${vin}/photos`,
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    }
  }
)

const data = await response.json()
// Returns array of photos with metadata
```

## Display Features

### Photo Gallery
- Grid layout (responsive)
- Hover effects
- Photo metadata overlay
- Source badges (Insurance, Service, etc.)
- Date and location information

### User Benefits
- ✅ See actual vehicle photos
- ✅ Verify it's their vehicle
- ✅ See when photos were taken
- ✅ Know source (insurance, service, etc.)
- ✅ Build confidence to subscribe

## Next Steps

1. **Sign up for VehicleDatabases.com** (or similar service)
2. **Get API key**
3. **Add to `.env.local`**:
   ```env
   VEHICLE_DATABASES_API_KEY=your-key-here
   ```
4. **Restart dev server**
5. **Test with a VIN** - photos should appear automatically

## Troubleshooting

### No Photos Showing
- ✅ Check API key is correct
- ✅ Verify API key is in `.env.local`
- ✅ Restart dev server after adding key
- ✅ Check API service is working
- ✅ Some VINs may not have photos available

### Photos Not Loading
- ✅ Check image URLs are valid
- ✅ Verify CORS settings
- ✅ Check network connection
- ✅ Fallback images will show if photos fail

## Cost Considerations

Most vehicle history APIs with photos are **paid services**:
- VehicleDatabases.com: Pay-per-request or subscription
- VINData: Subscription plans
- VinAudit: Pay-per-report

**Recommendation:** Start with VehicleDatabases.com as it's mentioned in your codebase.

---

**The infrastructure is ready!** Just add your API key and actual vehicle photos will appear automatically.

