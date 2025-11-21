# Enable Row Level Security (RLS) on Supabase Tables

Your tables are currently showing as "unrestricted" which means Row Level Security (RLS) is not enabled. This guide will help you enable RLS for proper security.

## What is RLS?

Row Level Security (RLS) is a security feature that controls which rows users can access in database tables. Without RLS, anyone with your API key can access all data.

## Quick Fix: Enable RLS

### Option 1: Run the Migration SQL (Recommended)

I've created a new migration file for you. Follow these steps:

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Click "SQL Editor" in the left sidebar

2. **Open the new migration file**
   - In your project, open: `supabase/migrations/002_enable_rls.sql`
   - Copy all the content (Ctrl+A, Ctrl+C)

3. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)

4. **Verify**
   - Go to "Table Editor"
   - Click on any table (e.g., `users`)
   - You should now see "RLS enabled" instead of "unrestricted"

### Option 2: Enable Manually in Dashboard

1. **Go to Table Editor**
   - Click "Table Editor" in left sidebar
   - Select a table (e.g., `users`)

2. **Enable RLS**
   - Click on the table name
   - Look for "RLS" or "Row Level Security" toggle
   - Turn it ON
   - Repeat for all 4 tables: `users`, `vin_checks`, `payments`, `subscriptions`

3. **Create Policies**
   - For each table, go to "Policies" tab
   - Click "New Policy"
   - Choose "For full customization"
   - Name: "Allow all operations" (for development)
   - Policy definition:
     ```sql
     USING (true)
     WITH CHECK (true)
     ```
   - Save policy

---

## Current Policies (Development Mode)

The migration I created sets up **permissive policies** that allow all operations. This is fine for:
- ✅ Development
- ✅ Testing
- ✅ Getting started

**But NOT for production!**

---

## Production Security (For Later)

When you're ready for production, you should restrict policies. Here's an example for better security:

### Example: Users can only see their own data

```sql
-- Drop the permissive policy
DROP POLICY IF EXISTS "Allow all operations on users" ON users;

-- Create restricted policy
CREATE POLICY "Users can read own data" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);
```

### Example: Payments - Service role can insert, users can read their own

```sql
-- Drop permissive policy
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;

-- Service role can do everything (for server-side operations)
CREATE POLICY "Service role full access" ON payments
    FOR ALL
    USING (auth.role() = 'service_role');

-- Users can read their own payments
CREATE POLICY "Users can read own payments" ON payments
    FOR SELECT
    USING (auth.uid()::text = user_id::text);
```

---

## Verify RLS is Enabled

After running the migration:

1. Go to **Table Editor**
2. Click on each table
3. You should see:
   - ✅ "RLS enabled" (green checkmark)
   - ❌ NOT "unrestricted"

### Check All Tables:
- [ ] `users` - RLS enabled
- [ ] `vin_checks` - RLS enabled
- [ ] `payments` - RLS enabled
- [ ] `subscriptions` - RLS enabled

---

## Troubleshooting

### "Policy already exists" Error
- This means RLS was already enabled
- You can ignore this error or drop existing policies first

### "Permission denied" Error
- Make sure you're logged in as project owner
- Try running as "postgres" role in SQL Editor

### Tables Still Show "Unrestricted"
- Refresh the Table Editor page
- Check if you ran the SQL correctly
- Verify policies were created (go to table → Policies tab)

---

## Next Steps

1. ✅ Enable RLS on all tables (run the migration)
2. ✅ Test your application - it should still work
3. ⚠️ For production: Review and restrict policies based on your needs
4. 📚 Learn more: [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

---

## Why This Matters

Without RLS:
- ❌ Anyone with your API key can access all data
- ❌ Users can see other users' data
- ❌ Security risk in production

With RLS:
- ✅ Data access is controlled
- ✅ Users can only access their own data (with proper policies)
- ✅ More secure for production

---

**Note:** The current permissive policies allow everything, which is fine for development. Just remember to tighten security before going to production!

