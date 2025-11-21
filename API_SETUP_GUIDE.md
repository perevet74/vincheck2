# API Setup Guide for camVIN

This guide will walk you through setting up all the APIs and services needed for your VIN check website to function properly.

## Overview: APIs Required

You need to connect to **3 main services** (plus 1 optional):

1. ✅ **NHTSA API** (Free - No setup required)
2. ✅ **Supabase** (Database - Required)
3. ✅ **MTN Mobile Money API** (Payment Processing - Required)
4. ⚠️ **VehicleDatabases.com API** (Optional - Currently using mock data)

---

## 1. NHTSA API (Free VIN Decoding)

**Status:** ✅ Already configured - No setup needed!

**What it does:**
- Provides basic vehicle information (make, model, year, etc.)
- Provides safety recall information
- Completely free and public

**API Endpoints Used:**
- `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}?format=json`
- `https://api.nhtsa.gov/recalls/recallsByVin?vin={vin}`

**Setup Steps:**
- ✅ **No setup required!** The API is already integrated and working.
- No API key needed
- No registration required
- Works immediately

**Note:** This API only provides basic vehicle information. For full history (accidents, ownership, etc.), you'll need the optional VehicleDatabases.com API.

---

## 2. Supabase (Database)

**Status:** ⚠️ Requires setup

**What it does:**
- Stores user accounts
- Stores payment records
- Stores subscription information
- Stores VIN check history

### Step-by-Step Setup:

#### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

#### Step 2: Create a New Project
1. Click **"New Project"** button
2. Fill in the project details:
   - **Name:** `camvin` (or your preferred name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users (e.g., `West US` for Africa)
   - **Pricing Plan:** Select **Free** tier (sufficient for starting)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be provisioned

#### Step 3: Get Your API Credentials
1. Once project is ready, go to **Settings** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL:** Copy this (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key:** Copy this (long string starting with `eyJ...`)
4. Save both values - you'll need them for environment variables

#### Step 4: Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file: `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the **entire contents** of that file
5. Paste into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"
8. Verify tables were created:
   - Go to **Table Editor** (left sidebar)
   - You should see 4 tables: `users`, `vin_checks`, `payments`, `subscriptions`

#### Step 5: Configure Row Level Security (RLS)
1. Go to **Authentication** → **Policies** (left sidebar)
2. For each table (`users`, `vin_checks`, `payments`, `subscriptions`):
   - Click on the table name
   - Enable RLS if not already enabled
   - For development, you can temporarily disable RLS or create permissive policies
   - **Recommended for production:** Create policies that allow:
     - Users to read their own data
     - Service role to insert/update (for server-side operations)

**Quick RLS Setup (Development):**
```sql
-- Allow all operations for development (NOT for production!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE vin_checks DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
```

**Production RLS Setup:**
Create proper policies based on your security requirements.

#### Step 6: Add Environment Variables
Create or update `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**✅ Supabase Setup Complete!**

---

## 3. MTN Mobile Money API (Payment Processing)

**Status:** ⚠️ Requires setup

**What it does:**
- Processes payments via MTN Mobile Money
- Handles one-time payments (500 FCFA)
- Handles monthly subscriptions (7,500 FCFA)

### Step-by-Step Setup:

#### Step 1: Create MTN MoMo Developer Account
1. Go to [https://momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Click **"Sign Up"** or **"Register"**
3. Fill in your details:
   - Business/Company name
   - Email address
   - Phone number
   - Country (Cameroon)
4. Verify your email and phone number
5. Complete business verification (may require documents)

#### Step 2: Create a Product/App
1. Log in to MTN MoMo Developer Portal
2. Go to **"Products"** or **"My Apps"**
3. Click **"Create Product"** or **"New App"**
4. Fill in product details:
   - **Product Name:** `camVIN VIN Check Service`
   - **Description:** `Vehicle VIN history check service`
   - **Environment:** Start with **Sandbox** for testing
5. Submit and wait for approval (can take 1-3 business days)

#### Step 3: Get API Credentials
Once your product is approved:

1. Go to your product dashboard
2. Navigate to **"API Keys"** or **"Credentials"**
3. You'll need:
   - **Subscription Key (Primary):** Copy this
   - **API User:** Usually provided or you create one
   - **API Key:** Generate or copy this
   - **Target Environment:** `sandbox` (for testing) or `production` (for live)

#### Step 4: Create API User (if needed)
1. In your product dashboard, go to **"API Users"**
2. Click **"Create API User"**
3. Fill in:
   - **Provider Callback Host:** Your domain (e.g., `https://yourdomain.com`)
   - For local testing: Use a service like [ngrok](https://ngrok.com) to expose localhost
4. Save the API User ID

#### Step 5: Generate API Key
1. Still in API Users section
2. Find your API User
3. Click **"Generate API Key"**
4. **IMPORTANT:** Copy and save this key immediately - you won't see it again!
5. If you lose it, you'll need to generate a new one

#### Step 6: Set Up Webhook (for Production)
1. In your product settings, find **"Webhooks"** or **"Callbacks"**
2. Add webhook URL:
   ```
   https://yourdomain.com/api/momo/callback
   ```
3. For local testing with ngrok:
   ```
   https://your-ngrok-url.ngrok.io/api/momo/callback
   ```

#### Step 7: Test in Sandbox
1. MTN provides sandbox test numbers
2. Use these numbers to test payments:
   - Check MTN Developer Portal for test phone numbers
   - Usually in format: `46733123456` (sandbox test number)

#### Step 8: Add Environment Variables
Add to your `.env.local` file:

```env
# MTN Mobile Money
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-subscription-key-here
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here
MOMO_TARGET_ENVIRONMENT=sandbox

# For production, change to:
# MOMO_API_BASE_URL=https://momodeveloper.mtn.com
# MOMO_TARGET_ENVIRONMENT=production
```

#### Step 9: Test Payment Flow
1. Start your development server: `npm run dev`
2. Navigate to your website
3. Enter a VIN and try to make a payment
4. Use sandbox test phone number
5. Check MTN Developer Portal for payment status

**⚠️ Important Notes:**
- **Sandbox:** Free testing, no real money
- **Production:** Requires additional approval and verification
- **Webhook:** Must be publicly accessible (use ngrok for local testing)
- **Phone Format:** Use format `46733123456` (country code + number, no spaces)

**✅ MTN MoMo Setup Complete!**

---

## 4. VehicleDatabases.com API (Optional - Full History)

**Status:** ⚠️ Optional - Currently using mock data

**What it does:**
- Provides full vehicle history (accidents, ownership, title brands, etc.)
- Currently the app uses mock data for this

### Step-by-Step Setup (If you want real data):

#### Step 1: Sign Up
1. Go to [https://www.vehicledatabases.com](https://www.vehicledatabases.com)
2. Click **"Sign Up"** or **"Get API Key"**
3. Create an account
4. Choose a pricing plan (usually pay-per-request or monthly)

#### Step 2: Get API Key
1. After signup, go to **"API"** or **"Developer"** section
2. Generate or copy your API key
3. Note the API endpoint URL

#### Step 3: Update Code
1. Open `app/api/history/route.ts`
2. Replace the mock data section with actual API calls
3. Example integration:
```typescript
const response = await fetch(`https://api.vehicledatabases.com/v1/vin/${vin}`, {
  headers: {
    'Authorization': `Bearer ${process.env.VEHICLE_DATABASES_API_KEY}`,
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
// Process and return data
```

#### Step 4: Add Environment Variable
Add to `.env.local`:
```env
VEHICLE_DATABASES_API_KEY=your-api-key-here
```

**Note:** You can continue using mock data for development and add this later when ready for production.

---

## Complete Environment Variables File

Create a `.env.local` file in your project root with all variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# MTN Mobile Money
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-subscription-key-here
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here
MOMO_TARGET_ENVIRONMENT=sandbox

# App URL (for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: VehicleDatabases.com
# VEHICLE_DATABASES_API_KEY=your-api-key-here
```

---

## Testing Checklist

After setting up all APIs, test each function:

### ✅ NHTSA API Test
- [ ] Enter a VIN on homepage
- [ ] Verify basic vehicle info appears
- [ ] Check if recalls are displayed

### ✅ Supabase Test
- [ ] Make a payment (creates user record)
- [ ] Check Supabase dashboard - verify user was created
- [ ] Verify payment record was saved
- [ ] Check VIN check history is saved

### ✅ MTN MoMo Test
- [ ] Initiate a payment
- [ ] Verify payment request is sent
- [ ] Approve payment on test phone
- [ ] Verify payment status updates
- [ ] Check payment record in Supabase

### ✅ Full Flow Test
- [ ] Enter VIN → Get free report
- [ ] Click "Unlock Full Report"
- [ ] Make payment via MoMo
- [ ] Verify full report unlocks
- [ ] Download PDF report

---

## Troubleshooting

### Supabase Issues
- **Connection Error:** Verify URL and anon key are correct
- **Table Not Found:** Run the migration SQL again
- **Permission Denied:** Check RLS policies

### MTN MoMo Issues
- **401 Unauthorized:** Check API credentials
- **Payment Not Processing:** Verify phone number format
- **Webhook Not Working:** Ensure URL is publicly accessible
- **Sandbox Issues:** Use provided test numbers

### NHTSA API Issues
- **No Data:** Some VINs may not have data in NHTSA database
- **Slow Response:** Normal - API can be slow at times

---

## Production Checklist

Before going live:

- [ ] Switch MTN MoMo to production environment
- [ ] Update all production environment variables
- [ ] Set up proper RLS policies in Supabase
- [ ] Configure production webhook URL
- [ ] Test all payment flows
- [ ] Set up monitoring/error tracking
- [ ] Configure backup for Supabase database
- [ ] Review and update security settings

---

## Support Resources

- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **MTN MoMo Docs:** [https://momodeveloper.mtn.com/docs](https://momodeveloper.mtn.com/docs)
- **NHTSA API Docs:** [https://vpic.nhtsa.dot.gov/api](https://vpic.nhtsa.dot.gov/api)
- **VehicleDatabases Docs:** Check their website for API documentation

---

**Need Help?** Check the main README.md file for additional troubleshooting tips.

