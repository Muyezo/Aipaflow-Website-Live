-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "anyone_can_insert" ON demo_requests;
  DROP POLICY IF EXISTS "admins_can_read" ON demo_requests;
END $$;

-- Temporarily disable RLS
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "enable_insert_for_all"
  ON demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "enable_select_for_admins"
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
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT INSERT ON TABLE demo_requests TO anon;
GRANT INSERT ON TABLE demo_requests TO authenticated;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Grant UUID generation permissions
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO anon;
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO authenticated;

-- Grant sequence permissions
DO $$
DECLARE
  seq_name text;
BEGIN
  -- Grant for existing sequences
  FOR seq_name IN 
    SELECT quote_ident(sequencename) 
    FROM pg_sequences 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated', seq_name);
  END LOOP;

  -- Set default privileges for future sequences
  ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO anon;
  
  ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
END $$;