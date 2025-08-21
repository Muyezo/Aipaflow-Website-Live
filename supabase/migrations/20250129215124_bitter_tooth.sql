-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "enable_insert_for_all" ON demo_requests;
  DROP POLICY IF EXISTS "enable_select_for_admins" ON demo_requests;
END $$;

-- Disable RLS temporarily
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy for anonymous inserts
CREATE POLICY "enable_anonymous_inserts"
  ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create a policy for admin reads
CREATE POLICY "enable_admin_reads"
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

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant specific table permissions
GRANT INSERT ON TABLE demo_requests TO anon;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Grant UUID generation permissions
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO anon;

-- Ensure sequence permissions for demo_requests
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