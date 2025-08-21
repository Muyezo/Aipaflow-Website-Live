-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable public submissions" ON demo_requests;
  DROP POLICY IF EXISTS "Admins can read all demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Public can insert demo requests" ON demo_requests;
END $$;

-- Temporarily disable RLS
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper configuration
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create a simple, permissive insert policy for public access
CREATE POLICY "Allow public inserts"
  ON demo_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create admin read policy
CREATE POLICY "Allow admin reads"
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

-- Grant explicit permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT INSERT ON TABLE demo_requests TO anon;
GRANT INSERT ON TABLE demo_requests TO public;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Ensure sequences are accessible
DO $$ 
BEGIN
  EXECUTE format(
    'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA %I TO anon',
    'public'
  );
  EXECUTE format(
    'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA %I TO authenticated',
    'public'
  );
END $$;