/*
  # Demo Requests Schema

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text) 
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `job_title` (text)
      - `industry` (text)
      - `company_size` (text)
      - `message` (text)
      - `status` (text) - For tracking request status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admin access
    - Add policy for public submission
*/

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

-- Enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow public submissions
CREATE POLICY "Enable public submissions" ON demo_requests
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Allow admins to read all requests
CREATE POLICY "Admins can read all demo requests" ON demo_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_demo_requests_email ON demo_requests(email);
CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at);

-- Add trigger for updated_at
CREATE TRIGGER set_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();