# Quick MTN Mobile Money Setup Guide

This is a step-by-step guide to get MTN Mobile Money payments working on your website.

## Step 1: Get MTN MoMo API Credentials

### 1.1 Create Developer Account
1. Go to [https://momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Click **"Sign Up"** and create an account
3. Verify your email and phone number

### 1.2 Create a Product
1. After logging in, go to **"Products"** or **"My Apps"**
2. Click **"Create Product"** or **"New App"**
3. Fill in:
   - **Product Name:** `camVIN` (or your choice)
   - **Environment:** Select **"Sandbox"** (for testing)
   - **Callback URL:** Leave blank for now (we'll add it later)
4. Click **"Submit"** and wait for approval (usually instant for sandbox)

### 1.3 Get Your Credentials
Once your product is approved:

1. **Subscription Key:**
   - Go to your product dashboard
   - Find **"Subscription Key (Primary)"** or **"Primary Key"**
   - Click **"Show"** or **"Copy"** to reveal it
   - Copy and save it

2. **API User:**
   - Go to **"API Users"** tab
   - Click **"Create API User"**
   - Enter **Provider Callback Host:** `http://localhost:3000` (for local testing)
   - Click **"Create"**
   - Save the **API User ID**

3. **API Key:**
   - Still in **"API Users"** section
   - Find your API User
   - Click **"Generate API Key"**
   - **⚠️ IMPORTANT:** Copy this immediately - you won't see it again!
   - Save it securely

---

## Step 2: Add Credentials to Your Project

### 2.1 Create/Edit .env.local File
1. In your project root folder (same level as `package.json`)
2. Create or open `.env.local` file
3. Add these lines:

```env
# MTN Mobile Money Configuration
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-subscription-key-here
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here
MOMO_TARGET_ENVIRONMENT=sandbox
```

### 2.2 Replace Placeholder Values
Replace the placeholders with your actual credentials:

```env
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
MOMO_API_USER=12345678-1234-1234-1234-123456789012
MOMO_API_KEY=9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3
MOMO_TARGET_ENVIRONMENT=sandbox
```

**Important:**
- ✅ No quotes around values
- ✅ No spaces around `=` sign
- ✅ Each variable on its own line

---

## Step 3: Restart Your Development Server

After adding credentials:

1. **Stop your server** (if running):
   - Press `Ctrl+C` in the terminal

2. **Start it again:**
   ```bash
   npm run dev
   ```

**Why?** Next.js only reads `.env.local` when the server starts.

---

## Step 4: Test the Integration

### 4.1 Get Sandbox Test Number
1. In MTN Developer Portal, go to **"Sandbox"** or **"Testing"** section
2. Look for **"Test Phone Numbers"**
3. Use the provided test number (format: `46733123456`)

### 4.2 Test Payment Flow
1. Go to your website: `http://localhost:3000`
2. Enter a VIN (e.g., `1HGBH41JXMN109186`)
3. Click **"Unlock Full Report"**
4. Click **"Pay with MTN MoMo"** button
5. Enter the sandbox test phone number
6. Click **"Pay Now"**
7. In MTN Developer Portal, approve the payment
8. Payment should complete successfully

---

## Step 5: Verify It's Working

### Check These:
- [ ] Payment dialog opens when clicking "Pay with MTN MoMo"
- [ ] Phone number input accepts 9 digits
- [ ] Payment request is sent (check browser console - F12)
- [ ] No error messages appear
- [ ] Payment status updates correctly

### Common Issues:

**Error: "401 Unauthorized"**
- ✅ Check your credentials are correct in `.env.local`
- ✅ Make sure no extra spaces
- ✅ Verify credentials are for sandbox (not production)

**Error: "Invalid phone number"**
- ✅ Use format: `677123456` (9 digits, no spaces)
- ✅ For sandbox, use test numbers from MTN portal

**Payment stuck on "pending"**
- ✅ Check MTN Developer Portal → Transactions
- ✅ Manually approve the payment in sandbox
- ✅ Check browser console for errors

---

## Step 6: For Production (When Ready)

When you're ready to go live:

1. **Request Production Access:**
   - In MTN Developer Portal, request production access
   - Wait for approval (1-3 business days)

2. **Update Environment Variables:**
   ```env
   MOMO_API_BASE_URL=https://momodeveloper.mtn.com
   MOMO_SUBSCRIPTION_KEY=your-production-subscription-key
   MOMO_API_USER=your-production-api-user-id
   MOMO_API_KEY=your-production-api-key
   MOMO_TARGET_ENVIRONMENT=production
   ```

3. **Set Up Webhook:**
   - In MTN Developer Portal → Product Settings
   - Add webhook URL: `https://yourdomain.com/api/momo/callback`
   - Save

4. **Deploy:**
   - Deploy your app (Vercel, Netlify, etc.)
   - Add environment variables in your hosting platform
   - Test with a real payment (small amount first)

---

## Quick Checklist

Before testing, make sure:

- [ ] MTN Developer account created
- [ ] Product/App created in sandbox
- [ ] Subscription Key obtained
- [ ] API User created
- [ ] API Key generated and saved
- [ ] All credentials added to `.env.local`
- [ ] Dev server restarted
- [ ] Test phone number ready

---

## File Structure

Your MTN MoMo integration uses these files:

```
lib/
  └── momo.ts                    # Core MTN MoMo functions

app/api/momo/
  ├── request-payment/
  │   └── route.ts              # Initiates payment
  ├── check-status/
  │   └── route.ts              # Checks payment status
  └── callback/
      └── route.ts              # Webhook endpoint

components/
  └── MoMoPaymentButton.tsx     # Payment button UI
```

---

## Need Help?

**Check these:**
1. Browser console (F12) for errors
2. Server terminal for error messages
3. MTN Developer Portal → Transactions for payment status
4. `.env.local` file has correct credentials

**Common Solutions:**
- Restart dev server after changing `.env.local`
- Verify credentials in MTN Developer Portal
- Use sandbox test numbers for testing
- Check internet connection

---

## Example .env.local File

Here's a complete example (replace with your actual values):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# MTN Mobile Money
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-subscription-key
MOMO_API_USER=your-api-user-id
MOMO_API_KEY=your-api-key
MOMO_TARGET_ENVIRONMENT=sandbox

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

**That's it!** Your MTN Mobile Money integration should now work. Test it with a sandbox payment first before going to production.

