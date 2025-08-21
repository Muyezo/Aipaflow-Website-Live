/*
  # Storage permissions for blog images

  1. Changes
    - Create storage schema if it doesn't exist
    - Create storage bucket for blog images
    - Grant necessary permissions for storage access
    - Add RLS policies for storage bucket

  2. Security
    - Enable RLS on storage.buckets and storage.objects
    - Add policies for authenticated users to manage their uploads
    - Add policies for public access to read images
*/

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for storage.buckets
CREATE POLICY "Authenticated users can create buckets"
  ON storage.buckets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Public users can view buckets"
  ON storage.buckets
  FOR SELECT
  TO public
  USING (true);

-- Create policies for storage.objects
CREATE POLICY "Authenticated users can upload objects"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update own objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner);

CREATE POLICY "Public users can read blog images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;

-- Grant access to buckets
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO service_role;

-- Grant access to objects
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO service_role;