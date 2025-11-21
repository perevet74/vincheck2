# Complete MTN Mobile Money API Setup Guide

This is a detailed, step-by-step guide to set up MTN Mobile Money (MoMo) API for your camVIN application.

## Overview

MTN Mobile Money API allows you to:
- Accept payments from MTN Mobile Money users
- Process one-time payments (500 FCFA per report)
- Process monthly subscriptions (7,500 FCFA per month)
- Receive payment confirmations via webhooks

---

## Step 1: Create MTN MoMo Developer Account

### 1.1 Sign Up
1. Go to [https://momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Click **"Sign Up"** or **"Register"** button
3. Fill in your registration details:
   - **Email address** (use a business email if possible)
   - **Phone number** (MTN number preferred)
   - **Country:** Select **Cameroon**
   - **Business/Company name**
   - **Password** (create a strong password)
4. Accept terms and conditions
5. Click **"Register"** or **"Sign Up"**

### 1.2 Verify Your Account
1. Check your email for verification link
2. Click the verification link
3. Verify your phone number (you'll receive an SMS code)
4. Enter the verification code
5. Complete your profile information

### 1.3 Complete Business Verification
MTN may require business verification documents:
- Business registration certificate (if applicable)
- ID document
- Proof of address
- Business bank account details (if required)

**Note:** Verification can take 1-3 business days. You can still use the sandbox environment while waiting.

---

## Step 2: Create a Product/App

### 2.1 Navigate to Products
1. After logging in, go to **"Products"** or **"My Apps"** in the dashboard
2. Click **"Create Product"** or **"New App"** button

### 2.2 Fill in Product Details
Fill in the following information:

- **Product Name:** `camVIN VIN Check Service` (or your preferred name)
- **Description:** `Vehicle VIN history check service with payment processing`
- **Category:** Select **"E-commerce"** or **"Services"**
- **Environment:** Select **"Sandbox"** (for testing)
  - You'll switch to **"Production"** later when ready
- **Callback URL:** 
  - For local testing: Use ngrok or similar (see Step 6)
  - For production: `https://yourdomain.com/api/momo/callback`
- **Website URL:** Your website URL (if available)

### 2.3 Submit for Approval
1. Review all information
2. Click **"Submit"** or **"Create Product"**
3. Wait for approval (usually instant for sandbox, 1-3 days for production)

---

## Step 3: Get Your API Credentials

Once your product is approved, you need to get your API credentials.

### 3.1 Find Your Subscription Key
1. Go to your product dashboard
2. Look for **"API Keys"** or **"Credentials"** section
3. Find **"Subscription Key (Primary)"** or **"Primary Key"**
4. Click **"Show"** or **"Copy"** to reveal it
5. **Copy and save this key** - you'll need it for `.env.local`

**What it looks like:**
```
Subscription Key: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 3.2 Create API User (if needed)
Some accounts require creating an API User:

1. In your product dashboard, go to **"API Users"** tab
2. Click **"Create API User"** or **"Add User"**
3. Fill in:
   - **Provider Callback Host:** 
     - For local: `http://localhost:3000` or your ngrok URL
     - For production: `https://yourdomain.com`
4. Click **"Create"** or **"Save"**
5. **Save the API User ID** - you'll need this

**What it looks like:**
```
API User: 12345678-1234-1234-1234-123456789012
```

### 3.3 Generate API Key
1. Still in **"API Users"** section
2. Find your API User (the one you just created)
3. Click **"Generate API Key"** or **"Create Key"**
4. **⚠️ IMPORTANT:** Copy this key immediately!
   - You won't be able to see it again
   - If you lose it, you'll need to generate a new one
5. Save it securely

**What it looks like:**
```
API Key: 9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3
```

---

## Step 4: Set Up Webhook (Callback URL)

### 4.1 For Local Development (Using ngrok)

**What is ngrok?**
ngrok creates a public URL that tunnels to your local server, allowing MTN to send webhooks to your local development environment.

#### Install ngrok:
1. Go to [https://ngrok.com](https://ngrok.com)
2. Sign up for a free account
3. Download ngrok for Windows
4. Extract the `.exe` file to a folder (e.g., `C:\ngrok\`)
5. Add ngrok to your PATH (optional but recommended)

#### Run ngrok:
1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```
2. In a new terminal, run:
   ```bash
   ngrok http 3000
   ```
3. You'll see output like:
   ```
   Forwarding  https://abc123.ngrok.io -> http://localhost:3000
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

#### Configure in MTN Portal:
1. Go to your product settings in MTN Developer Portal
2. Find **"Webhooks"** or **"Callbacks"** section
3. Add webhook URL:
   ```
   https://your-ngrok-url.ngrok.io/api/momo/callback
   ```
4. Save

**Note:** Free ngrok URLs change each time you restart ngrok. For production, use your actual domain.

### 4.2 For Production

1. Deploy your application (Vercel, Netlify, etc.)
2. Get your production domain (e.g., `https://camvin.com`)
3. In MTN Developer Portal → Product Settings → Webhooks
4. Add webhook URL:
   ```
   https://yourdomain.com/api/momo/callback
   ```
5. Save

---

## Step 5: Add Credentials to .env.local

1. Open your `.env.local` file in the project root
2. Add or update the MTN MoMo section:

```env
# MTN Mobile Money Configuration
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-subscription-key-here
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here
MOMO_TARGET_ENVIRONMENT=sandbox
```

3. Replace the placeholder values:
   - `your-subscription-key-here` → Your Subscription Key from Step 3.1
   - `your-api-user-id-here` → Your API User ID from Step 3.2
   - `your-api-key-here` → Your API Key from Step 3.3

4. Save the file

**Example:**
```env
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
MOMO_API_USER=12345678-1234-1234-1234-123456789012
MOMO_API_KEY=9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3
MOMO_TARGET_ENVIRONMENT=sandbox
```

---

## Step 6: Test in Sandbox

### 6.1 Get Sandbox Test Numbers
1. In MTN Developer Portal, go to **"Sandbox"** or **"Testing"** section
2. Look for **"Test Phone Numbers"** or **"Sandbox Numbers"**
3. MTN provides test numbers for sandbox testing
4. These numbers don't require real money

**Example test number format:**
```
46733123456
```
(Country code + test number)

### 6.2 Test Payment Flow
1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Start ngrok** (if testing webhooks locally):
   ```bash
   ngrok http 3000
   ```

3. **Test the payment:**
   - Go to your website: `http://localhost:3000`
   - Enter a VIN
   - Click "Unlock Full Report"
   - Select payment option
   - Enter a sandbox test phone number
   - Click "Pay with Mobile Money"

4. **Check payment status:**
   - In MTN Developer Portal → Transactions
   - You should see the payment request
   - Approve it (sandbox allows you to approve/reject)

5. **Verify in your app:**
   - Payment should be processed
   - Full report should unlock
   - Check Supabase database for payment record

---

## Step 7: Switch to Production

When you're ready to go live:

### 7.1 Request Production Access
1. In MTN Developer Portal, go to your product
2. Request production access (may require additional verification)
3. Wait for approval (1-3 business days)

### 7.2 Update Environment Variables
Update your `.env.local` (or production environment variables):

```env
# Production MTN Mobile Money
MOMO_API_BASE_URL=https://momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-production-subscription-key
MOMO_API_USER=your-production-api-user-id
MOMO_API_KEY=your-production-api-key
MOMO_TARGET_ENVIRONMENT=production
```

**Important:** Production credentials are different from sandbox!

### 7.3 Update Webhook URL
1. In MTN Developer Portal → Product Settings
2. Update webhook URL to your production domain:
   ```
   https://yourdomain.com/api/momo/callback
   ```
3. Save

### 7.4 Test Production
1. Test with a small amount first
2. Use your own MTN Mobile Money number
3. Verify payment is processed correctly
4. Check webhook is receiving callbacks

---

## Troubleshooting

### Error: "401 Unauthorized"
**Problem:** Invalid API credentials

**Solutions:**
- ✅ Double-check Subscription Key, API User, and API Key
- ✅ Make sure no extra spaces in `.env.local`
- ✅ Verify credentials are for the correct environment (sandbox vs production)
- ✅ Regenerate API Key if needed

### Error: "Invalid phone number"
**Problem:** Phone number format is incorrect

**Solutions:**
- ✅ Use format: `46733123456` (country code + number, no spaces)
- ✅ For Cameroon: `237` + 9-digit number starting with 6
- ✅ Remove all spaces, dashes, and plus signs

### Error: "Webhook not receiving callbacks"
**Problem:** Webhook URL is not accessible

**Solutions:**
- ✅ Verify webhook URL is publicly accessible
- ✅ For local: Make sure ngrok is running
- ✅ Check webhook URL in MTN portal is correct
- ✅ Test webhook URL manually (should return 200 OK)

### Error: "Payment stuck in pending"
**Problem:** Payment status not updating

**Solutions:**
- ✅ Check if webhook is configured correctly
- ✅ Verify webhook endpoint is working (`/api/momo/callback`)
- ✅ Check server logs for webhook calls
- ✅ Manually check payment status in MTN portal

### Payment Not Appearing on Phone
**Problem:** User not receiving payment request

**Solutions:**
- ✅ Verify phone number is correct and active
- ✅ Check if user has Mobile Money enabled
- ✅ Verify you're using correct environment (sandbox vs production)
- ✅ Check MTN portal for payment status

---

## Security Best Practices

1. **Never commit `.env.local` to Git**
   - Already in `.gitignore`
   - Keep credentials secret

2. **Use different credentials for sandbox and production**
   - Never mix environments

3. **Rotate API keys regularly**
   - Generate new keys periodically
   - Update in `.env.local`

4. **Use environment variables in production**
   - Don't hardcode credentials
   - Use your hosting platform's environment variables

5. **Monitor transactions**
   - Regularly check MTN portal for suspicious activity
   - Set up alerts if available

---

## Quick Reference

### Environment Variables
```env
MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_SUBSCRIPTION_KEY=your-key
MOMO_API_USER=your-user-id
MOMO_API_KEY=your-api-key
MOMO_TARGET_ENVIRONMENT=sandbox
```

### Phone Number Format
- **Input:** `677123456` or `677 123 456`
- **API Format:** `4677123456` (country code + number)
- **Cameroon:** `237` + 9 digits starting with 6

### Webhook Endpoint
- **Local:** `https://ngrok-url.ngrok.io/api/momo/callback`
- **Production:** `https://yourdomain.com/api/momo/callback`

### Test Numbers
- Check MTN Developer Portal → Sandbox section
- Use provided test numbers for sandbox testing

---

## Support Resources

- **MTN MoMo Developer Portal:** [https://momodeveloper.mtn.com](https://momodeveloper.mtn.com)
- **MTN MoMo Documentation:** Check the "Documentation" section in the portal
- **MTN Support:** Contact through the developer portal
- **API Status:** Check portal for API status and maintenance

---

## Checklist

Before going live, make sure:

- [ ] MTN Developer account created and verified
- [ ] Product/App created and approved
- [ ] Subscription Key obtained
- [ ] API User created
- [ ] API Key generated and saved
- [ ] Webhook URL configured
- [ ] Credentials added to `.env.local`
- [ ] Tested in sandbox successfully
- [ ] Production access requested (if going live)
- [ ] Production credentials configured
- [ ] Production webhook URL set
- [ ] Tested with real payment (small amount)

---

**Need Help?** If you encounter issues, check the troubleshooting section above or contact MTN Developer Support through the portal.

