-- Drop existing functions and views
DROP FUNCTION IF EXISTS get_blog_post_with_author CASCADE;
DROP FUNCTION IF EXISTS get_blog_posts_with_authors CASCADE;
DROP VIEW IF EXISTS blog_posts_with_author CASCADE;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON blog_posts;

-- Drop existing trigger function if it exists
DROP FUNCTION IF EXISTS handle_blog_updated_at CASCADE;

-- Recreate blog_posts table with proper structure
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id)
    REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Create RLS policies
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
  DROP POLICY IF EXISTS "Admins can read all posts" ON blog_posts;
  DROP POLICY IF EXISTS "Admins can insert posts" ON blog_posts;
  DROP POLICY IF EXISTS "Admins can update posts" ON blog_posts;
  DROP POLICY IF EXISTS "Admins can delete posts" ON blog_posts;

  -- Create new policies
  CREATE POLICY "Public can read published posts"
    ON blog_posts
    FOR SELECT
    USING (status = 'published');

  CREATE POLICY "Admins can read all posts"
    ON blog_posts
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );

  CREATE POLICY "Admins can insert posts"
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

  CREATE POLICY "Admins can update posts"
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

  CREATE POLICY "Admins can delete posts"
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
END $$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION handle_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_blog_posts_updated_at'
  ) THEN
    CREATE TRIGGER set_blog_posts_updated_at
      BEFORE UPDATE ON blog_posts
      FOR EACH ROW
      EXECUTE FUNCTION handle_blog_updated_at();
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON blog_posts TO authenticated;
GRANT SELECT ON blog_posts TO anon;
GRANT INSERT, UPDATE, DELETE ON blog_posts TO authenticated;