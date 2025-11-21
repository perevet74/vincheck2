# camVIN - Vehicle VIN Check Website

A complete, production-ready vehicle VIN check website for the African market (especially Cameroon) with MTN Mobile Money integration.

## Features

- **Free VIN Decoding**: Basic vehicle information using NHTSA API
- **Full History Reports**: Complete vehicle history including accidents, ownership, title brands, and more
- **MTN Mobile Money Payments**: Seamless payment integration with MTN MoMo
- **Two Payment Options**:
  - One-time report: 500 FCFA
  - Monthly subscription: 7,500 FCFA (unlimited reports)
- **PDF Downloads**: Generate and download full reports as PDF
- **Beautiful UI**: Modern, mobile-first design optimized for Android phones
- **Loading Animations**: Engaging car animation with rotating tips
- **Comprehensive Landing Page**: Educational content, testimonials, and FAQ

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Payment**: MTN Mobile Money Collection API v4.1
- **VIN APIs**: 
  - NHTSA vPIC API (free basic decoding)
  - VehicleDatabases.com API (paid full history - placeholder implementation)
- **PDF Generation**: @react-pdf/renderer

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- MTN Mobile Money Developer account
- (Optional) VehicleDatabases.com API key for full history reports

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
# or
yarn install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file:
   ```bash
   # Copy contents of supabase/migrations/001_initial_schema.sql
   # Paste and execute in Supabase SQL Editor
   ```
3. Get your project URL and anon key from Settings > API

### 3. Configure MTN Mobile Money

1. Sign up at [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Create a new app/product
3. Get your subscription key, API user, and API key
4. For sandbox testing, use the sandbox environment
5. For production, switch to production environment

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MTN MoMo
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your_momo_subscription_key
MOMO_API_USER=your_momo_api_user
MOMO_API_KEY=your_momo_api_key
MOMO_TARGET_ENVIRONMENT=sandbox

# App URL (for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── page.tsx                 # Home page
│   ├── check/[vin]/page.tsx     # VIN report page
│   ├── success/page.tsx         # Payment success page
│   ├── api/                      # API routes
│   │   ├── decode/route.ts      # NHTSA free decode
│   │   ├── history/route.ts     # Full history (placeholder)
│   │   └── momo/                # MTN MoMo endpoints
│   └── layout.tsx
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── HeroSection.tsx
│   ├── WhyVINSection.tsx
│   ├── UsesSection.tsx
│   ├── Testimonials.tsx
│   ├── FAQSection.tsx
│   ├── VINForm.tsx
│   ├── LoadingScreen.tsx
│   ├── FreeReport.tsx
│   ├── PaidReport.tsx
│   ├── PricingCards.tsx
│   └── MoMoPaymentButton.tsx
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── momo.ts                  # MTN MoMo integration
│   ├── utils.ts                 # Utility functions
│   └── pdf.ts                   # PDF generation
├── types/
│   └── index.ts                 # TypeScript types
└── supabase/
    └── migrations/              # Database migrations
```

## API Configuration

### NHTSA API (Free)
No API key required. The free VIN decoding uses the public NHTSA vPIC API.

### VehicleDatabases.com (Paid - Placeholder)
Currently using mock data. To integrate:
1. Sign up at VehicleDatabases.com
2. Get your API key
3. Update `app/api/history/route.ts` with actual API calls
4. Add `VEHICLE_DATABASES_API_KEY` to `.env.local`

### MTN Mobile Money Webhook
For production, configure webhook URL in MTN MoMo Developer Portal:
```
https://yourdomain.com/api/momo/callback
```

## Customization

### Tips Array
Edit the `VIN_TIPS` array in `components/LoadingScreen.tsx`:

```typescript
const VIN_TIPS = [
  "Your custom tip 1",
  "Your custom tip 2",
  // Add more tips...
]
```

### Car Animation
The car animation uses CSS keyframes defined in `tailwind.config.ts`. To customize:
1. Edit the `car-drive` keyframe animation
2. Modify the SVG car icon in `components/LoadingScreen.tsx`

### Branding
- Update colors in `app/globals.css` (CSS variables)
- Change logo/brand name in `app/layout.tsx` and throughout components
- Update footer information in `app/page.tsx`

### Payment Amounts
Edit amounts in:
- `components/PricingCards.tsx` (display)
- `app/api/momo/request-payment/route.ts` (validation)

## Database Schema

The application uses four main tables:

- **users**: User accounts with phone numbers and subscription status
- **vin_checks**: History of VIN checks performed
- **payments**: Payment records with MTN MoMo references
- **subscriptions**: Active user subscriptions

See `supabase/migrations/001_initial_schema.sql` for full schema.

## Payment Flow

1. User enters VIN → Redirects to `/check/[vin]`
2. Free report displayed with blurred sections
3. User selects payment option (one-time or subscription)
4. MTN MoMo payment initiated
5. Payment status polled every 2 seconds
6. On success → Full report unlocked
7. PDF download available

## Production Deployment

### Environment Variables
Update all environment variables for production:
- Use production MTN MoMo API URL
- Set `MOMO_TARGET_ENVIRONMENT=production`
- Update `NEXT_PUBLIC_APP_URL` to your domain

### Build
```bash
npm run build
npm start
```

### Recommended Hosting
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Self-hosted with Node.js

## Troubleshooting

### MTN MoMo Payment Issues
- Verify API credentials in MTN Developer Portal
- Check webhook URL is accessible
- Ensure phone number format is correct (6XX XXX XXX)
- Test in sandbox mode first

### Supabase Connection Issues
- Verify project URL and anon key
- Check database migrations are applied
- Ensure RLS (Row Level Security) policies allow access

### VIN Decoding Fails
- Verify VIN format (17 characters, no I/O/Q)
- Check NHTSA API is accessible
- Some VINs may not have data in NHTSA database

## Support

For issues or questions:
- Email: support@camairvin.com
- Check FAQ section on homepage
- Review API documentation for MTN MoMo and NHTSA

## License

This project is proprietary. All rights reserved.

## Contributing

This is a private project. For internal contributions, follow the existing code style and structure.

---

**Built with ❤️ for the African market**

