/*
  # Add user roles and update blog permissions

  1. Schema Updates
    - Add `role` column to profiles table
    - Add role-based policies for blog management

  2. Security Updates
    - Update blog post policies to restrict management to admin users
    - Add policies for regular users to only view and comment

  3. Changes
    - Modify existing blog post policies
    - Add role-based access control
*/

-- Add role column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user' 
CHECK (role IN ('user', 'admin'));

-- Create index for role column
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Drop existing blog policies
DROP POLICY IF EXISTS "Authors can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON blog_posts;

-- Create new admin-only policies for blog posts
CREATE POLICY "Admins can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

CREATE POLICY "Admins can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

CREATE POLICY "Admins can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on blog_comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Public can read comments"
  ON blog_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON blog_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON blog_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON blog_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Add trigger for updated_at
CREATE TRIGGER set_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for comments
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_author_id ON blog_comments(author_id);

-- Update handle_new_user function to set default role
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create profile with default user role
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  -- Create user settings
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;