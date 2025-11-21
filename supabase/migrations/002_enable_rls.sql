-- Enable Row Level Security (RLS) on all tables
-- This ensures data security and proper access control

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on vin_checks table
ALTER TABLE vin_checks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR DEVELOPMENT/TESTING
-- These policies allow all operations for now
-- IMPORTANT: Review and restrict these for production!
-- ============================================

-- Users table policies
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- VIN checks table policies
CREATE POLICY "Allow all operations on vin_checks" ON vin_checks
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Payments table policies
CREATE POLICY "Allow all operations on payments" ON payments
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Subscriptions table policies
CREATE POLICY "Allow all operations on subscriptions" ON subscriptions
    FOR ALL
    USING (true)
    WITH CHECK (true);

