-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable public submissions" ON demo_requests;
  DROP POLICY IF EXISTS "Admins can read all demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Public can insert demo requests" ON demo_requests;
  DROP POLICY IF EXISTS "Allow public inserts" ON demo_requests;
  DROP POLICY IF EXISTS "Allow admin reads" ON demo_requests;
  DROP POLICY IF EXISTS "Public insert access" ON demo_requests;
  DROP POLICY IF EXISTS "Admin read access" ON demo_requests;
END $$;

-- Temporarily disable RLS
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert
CREATE POLICY "anyone_can_insert" ON demo_requests FOR INSERT WITH CHECK (true);

-- Create a policy that allows admins to read
CREATE POLICY "admins_can_read" ON demo_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Grant necessary permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT INSERT ON TABLE demo_requests TO anon;
GRANT INSERT ON TABLE demo_requests TO authenticated;
GRANT SELECT ON TABLE demo_requests TO authenticated;

-- Grant access to the uuid-ossp extension if used for gen_random_uuid()
GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT EXECUTE ON FUNCTION extensions.uuid_generate_v4() TO anon;
GRANT EXECUTE ON FUNCTION extensions.uuid_generate_v4() TO authenticated;

-- Grant access to all sequences
DO $$
DECLARE
    seq_name text;
BEGIN
    FOR seq_name IN 
        SELECT quote_ident(sequencename) 
        FROM pg_sequences 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
        EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated', seq_name);
    END LOOP;
END $$;