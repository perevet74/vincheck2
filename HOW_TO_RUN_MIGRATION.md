# How to Run Database Migration SQL in Supabase

This guide shows you exactly how to run the database migration to create all the tables needed for your camVIN application.

## Method 1: Using Supabase Dashboard (Easiest - Recommended)

### Step 1: Log in to Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign In"** and log in to your account
3. Select your project (or create a new one if you haven't)

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"** (it has a `</>` icon)
2. You'll see a blank SQL editor window

### Step 3: Open the Migration File
1. In your project folder, navigate to: `supabase/migrations/001_initial_schema.sql`
2. Open this file in any text editor (VS Code, Notepad, etc.)
3. **Select All** the content (Ctrl+A or Cmd+A)
4. **Copy** the entire content (Ctrl+C or Cmd+C)

### Step 4: Paste and Run the SQL
1. Go back to Supabase SQL Editor
2. Click in the editor area
3. **Paste** the SQL code (Ctrl+V or Cmd+V)
4. You should see all the SQL statements pasted

### Step 5: Execute the Migration
1. Click the **"Run"** button (usually at the bottom right, or press `Ctrl+Enter`)
2. Wait a few seconds for execution
3. You should see a success message: **"Success. No rows returned"** or similar

### Step 6: Verify Tables Were Created
1. In the left sidebar, click on **"Table Editor"** (database icon)
2. You should now see 4 tables:
   - ✅ `users`
   - ✅ `vin_checks`
   - ✅ `payments`
   - ✅ `subscriptions`

**✅ Migration Complete!**

---

## Method 2: Using Supabase CLI (Advanced)

If you prefer using the command line:

### Step 1: Install Supabase CLI
```bash
# Using npm
npm install -g supabase

# Or using Homebrew (Mac)
brew install supabase/tap/supabase

# Or download from: https://github.com/supabase/cli/releases
```

### Step 2: Login to Supabase
```bash
supabase login
```
This will open your browser to authenticate.

### Step 3: Link Your Project
```bash
supabase link --project-ref your-project-ref
```
You can find your project ref in Supabase dashboard → Settings → General → Reference ID

### Step 4: Run Migration
```bash
supabase db push
```
This will apply all migrations in the `supabase/migrations/` folder.

---

## Troubleshooting

### Error: "relation already exists"
**Problem:** Tables already exist from a previous migration attempt.

**Solution:**
1. Option A: Delete existing tables first (in Table Editor, right-click table → Delete)
2. Option B: The migration uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run again

### Error: "permission denied"
**Problem:** You don't have permission to create tables.

**Solution:**
- Make sure you're using the correct Supabase project
- Check that you're logged in as the project owner
- Try using the SQL Editor with "Run as" set to "postgres" role

### Error: "extension uuid-ossp does not exist"
**Problem:** UUID extension not available.

**Solution:**
- This is rare, but if it happens, contact Supabase support
- Or manually enable it: Go to Database → Extensions → Enable "uuid-ossp"

### Tables Not Showing Up
**Problem:** Migration ran but tables aren't visible.

**Solution:**
1. Refresh the Table Editor page
2. Check if you're looking at the correct database/schema
3. Verify the migration actually ran (check SQL Editor history)

---

## What the Migration Creates

The migration creates:

1. **4 Tables:**
   - `users` - Stores user accounts
   - `vin_checks` - Stores VIN check history
   - `payments` - Stores payment records
   - `subscriptions` - Stores subscription information

2. **7 Indexes:**
   - For faster database queries

3. **1 Function:**
   - `update_updated_at_column()` - Automatically updates timestamps

4. **3 Triggers:**
   - Automatically update `updated_at` fields when records change

---

## Verification Checklist

After running the migration, verify:

- [ ] Can see all 4 tables in Table Editor
- [ ] Each table has the correct columns
- [ ] Can insert a test record (optional)
- [ ] No error messages in SQL Editor

---

## Next Steps

After migration is complete:

1. ✅ Add Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. ✅ Test the connection by running your app:
   ```bash
   npm run dev
   ```

3. ✅ Try creating a user or making a payment to verify database works

---

## Need Help?

- **Supabase Docs:** [https://supabase.com/docs/guides/database](https://supabase.com/docs/guides/database)
- **SQL Editor Guide:** [https://supabase.com/docs/guides/database/tables](https://supabase.com/docs/guides/database/tables)
- **Supabase Discord:** Join for community support

