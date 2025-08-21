-- Drop all existing policies for demo_requests
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable public submissions" ON demo_requests;
  DROP POLICY IF EXISTS "Admins can read all demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Public can insert demo requests" ON demo_requests;
END $$;

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create a new public insert policy with no restrictions
CREATE POLICY "Public can insert demo requests"
  ON demo_requests
  FOR INSERT
  WITH CHECK (true);

-- Create admin read policy
CREATE POLICY "Admins can read all demo requests"
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

-- Grant necessary permissions
GRANT INSERT ON demo_requests TO public;
GRANT SELECT ON demo_requests TO authenticated;