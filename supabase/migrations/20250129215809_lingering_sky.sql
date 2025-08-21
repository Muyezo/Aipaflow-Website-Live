/*
  # Fix Demo Requests Policies

  1. Changes
    - Safely drop existing policies
    - Re-create policies with proper checks
    - Grant necessary permissions
    - Ensure sequence access
  
  2. Security
    - Maintain RLS
    - Grant minimal required permissions
    - Ensure proper policy scoping
*/

-- Drop existing policies safely
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "enable_anonymous_inserts" ON demo_requests;
  DROP POLICY IF EXISTS "enable_admin_reads" ON demo_requests;
  DROP POLICY IF EXISTS "enable_insert_for_all" ON demo_requests;
  DROP POLICY IF EXISTS "enable_select_for_admins" ON demo_requests;
  DROP POLICY IF EXISTS "anyone_can_insert" ON demo_requests;
  DROP POLICY IF EXISTS "admins_can_read" ON demo_requests;
  DROP POLICY IF EXISTS "Public insert access" ON demo_requests;
  DROP POLICY IF EXISTS "Admin read access" ON demo_requests;
  DROP POLICY IF EXISTS "Allow public inserts" ON demo_requests;
  DROP POLICY IF EXISTS "Allow admin reads" ON demo_requests;
  DROP POLICY IF EXISTS "Public can insert demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Admins can read all demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Enable public submissions" ON demo_requests;
END $$;

-- Temporarily disable RLS
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "demo_requests_anon_insert" ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "demo_requests_admin_select" ON demo_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT INSERT ON TABLE demo_requests TO anon;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Ensure sequence access
DO $$
DECLARE
  seq_name text;
BEGIN
  -- Find and grant permissions for the demo_requests id sequence
  SELECT pg_get_serial_sequence('demo_requests', 'id') INTO seq_name;
  
  IF seq_name IS NOT NULL THEN
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
  END IF;
END $$;