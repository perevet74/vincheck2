# How to Add Supabase Credentials to .env.local

This guide shows you exactly how to find your Supabase credentials and add them to your `.env.local` file.

## Step 1: Find Your Supabase Credentials

### In Supabase Dashboard:

1. **Log in to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Go to Settings**
   - Click the **gear icon** (⚙️) in the left sidebar
   - This opens the Settings menu

3. **Click on "API"**
   - In the Settings menu, click **"API"**
   - This shows all your API credentials

4. **Find Your Credentials**
   You'll see two important values:

   **a) Project URL:**
   - Look for **"Project URL"** or **"URL"**
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL

   **b) anon/public key:**
   - Look for **"anon"** or **"public"** key
   - It's a long string starting with `eyJ...`
   - Click the **eye icon** 👁️ to reveal it (if hidden)
   - Click **"Copy"** button to copy it

   **Example of what you'll see:**
   ```
   Project URL: https://abcdefghijklmnop.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzIwMCwiZXhwIjoxOTU0NTQzMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## Step 2: Add Credentials to .env.local

### Option A: Edit the Existing File

1. **Open `.env.local` file**
   - In your project root folder, open `.env.local`
   - If it doesn't exist, create it (see Option B)

2. **Replace the placeholder values:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzIwMCwiZXhwIj6MTk1NDU0MzIwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Save the file**

### Option B: Create New .env.local File

1. **Create the file**
   - In your project root folder (same level as `package.json`)
   - Create a new file named `.env.local`
   - **Important:** Make sure it starts with a dot (`.env.local`)

2. **Add the content:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

   # MTN Mobile Money (add later)
   MOMO_API_BASE_URL=https://sandbox.momodeveloper.mtn.com
   MOMO_SUBSCRIPTION_KEY=your_momo_subscription_key_here
   MOMO_API_USER=your_momo_api_user_here
   MOMO_API_KEY=your_momo_api_key_here
   MOMO_TARGET_ENVIRONMENT=sandbox

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Replace with your actual values:**
   - Replace `https://your-project-id.supabase.co` with your actual Project URL
   - Replace `your-anon-key-here` with your actual anon key

4. **Save the file**

---

## Step 3: Verify the Format

Your `.env.local` file should look like this (with YOUR actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzIwMCwiZXhwIjoxOTU0NTQzMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important Notes:**
- ✅ No quotes needed around the values
- ✅ No spaces around the `=` sign
- ✅ Each variable on its own line
- ✅ Lines starting with `#` are comments (ignored)

---

## Step 4: Restart Your Development Server

After adding credentials:

1. **Stop your server** (if running)
   - Press `Ctrl+C` in the terminal

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Why?** Next.js only reads `.env.local` when the server starts

---

## Step 5: Test the Connection

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Check for errors:**
   - If you see "Missing Supabase environment variables" → Check your `.env.local` file
   - If no errors → Connection is working! ✅

3. **Test in browser:**
   - Go to `http://localhost:3000`
   - Try entering a VIN
   - If it works, Supabase is connected! ✅

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
**Problem:** The app can't find your credentials.

**Solutions:**
1. ✅ Check file name is exactly `.env.local` (with the dot)
2. ✅ Check file is in project root (same folder as `package.json`)
3. ✅ Check variable names are correct (case-sensitive):
   - `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `ANON_KEY`)
4. ✅ Restart your dev server after adding credentials

### Error: "Invalid API key"
**Problem:** The anon key is wrong or incomplete.

**Solutions:**
1. ✅ Go back to Supabase → Settings → API
2. ✅ Make sure you copied the ENTIRE key (it's very long)
3. ✅ Click the eye icon to reveal it if hidden
4. ✅ Copy again and paste into `.env.local`
5. ✅ No extra spaces or line breaks

### File Not Found
**Problem:** Can't find `.env.local` file.

**Solutions:**
1. ✅ Make sure file name starts with a dot: `.env.local`
2. ✅ Some editors hide dot-files - check "Show hidden files"
3. ✅ Create it in the project root (not in a subfolder)

### Still Not Working?
1. ✅ Double-check you're using the **anon/public** key (not service_role key)
2. ✅ Verify Project URL is correct (should end with `.supabase.co`)
3. ✅ Make sure you saved the file
4. ✅ Restart the dev server completely

---

## Security Notes

⚠️ **Important:**
- ✅ `.env.local` is already in `.gitignore` (won't be committed to Git)
- ✅ Never share your credentials publicly
- ✅ Never commit `.env.local` to version control
- ✅ Use different credentials for production

---

## Visual Guide: Where to Find Credentials

```
Supabase Dashboard
│
├── Settings (⚙️ icon)
│   │
│   └── API
│       │
│       ├── Project URL: https://xxxxx.supabase.co  ← Copy this
│       │
│       └── anon public: eyJhbGci...  ← Copy this (click 👁️ to reveal)
│
└── .env.local (in your project)
    │
    └── Paste the values here:
        NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
        NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Quick Checklist

- [ ] Logged into Supabase dashboard
- [ ] Went to Settings → API
- [ ] Copied Project URL
- [ ] Copied anon/public key
- [ ] Created/edited `.env.local` file
- [ ] Added both credentials (with correct variable names)
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Tested the connection

---

**Done!** Your Supabase credentials are now configured. Your app should be able to connect to the database.

