-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable public submissions" ON demo_requests;
  DROP POLICY IF EXISTS "Admins can read all demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Public can insert demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Allow public inserts" ON demo_requests;
  DROP POLICY IF EXISTS "Allow admin reads" ON demo_requests;
END $$;

-- Temporarily disable RLS
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper configuration
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create a simple, permissive insert policy for public access
CREATE POLICY "Public insert access"
  ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create admin read policy
CREATE POLICY "Admin read access"
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

-- Grant table-specific permissions
GRANT INSERT ON TABLE demo_requests TO anon;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Grant sequence permissions
DO $$ 
DECLARE
  seq_name text;
BEGIN
  -- Get the sequence name for the demo_requests id column
  SELECT pg_get_serial_sequence('demo_requests', 'id') INTO seq_name;
  
  IF seq_name IS NOT NULL THEN
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
  END IF;

  -- Grant permissions on all sequences in public schema
  FOR seq_name IN 
    SELECT quote_ident(sequencename) 
    FROM pg_sequences 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated', seq_name);
  END LOOP;
END $$;