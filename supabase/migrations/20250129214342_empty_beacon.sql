-- Safely create or update demo_requests table
DO $$ 
BEGIN
  -- Create table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'demo_requests') THEN
    CREATE TABLE demo_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      company text NOT NULL,
      job_title text NOT NULL,
      industry text NOT NULL,
      company_size text NOT NULL,
      message text,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Create indexes
    CREATE INDEX idx_demo_requests_email ON demo_requests(email);
    CREATE INDEX idx_demo_requests_status ON demo_requests(status);
    CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at);
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable public submissions" ON demo_requests;
  DROP POLICY IF EXISTS "Admins can read all demo requests" ON demo_requests;
END $$;

-- Create new policies
CREATE POLICY "Enable public submissions"
  ON demo_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

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

-- Ensure updated_at trigger exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'set_demo_requests_updated_at'
  ) THEN
    CREATE TRIGGER set_demo_requests_updated_at
      BEFORE UPDATE ON demo_requests
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;