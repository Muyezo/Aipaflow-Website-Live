/*
  # Fix Demo Requests RLS and Permissions

  1. Changes
    - Drop all existing policies
    - Set up proper RLS for anonymous submissions
    - Configure admin read access
    - Grant necessary permissions
  
  2. Security
    - Enable RLS
    - Allow public submissions without authentication
    - Restrict read access to admins only
*/

-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "demo_requests_anon_insert" ON demo_requests;
  DROP POLICY IF EXISTS "demo_requests_admin_select" ON demo_requests;
  DROP POLICY IF EXISTS "enable_anonymous_inserts" ON demo_requests;
  DROP POLICY IF EXISTS "enable_admin_reads" ON demo_requests;
END $$;

-- Temporarily disable RLS to reset state
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for public submissions
CREATE POLICY "demo_requests_public_insert"
  ON demo_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for admin reads
CREATE POLICY "demo_requests_admin_read"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT INSERT ON TABLE demo_requests TO public;
GRANT INSERT ON TABLE demo_requests TO anon;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Grant sequence permissions
DO $$
DECLARE
  seq_name text;
BEGIN
  -- Find and grant permissions for the demo_requests id sequence
  SELECT pg_get_serial_sequence('demo_requests', 'id') INTO seq_name;
  
  IF seq_name IS NOT NULL THEN
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO public', seq_name);
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
  END IF;
END $$;

-- Grant UUID generation permissions
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO public;
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO anon;