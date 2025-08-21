-- Drop existing functions and views
DROP FUNCTION IF EXISTS get_blog_post_with_author CASCADE;
DROP FUNCTION IF EXISTS get_blog_posts_with_authors CASCADE;
DROP VIEW IF EXISTS blog_posts_with_author CASCADE;

-- Ensure blog_posts table has correct structure
DO $$ 
BEGIN
  -- Add author_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'blog_posts' 
    AND column_name = 'author_id'
  ) THEN
    ALTER TABLE blog_posts 
    ADD COLUMN author_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Update RLS policies
DROP POLICY IF EXISTS "anyone_can_read_published_posts" ON blog_posts;
CREATE POLICY "anyone_can_read_published_posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "authenticated_can_read_own_posts" ON blog_posts;
CREATE POLICY "authenticated_can_read_own_posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admins_can_create_posts" ON blog_posts;
CREATE POLICY "admins_can_create_posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admins_can_update_posts" ON blog_posts;
CREATE POLICY "admins_can_update_posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admins_can_delete_posts" ON blog_posts;
CREATE POLICY "admins_can_delete_posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON blog_posts TO authenticated;
GRANT SELECT ON blog_posts TO anon;
GRANT INSERT, UPDATE, DELETE ON blog_posts TO authenticated;